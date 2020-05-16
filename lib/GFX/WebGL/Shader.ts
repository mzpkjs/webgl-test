export enum ShaderType {
    VERTEX = "SHADER_TYPE_VERTEX",
    FRAGMENT = "SHADER_TYPE_FRAGMENT"
}

export type State = {
    compiled: boolean
    destroyed: boolean
}


class Shader {
    private readonly _context: WebGL2RenderingContext
    private readonly _type: ShaderType
    private readonly _nativeWebGLObject: WebGLShader
    private readonly _state: State = {
        compiled: false,
        destroyed: false
    }

    constructor(context: WebGL2RenderingContext, type: ShaderType, source: string) {
        this._context = context
        this._type = type
        const shader = this._context.createShader(constant(context, this._type))
        if (shader) {
            this._nativeWebGLObject = shader
            this._context.shaderSource(this._nativeWebGLObject, source)
        } else {
            throw new Error(`Could not create a shader.`)
        }
    }

    public compile(): Shader {
        this._context.compileShader(this._nativeWebGLObject)
        this._state.compiled = true
        return this
    }

    public destroy(): void {
        this._context.deleteShader(this._nativeWebGLObject)
        this._state.destroyed = true
    }

    public get type(): ShaderType {
        return this._type
    }

    public get nativeWebGLObject(): WebGLShader {
        return this._nativeWebGLObject
    }

    public get state(): State {
        return this._state
    }
}


function constant(context: WebGL2RenderingContext, constant: ShaderType): number {
    const dictionary = {
        [ShaderType.VERTEX]: context.VERTEX_SHADER,
        [ShaderType.FRAGMENT]: context.FRAGMENT_SHADER,
    }

    const glConstant = dictionary[constant]
    if (glConstant) {
        return glConstant
    } else {
        throw new Error(`A constant "${constant}" does not have its WebGL equivalent.`)
    }
}


export default Shader


