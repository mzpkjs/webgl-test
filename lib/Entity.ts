import Mesh from "./GFX/Mesh"



class Entity  {
    public readonly _mesh: Mesh

    constructor(mesh: Mesh) {
        this._mesh = mesh
    }
}



export default Entity