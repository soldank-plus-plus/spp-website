export type Mat3 = Float32Array;

const U16_SIZE = Uint16Array.BYTES_PER_ELEMENT;
const F32_SIZE = Float32Array.BYTES_PER_ELEMENT;
export const VERTEX_SIZE = 4 * F32_SIZE + 4;

const vertexRef = { x: 0, y: 0, u: 0, v: 0, rgba: [0, 0, 0, 0] as number[] };

// Helper: read from Float32Array without undefined
function f(m: Float32Array, i: number): number {
    return m[i] as number;
}

// Matrix functions
export function mat3(): Mat3 {
    return new Float32Array(9);
}
export function mat3mulx(m: Mat3, x: number, y: number): number {
    return f(m, 0) * x + f(m, 3) * y + f(m, 6);
}
export function mat3muly(m: Mat3, x: number, y: number): number {
    return f(m, 1) * x + f(m, 4) * y + f(m, 7);
}
export function mat3copy(src: Mat3, dest: Mat3): Mat3 {
    dest.set(src);
    return dest;
}

export function mat3identity(out: Mat3): Mat3 {
    out[0] = 1;
    out[3] = 0;
    out[6] = 0;
    out[1] = 0;
    out[4] = 1;
    out[7] = 0;
    out[2] = 0;
    out[5] = 0;
    out[8] = 1;
    return out;
}

export function mat3mul(a: Mat3, b: Mat3, out: Mat3): Mat3 {
    out[0] = f(a, 0) * f(b, 0) + f(a, 3) * f(b, 1);
    out[1] = f(a, 1) * f(b, 0) + f(a, 4) * f(b, 1);
    out[2] = 0;
    out[3] = f(a, 0) * f(b, 3) + f(a, 3) * f(b, 4);
    out[4] = f(a, 1) * f(b, 3) + f(a, 4) * f(b, 4);
    out[5] = 0;
    out[6] = f(a, 0) * f(b, 6) + f(a, 3) * f(b, 7) + f(a, 6);
    out[7] = f(a, 1) * f(b, 6) + f(a, 4) * f(b, 7) + f(a, 7);
    out[8] = 1;
    return out;
}

export function mat3ortho(
    left: number,
    right: number,
    bottom: number,
    top: number,
    out: Mat3
): Mat3 {
    const w = right - left,
        h = top - bottom;
    out[0] = 2 / w;
    out[3] = 0;
    out[6] = -(right + left) / w;
    out[1] = 0;
    out[4] = 2 / h;
    out[7] = -(top + bottom) / h;
    out[2] = 0;
    out[5] = 0;
    out[8] = 1;
    return out;
}

const VS_SRC = [
    "attribute vec2 pos;",
    "attribute vec2 tex;",
    "attribute vec4 clr;",
    "uniform mat3 mvp;",
    "varying vec2 t;",
    "varying vec4 c;",
    "",
    "void main(void) {",
    "  c = clr;",
    "  t = tex;",
    "  gl_Position = vec4(mvp * vec3(pos, 1.0), 1.0);",
    "}",
].join("\n");

const FS_SRC = [
    "precision mediump float;",
    "varying mediump vec2 t;",
    "varying mediump vec4 c;",
    "uniform sampler2D s;",
    "",
    "void main(void) {",
    "  gl_FragColor = texture2D(s, t) * c;",
    "}",
].join("\n");

function compileShader(
    gl: WebGLRenderingContext,
    source: string,
    type: number
): WebGLShader {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        console.error("Shader error:", gl.getShaderInfoLog(shader));
    return shader;
}

function createProgram(gl: WebGLRenderingContext): WebGLProgram {
    const program = gl.createProgram()!;
    gl.attachShader(program, compileShader(gl, VS_SRC, gl.VERTEX_SHADER));
    gl.attachShader(program, compileShader(gl, FS_SRC, gl.FRAGMENT_SHADER));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        console.error("Shader link error:", gl.getProgramInfoLog(program));
    gl.useProgram(program);
    return program;
}

export class Texture {
    readonly id: WebGLTexture;
    width = 0;
    height = 0;

    constructor(private gl: WebGLRenderingContext) {
        this.id = gl.createTexture()!;
        gl.bindTexture(gl.TEXTURE_2D, this.id);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    loadFromImage(image: HTMLImageElement | HTMLCanvasElement): void {
        const gl = this.gl;
        this.width = image.width;
        this.height = image.height;
        gl.bindTexture(gl.TEXTURE_2D, this.id);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            image
        );
    }

