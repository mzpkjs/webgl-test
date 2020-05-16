import Attribute, { DataType } from "unnamed/WebGL/Attribute"
import Buffer, { BufferTarget, BufferType } from "unnamed/WebGL/Buffer"
import Program from "unnamed/WebGL/Program"
import Shader, { ShaderType } from "unnamed/WebGL/Shader"
import VertexArray from "unnamed/WebGL/VertexArray"



export function main() {
    const context = getContext()

    const program = new Program(context)
        .attachShader(
            new Shader(context, ShaderType.VERTEX, require("./shaders/shader.vert"))
                .compile()
        )
        .attachShader(
            new Shader(context, ShaderType.FRAGMENT, require("./shaders/shader.frag"))
                .compile()
        )
        .link()
        .use()


    const bufferA = new Buffer(context, BufferTarget.ARRAY, BufferType.FLOAT_32BIT, 1024)
        .update([
            -1, 0, 0,   .1, 1, 1, 1,
            0, 1, 0,    1, .1, 1, 1,
            0, -1, 0,   1, 1, .1, 1,
            1, 0, 0,    1, 1, 1, 1
        ])
    const arrayA = new VertexArray(context)
        .attribute(new Attribute(context, program, bufferA, "a_position", DataType.FLOAT, 3, 7, 0))
        .attribute(new Attribute(context, program, bufferA, "a_color", DataType.FLOAT, 4, 7, 3))


    const bufferB = new Buffer(context, BufferTarget.ARRAY, BufferType.FLOAT_32BIT, 1024)
        .update([
                -1, 0, 0,   1, 1, 1, 1,
                0, 1, 0,    1, 1, 1, 1,
                0, -1, 0,   1, 1, 1, 1,
                1, 0, 0,    1, 1, 1, 1
            ]
        )
    const arrayB = new VertexArray(context)
        .attribute(new Attribute(context, program, bufferB, "a_position", DataType.FLOAT, 3, 7, 0))
        .attribute(new Attribute(context, program, bufferB, "a_color", DataType.FLOAT, 4, 7 ,3))


    arrayA.bind()

    context.clearColor(0, 0, 0, 1)
    context.clear(context.COLOR_BUFFER_BIT)
    context.drawArrays(context.TRIANGLE_STRIP, 0, 4);
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