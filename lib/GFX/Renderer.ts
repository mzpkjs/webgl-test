import Mesh from "./Mesh"
import Attribute, { DataType } from "./WebGL/Attribute"
import Buffer, { BufferTarget, BufferType } from "./WebGL/Buffer"
import Program from "./WebGL/Program"
import Shader, { ShaderType } from "./WebGL/Shader"
import VertexArray from "./WebGL/VertexArray"


export class Cache {
    private readonly _cache = new WeakMap<Mesh, VertexArray>()


    public put(mesh: Mesh, buffer: VertexArray): void {
        this._cache.set(mesh, buffer)
    }

    public match(mesh: Mesh): VertexArray {
        const buffer = this._cache.get(mesh)
        if (buffer !== undefined) {
            return buffer
        } else {
            throw new Error("Cache: ?")
        }
    }

    public has(mesh: Mesh): boolean {
        return this._cache.has(mesh)
    }
}


export class Queue {
    private readonly _queue: Mesh[] = []

    public enqueue(mesh: Mesh): void {
        this._queue.push(mesh)
    }

    public dequeue(): Mesh {
        const mesh = this._queue.shift()
        if (mesh) {
            return mesh
        } else {
            throw new Error("Queue: ?")
        }
    }

    public isEmpty(): boolean {
        return this._queue.length === 0
    }
}


class Renderer {
    private readonly _cache = new Cache()
    private readonly _queue = new Queue()
    private readonly _context: WebGL2RenderingContext

    constructor(context: WebGL2RenderingContext) {
        this._context = context
    }

    public process(mesh: Mesh): Renderer {
        const program = new Program(this._context)
            .attachShader(
                new Shader(this._context, ShaderType.VERTEX, require("./Shaders/shader.vert"))
                    .compile()
            )
            .attachShader(
                new Shader(this._context, ShaderType.FRAGMENT, require("./Shaders/shader.frag"))
                    .compile()
            )
            .link()
            .use()

        const buffer = new Buffer(this._context, BufferTarget.ARRAY, BufferType.FLOAT_32BIT, 1024)
            .update(mesh.vertices)
        const vertexArray = new VertexArray(this._context)
            .attribute(new Attribute(this._context, program, buffer, "a_position", DataType.FLOAT, 3, 3, 0))

        this._cache.put(mesh, vertexArray)
        this._queue.enqueue(mesh)
        return this
    }

    public render(): void {
        while (!this._queue.isEmpty()) {
            const mesh = this._queue.dequeue()
            const vertexArray = this._cache.match(mesh)
            vertexArray.bind()

            this._context.clearColor(0, 0, 0, 1)
            this._context.clear(this._context.COLOR_BUFFER_BIT)
            this._context.drawArrays(this._context.TRIANGLE_STRIP, 0, 4);
        }
    }
}



export default Renderer