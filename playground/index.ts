import Mesh, { MeshType } from "unnamed/GFX/Mesh"
import Renderer from "unnamed/GFX/Renderer"



export function main() {
    const context = getContext()

    const vertices = [
        -1, 0, 0,
        0, 1, 0,
        0, -1, 0,
        1, 0, 0,
    ]

    const mesh = new Mesh(MeshType.STATIC, vertices)
    new Renderer(context)
        .process(mesh)
        .render()
}







//-
const getContext = (): WebGL2RenderingContext => {
    const canvas = document.getElementsByTagName("canvas")[0] as HTMLCanvasElement
    if (canvas) {
        const context = canvas.getContext("webgl2")
        if (context) {
            return context
        } else {
            throw new Error("No context.")
        }
    } else {
        throw new Error("Could not find any \"canvas\" element.")
    }
}