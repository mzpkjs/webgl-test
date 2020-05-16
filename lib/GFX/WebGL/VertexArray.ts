import Attribute from "./Attribute"



export type State = {
    destroyed: boolean
    attributes: Set<Attribute>
}


class VertexArray {
    private readonly _context: WebGL2RenderingContext
    private readonly _nativeWebGLObject: WebGLShader
    private readonly _state: State = {
        destroyed: false,
        attributes: new Set()
    }

    constructor(context: WebGL2RenderingContext) {
        this._context = context
        const vertex = this._context.createVertexArray()
        if (vertex) {
            this._nativeWebGLObject = vertex
        } else {
            throw new Error(`Could not create a vertex array.`)
        }
    }

    public attribute(attribute: Attribute): VertexArray {
        if (this._state.attributes.has(attribute)) {
            throw new Error(`Attribute "${attribute.symbol}" is already a member of this vertex array.`)
        }
        this.bind()
        attribute.enable()
        this._state.attributes.add(attribute)
        this.unbind()
        return this
    }

    public bind(): VertexArray {
        this._context.bindVertexArray(this._nativeWebGLObject)
        return this
    }

    public unbind(): VertexArray {
        this._context.bindVertexArray(null)
        return this
    }

    public destroy(): void {
        this._context.deleteVertexArray(this._nativeWebGLObject)
        this._state.destroyed = true
    }

    public get nativeWebGLObject(): WebGLShader {
        return this._nativeWebGLObject
    }

    public get state(): State {
        return this._state
    }
}



export default VertexArray