    create(
        w: number,
        h: number,
        format: number,
        func?: (x: number, y: number, rgba: number[]) => void
    ): void {
        const gl = this.gl;
        this.width = w;
        this.height = h;
        let data: Uint8Array | null = null;

        if (func) {
            const channels =
                format === gl.ALPHA ? 1 : format === gl.RGB ? 3 : 4;
            const rgba = [0, 0, 0, 0];
            data = new Uint8Array(w * h * channels);
            for (let y = 0, i = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    func(x, y, rgba);
                    rgba[0] = Math.max(Math.min(1, rgba[0] as number), 0);
                    rgba[1] = Math.max(Math.min(1, rgba[1] as number), 0);
                    rgba[2] = Math.max(Math.min(1, rgba[2] as number), 0);
                    rgba[3] = Math.max(Math.min(1, rgba[3] as number), 0);
                    if (channels > 1) {
                        data[i++] = (rgba[0] as number) * 255;
                        data[i++] = (rgba[1] as number) * 255;
                        data[i++] = (rgba[2] as number) * 255;
                        if (channels === 4)
                            data[i++] = (rgba[3] as number) * 255;
                    } else {
                        data[i++] = (rgba[3] as number) * 255;
                    }
                }
            }
        }
        gl.bindTexture(gl.TEXTURE_2D, this.id);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            format,
            w,
            h,
            0,
            format,
            gl.UNSIGNED_BYTE,
            data
        );
    }

    generateMipmap(): void {
        const gl = this.gl;
        gl.bindTexture(gl.TEXTURE_2D, this.id);
        gl.generateMipmap(gl.TEXTURE_2D);
    }

    filter(min: number, mag: number): void {
        const gl = this.gl;
        gl.bindTexture(gl.TEXTURE_2D, this.id);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, mag);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, min);
    }

    wrap(u: number, v: number): void {
        const gl = this.gl;
        gl.bindTexture(gl.TEXTURE_2D, this.id);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, u);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, v);
    }
}

export class VertexBuffer {
    readonly id: WebGLBuffer;
    readonly vertex_size = VERTEX_SIZE;
    capacity = 0;
    size = 0;
    private usage: number;
    buffer!: ArrayBuffer;
    f32!: Float32Array;
    u8!: Uint8Array;

    constructor(
        private gl: WebGLRenderingContext,
        capacity: number,
        usage: number
    ) {
        this.id = gl.createBuffer()!;
        this.usage = usage;
        this.realloc(capacity, usage);
    }

    realloc(capacity: number, usage: number): void {
        this.usage = usage;
        this.capacity = capacity;
        this.size = 0;
        this.buffer = new ArrayBuffer(capacity * VERTEX_SIZE);
        this.f32 = new Float32Array(
            this.buffer,
            0,
            this.buffer.byteLength / F32_SIZE
        );
        this.u8 = new Uint8Array(this.buffer, 0, this.buffer.byteLength);
        const gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
        gl.bufferData(gl.ARRAY_BUFFER, this.buffer.byteLength, usage);
    }

    reserve(capacity: number): void {
        if (this.capacity < capacity) {
            const buf = this.u8;
            const size = this.size;
            this.realloc(capacity, this.usage);
            this.u8.set(buf.subarray(0, size * VERTEX_SIZE));
            this.size = size;
        }
    }

    set(
        index: number,
        x: number,
        y: number,
        u: number,
        v: number,
        rgba: readonly number[]
    ): void {
        const base = index * VERTEX_SIZE;
        let i = base / F32_SIZE;
        this.f32[i++] = x;
        this.f32[i++] = y;
        this.f32[i++] = u;
        this.f32[i++] = v;
        this.u8.set(rgba as number[], base + F32_SIZE * 4);
    }

    get(index: number): typeof vertexRef {
        const base = index * VERTEX_SIZE;
        let i = base / F32_SIZE;
        vertexRef.x = this.f32[i++] as number;
        vertexRef.y = this.f32[i++] as number;
        vertexRef.u = this.f32[i++] as number;
        vertexRef.v = this.f32[i++] as number;
        i = base + F32_SIZE * 4;
        vertexRef.rgba[0] = this.u8[i++] as number;
        vertexRef.rgba[1] = this.u8[i++] as number;
        vertexRef.rgba[2] = this.u8[i++] as number;
        vertexRef.rgba[3] = this.u8[i++] as number;
        return vertexRef;
    }

