export enum BufferTarget {
    ARRAY = "BUFFER_TARGET_ARRAY"
}

export enum BufferType {
    UNSIGNED_INTEGER_8BIT = "BUFFER_TYPE_UNSIGNED_INTEGER_8BIT",
    UNSIGNED_INTEGER_16BIT = "BUFFER_TYPE_UNSIGNED_INTEGER_16BIT",
    UNSIGNED_INTEGER_32BIT = "BUFFER_TYPE_UNSIGNED_INTEGER_32BIT",
    INTEGER_8BIT = "BUFFER_TYPE_INTEGER_8BIT",
    INTEGER_16BIT = "BUFFER_TYPE_INTEGER_16BIT",
    INTEGER_32BIT = "BUFFER_TYPE_INTEGER_32BIT",
    FLOAT_32BIT = "BUFFER_TYPE_FLOAT_32BIT"
}

export type DataView =
    | Uint8ArrayConstructor
    | Uint16ArrayConstructor
    | Uint32ArrayConstructor
    | Int8ArrayConstructor
    | Int16ArrayConstructor
    | Int32ArrayConstructor
    | Float32ArrayConstructor

export type State = {
    destroyed: boolean
}


class Buffer {
    private readonly _context: WebGL2RenderingContext
    private readonly _target: BufferTarget
    private readonly _nativeWebGLObject: WebGLBuffer
    private readonly _type: BufferType
    private readonly _view: DataView
    private readonly _state: State = {
        destroyed: false
    }

    constructor(context: WebGL2RenderingContext, target: BufferTarget, type: BufferType, size: number) {
        this._context = context
        this._target = target
        this._type = type
        this._view = constant(this._context, this._type)
        const buffer = context.createBuffer()
        if (buffer !== null) {
            this._nativeWebGLObject = buffer
            this.bind()
            this._context.bufferData(
                constant(this._context, this._target),
                new this._view(size),
                this._context.STATIC_DRAW
            )
            this.unbind()
        } else {
            throw new Error(`Could not create a vertex buffer.`)
        }
    }

    public update(data: number[], offset: number = 0): Buffer {
        this.bind()
        this._context.bufferSubData(
            constant(this._context, this._target),
            offset,
            new this._view(data)
        )
        this.unbind()
        return this
    }

    public bind(): Buffer {
        this._context.bindBuffer(constant(this._context, this._target), this._nativeWebGLObject)
        return this
    }

    public unbind(): Buffer {
        this._context.bindBuffer(constant(this._context, this._target), null)
        return this
    }

    public destroy(): void {
        this._context.deleteBuffer(this._nativeWebGLObject)
        this._state.destroyed = true
    }

    public get type(): BufferType {
        return this._type
    }

    public get view(): DataView {
        return this._view
    }

    public get nativeWebGLObject(): WebGLBuffer {
        return this._nativeWebGLObject
    }

    public get state(): State {
        return this._state
    }
}


function constant(context: WebGL2RenderingContext, constant: BufferTarget): number
function constant(context: WebGL2RenderingContext, constant: BufferType): DataView
function constant(context: WebGL2RenderingContext, constant: BufferTarget | BufferType): any {
    const dictionary = {
        [BufferTarget.ARRAY]: context.ARRAY_BUFFER,
        [BufferType.UNSIGNED_INTEGER_8BIT]: Uint8Array,
        [BufferType.UNSIGNED_INTEGER_16BIT]: Uint16Array,
        [BufferType.UNSIGNED_INTEGER_32BIT]: Uint32Array,
        [BufferType.INTEGER_8BIT]: Int8Array,
        [BufferType.INTEGER_16BIT]: Int16Array,
        [BufferType.INTEGER_32BIT]: Int32Array,
        [BufferType.FLOAT_32BIT]: Float32Array
    }

    const glConstant = dictionary[constant]
    if (glConstant) {
        return glConstant
    } else {
        throw new Error(`A constant "${constant}" does not have its WebGL equivalent.`)
    }
}


export default Buffer


