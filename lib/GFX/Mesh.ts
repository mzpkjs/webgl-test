export enum MeshType {
    STATIC = "STATIC",
    DYNAMIC = "DYNAMIC"
}


class Mesh {
    private readonly _type: MeshType
    private readonly _vertices: number[]

    constructor(type: MeshType, vertices: number[]) {
        this._type = type
        this._vertices = vertices
    }

    public get type(): MeshType {
        return this._type
    }

    public get vertices(): number[] {
        return this._vertices
    }
}



export default Mesh