    push(
        x: number,
        y: number,
        u: number,
        v: number,
        rgba: readonly number[]
    ): number {
        this.set(this.size, x, y, u, v, rgba);
        return this.size++;
    }

    clear(): void {
        this.size = 0;
    }

    upload(offset = 0, count?: number): void {
        const gl = this.gl;
        const beg = VERTEX_SIZE * offset;
        const end = beg + VERTEX_SIZE * (count ?? this.size - offset);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
        gl.bufferSubData(gl.ARRAY_BUFFER, beg, this.u8.subarray(beg, end));
    }
}

export class IndexBuffer {
    readonly id: WebGLBuffer;
    capacity = 0;
    size = 0;
    private usage: number;
    buffer!: Uint16Array;

    constructor(
        private gl: WebGLRenderingContext,
        capacity: number,
        usage: number
    ) {
        this.id = gl.createBuffer()!;
        this.usage = usage;
        this.realloc(capacity, usage);
    }

    realloc(capacity: number, usage: number): void {
        this.usage = usage;
        this.capacity = capacity;
        this.size = 0;
        this.buffer = new Uint16Array(capacity);
        const gl = this.gl;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.id);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.buffer.byteLength, usage);
    }

    reserve(capacity: number): void {
        if (this.capacity < capacity) {
            const buf = this.buffer;
            const size = this.size;
            this.realloc(capacity, this.usage);
            this.buffer.set(buf.subarray(0, size));
            this.size = size;
        }
    }

    set(index: number, value: number): void {
        this.buffer[index] = value;
    }
    get(index: number): number {
        return this.buffer[index] as number;
    }

    push(...values: number[]): void {
        for (const v of values) this.buffer[this.size++] = v;
    }

    clear(): void {
        this.size = 0;
    }

    upload(offset = 0, count?: number): void {
        const gl = this.gl;
        const beg = offset;
        const end = beg + (count ?? this.size - beg);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.id);
        gl.bufferSubData(
            gl.ELEMENT_ARRAY_BUFFER,
            beg * U16_SIZE,
            this.buffer.subarray(beg, end)
        );
    }
}

export class GfxContext {
    readonly canvas: HTMLCanvasElement;
    readonly gl: WebGLRenderingContext;
    readonly White: Texture;

    readonly Stream: number;
    readonly Static: number;
    readonly Dynamic: number;
    readonly Points: number;
    readonly Lines: number;
    readonly Triangles: number;
    readonly RGBA: number;
    readonly RGB: number;
    readonly Alpha: number;
    readonly Clamp: number;
    readonly Repeat: number;
    readonly Linear: number;
    readonly Nearest: number;
    readonly LinearMipmapNearest: number;
    readonly NearestMipmapLinear: number;
    readonly LinearMipmapLinear: number;
    readonly SrcAlpha: number;
    readonly OneMinusSrcAlpha: number;

    private mvp: Mat3;
    private proj: Mat3;
    private view: Mat3;
    private mvpDirty = true;
    private boundVbo: VertexBuffer | null = null;
    private framebuffer: WebGLFramebuffer;
    private locMvp: WebGLUniformLocation;
    private locPos: number;
    private locTex: number;
    private locClr: number;

