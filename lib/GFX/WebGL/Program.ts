import Shader, { ShaderType } from "./Shader"



export type State = {
    used: boolean
    destroyed: boolean
    shader: {
        vertex: Shader | null
        fragment: Shader | null
    }
}


class Program {
    private readonly _context: WebGL2RenderingContext
    private readonly _nativeWebGLObject: WebGLProgram
    private readonly _state: State = {
        used: false,
        destroyed: false,
        shader: {
            vertex: null,
            fragment: null
        }
    }

    constructor(context: WebGL2RenderingContext) {
        this._context = context
        const program = this._context.createProgram()
        if (program) {
            this._nativeWebGLObject = program
        } else {
            throw new Error(`Could not create a program.`)
        }
    }

    public attachShader(shader: Shader): Program {
        if (shader.state.destroyed) {
            throw new Error(`Cannot attach deleted shader.`)
        }

        if (!shader.state.compiled) {
            throw new Error(`Cannot attach not compiled shader.`)
        }

        switch (shader.type) {
            case ShaderType.VERTEX:
                if (this._state.shader.vertex === null) {
                    this._state.shader.vertex = shader
                    break
                } else {
                    throw new Error(`Cannot attach a shader of already attached shader type.`)
                }
            case ShaderType.FRAGMENT:
                if (this._state.shader.fragment === null) {
                    this._state.shader.fragment = shader
                    break
                } else {
                    throw new Error(`Cannot attach a shader of already attached shader type.`)
                }
            default:
                throw new Error(`Cannot attach a shader of an unknown type.`)
        }

        this._context.attachShader(this._nativeWebGLObject, shader.nativeWebGLObject)
        return this
    }

    public detachShader(shader: Shader): Program {
        const { vertex, fragment } = this._state.shader
        if ([ vertex, fragment ].includes(shader)) {
            this._context.detachShader(this._nativeWebGLObject, shader)
        } else {
            throw new Error(`Could not detach a never attached shader.`)
        }
        return this
    }

    public link(): Program {
        this._context.linkProgram(this._nativeWebGLObject)
        const succeed = this._context.getProgramParameter(this._nativeWebGLObject, this._context.LINK_STATUS)
        if (succeed) {
            return this
        } else {
            const information = this._context.getProgramInfoLog(this._nativeWebGLObject)
            throw new Error(
                `Could not link the program${ information ? `, ${information.toLowerCase()}` : "."}` +
                    [ this._state.shader.vertex, this._state.shader.fragment ]
                        .filter(shader => shader !== null)
                        .map(shader => `\t${this._context.getShaderInfoLog(shader!.nativeWebGLObject)}`)
                        .join("")
            )
        }
    }

    public use(): Program {
        this._context.useProgram(this._nativeWebGLObject)
        this._state.used = true
        return this
    }

    public destroy(): void {
        this._context.deleteProgram(this._nativeWebGLObject)
        this._state.destroyed = true
    }

    public get nativeWebGLObject(): WebGLProgram {
        return this._nativeWebGLObject
    }

    public get state(): State {
        return this._state
    }
}


export default Program