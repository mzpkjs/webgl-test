import Buffer from "./Buffer"
import Program from "./Program"



export enum DataType {
    FLOAT = "DATA_TYPE_FLOAT"
}

export type State = {
    destroyed: boolean
}


class Attribute {
    private readonly _context: WebGL2RenderingContext
    private readonly _program: Program
    private readonly _buffer: Buffer
    private readonly _symbol: string
    private readonly _type: DataType
    private readonly _layout: { count: number, stride: number, offset: number }
    private readonly _nativeWebGLObject: number
    private readonly _state: State = {
        destroyed: false
    }

    constructor(
        context: WebGL2RenderingContext,
        program: Program,
        buffer: Buffer,
        symbol: string,
        type: DataType,
        count: number,
        stride: number = 0,
        offset: number = 0
    ) {
        this._context = context
        this._program = program
        this._buffer = buffer
        this._symbol = symbol
        this._type = type
        this._layout = { count, stride, offset }

        const attribute = this._context.getAttribLocation(this._program.nativeWebGLObject, this._symbol)
        if (attribute !== -1) {
            this._nativeWebGLObject = attribute
        } else {
            throw new Error(`Could not retrieve a location of an attribute "${this._symbol}".`)
        }
    }

    public enable(): Attribute {
        const { BYTES_PER_ELEMENT } = this._buffer.view
        const { count, stride, offset } = this._layout
        this._context.enableVertexAttribArray(this._nativeWebGLObject)
        this._buffer.bind()
        this._context.vertexAttribPointer(
            this._nativeWebGLObject,
            count,
            constant(this._context, this._type),
            false,
            stride * BYTES_PER_ELEMENT,
            offset * BYTES_PER_ELEMENT
        );
        this._buffer.unbind()
        return this
    }

    public disable(): Attribute {
        this._context.disableVertexAttribArray(this._nativeWebGLObject)
        return this
    }

    public get symbol(): string {
        return this._symbol
    }

    public get type(): DataType {
        return this._type
    }

    public get nativeWebGLObject(): number {
        return this._nativeWebGLObject
    }

    public get state(): State {
        return this._state
    }
}


function constant(context: WebGL2RenderingContext, constant: DataType): number {
    const dictionary = {
        [DataType.FLOAT]: context.FLOAT
    }

    const glConstant = dictionary[constant]
    if (glConstant) {
        return glConstant
    } else {
        throw new Error(`A constant "${constant}" does not have its WebGL equivalent.`)
    }
}



export default Attribute