    constructor(
        canvas: HTMLCanvasElement,
        params: WebGLContextAttributes = {}
    ) {
        this.canvas = canvas;
        const gl = (canvas.getContext("webgl", params) ??
            canvas.getContext(
                "experimental-webgl",
                params
            )) as WebGLRenderingContext;
        this.gl = gl;

        this.mvp = mat3();
        this.proj = mat3();
        this.view = mat3();
        mat3identity(this.mvp);
        mat3identity(this.proj);
        mat3identity(this.view);

        this.framebuffer = gl.createFramebuffer()!;
        const program = createProgram(gl);
        this.locMvp = gl.getUniformLocation(program, "mvp")!;
        this.locPos = gl.getAttribLocation(program, "pos");
        this.locTex = gl.getAttribLocation(program, "tex");
        this.locClr = gl.getAttribLocation(program, "clr");

        this.White = this.create_texture(1, 1, gl.RGBA, (_x, _y, rgba) => {
            rgba[0] = rgba[1] = rgba[2] = rgba[3] = 1;
        });
        this.White.filter(gl.NEAREST, gl.NEAREST);

        gl.enableVertexAttribArray(this.locPos);
        gl.enableVertexAttribArray(this.locTex);
        gl.enableVertexAttribArray(this.locClr);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        this.Stream = gl.STREAM_DRAW;
        this.Static = gl.STATIC_DRAW;
        this.Dynamic = gl.DYNAMIC_DRAW;
        this.Points = gl.POINTS;
        this.Lines = gl.LINES;
        this.Triangles = gl.TRIANGLES;
        this.RGBA = gl.RGBA;
        this.RGB = gl.RGB;
        this.Alpha = gl.ALPHA;
        this.Clamp = gl.CLAMP_TO_EDGE;
        this.Repeat = gl.REPEAT;
        this.Linear = gl.LINEAR;
        this.Nearest = gl.NEAREST;
        this.LinearMipmapNearest = gl.LINEAR_MIPMAP_NEAREST;
        this.NearestMipmapLinear = gl.NEAREST_MIPMAP_LINEAR;
        this.LinearMipmapLinear = gl.LINEAR_MIPMAP_LINEAR;
        this.SrcAlpha = gl.SRC_ALPHA;
        this.OneMinusSrcAlpha = gl.ONE_MINUS_SRC_ALPHA;
    }

    clear(): void {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }
    clear_color(r: number, g: number, b: number, a: number): void {
        this.gl.clearColor(r, g, b, a);
    }
    viewport(x: number, y: number, w: number, h: number): void {
        this.gl.viewport(x, y, w, h);
    }

    projection(matrix: Mat3): void {
        this.mvpDirty = true;
        mat3copy(matrix, this.proj);
    }
    transform(matrix: Mat3): void {
        this.mvpDirty = true;
        mat3copy(matrix, this.view);
    }

    blend(src: number, dst: number, srcA: number, dstA: number): void {
        this.gl.blendFuncSeparate(src, dst, srcA, dstA);
    }

    bind(texture: Texture): void {
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture.id);
    }

    target(texture: Texture | null): void {
        const gl = this.gl;
        if (texture === null) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        } else {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
            gl.framebufferTexture2D(
                gl.FRAMEBUFFER,
                gl.COLOR_ATTACHMENT0,
                gl.TEXTURE_2D,
                texture.id,
                0
            );
        }
    }

    draw(
        mode: number,
        vbo: VertexBuffer,
        ibo: IndexBuffer | null,
        offset: number,
        count: number
    ): void {
        const gl = this.gl;
        if (this.mvpDirty) {
            mat3mul(this.proj, this.view, this.mvp);
            gl.uniformMatrix3fv(this.locMvp, false, this.mvp);
            this.mvpDirty = false;
        }
        if (vbo !== this.boundVbo) {
            this.boundVbo = vbo;
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo.id);
            gl.vertexAttribPointer(
                this.locPos,
                2,
                gl.FLOAT,
                false,
                VERTEX_SIZE,
                0
            );
            gl.vertexAttribPointer(
                this.locTex,
                2,
                gl.FLOAT,
                false,
                VERTEX_SIZE,
                2 * F32_SIZE
            );
            gl.vertexAttribPointer(
                this.locClr,
                4,
                gl.UNSIGNED_BYTE,
                true,
                VERTEX_SIZE,
                4 * F32_SIZE
            );
        }
        if (ibo !== null) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo.id);
            gl.drawElements(mode, count, gl.UNSIGNED_SHORT, U16_SIZE * offset);
        } else {
            gl.drawArrays(mode, offset, count);
        }
    }

    create_vbo(capacity: number, usage: number): VertexBuffer {
        return new VertexBuffer(this.gl, capacity, usage);
    }

    create_ibo(capacity: number, usage: number): IndexBuffer {
        return new IndexBuffer(this.gl, capacity, usage);
    }

    create_texture(
        imageOrW: HTMLImageElement | HTMLCanvasElement | number,
        h?: number,
        format?: number,
        func?: (x: number, y: number, rgba: number[]) => void
    ): Texture {
        const texture = new Texture(this.gl);
        if (typeof imageOrW === "number") {
            texture.create(imageOrW, h!, format!, func);
        } else {
            texture.loadFromImage(imageOrW);
        }
        return texture;
    }
}
