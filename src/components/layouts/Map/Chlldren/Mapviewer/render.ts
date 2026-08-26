import {
    GfxContext,
    Texture,
    VertexBuffer,
    IndexBuffer,
    mat3,
    mat3mul,
    mat3mulx,
    mat3muly,
    mat3identity,
    mat3ortho,
} from "./gfx";
import type { PmsMap, SpawnPoint } from "./map";

interface SpriteUV {
    x: number;
    y: number;
}

interface Sprite {
    x: number;
    y: number;
    width: number;
    height: number;
    uv: [SpriteUV, SpriteUV];
}

interface ObjectsAtlas {
    width: number;
    height: number;
    sprites: Sprite[];
}

const OBJECTS_ATLAS_RAW = {
    width: 86,
    height: 127,
    sprites: [
        { x: 1, y: 91, width: 18, height: 18 },
        { x: 20, y: 91, width: 18, height: 18 },
        { x: 46, y: 1, width: 18, height: 18 },
        { x: 46, y: 20, width: 18, height: 18 },
        { x: 46, y: 39, width: 18, height: 18 },
        { x: 46, y: 58, width: 18, height: 18 },
        { x: 58, y: 77, width: 18, height: 18 },
        { x: 69, y: 96, width: 16, height: 16 },
        { x: 65, y: 1, width: 16, height: 16 },
        { x: 65, y: 18, width: 16, height: 16 },
        { x: 1, y: 110, width: 16, height: 16 },
        { x: 18, y: 110, width: 16, height: 16 },
        { x: 35, y: 110, width: 16, height: 16 },
        { x: 52, y: 110, width: 16, height: 16 },
        { x: 39, y: 91, width: 18, height: 18 },
        { x: 1, y: 1, width: 44, height: 44 },
        { x: 1, y: 46, width: 44, height: 44 },
    ],
};

const OBJECTS_ATLAS: ObjectsAtlas = {
    width: OBJECTS_ATLAS_RAW.width,
    height: OBJECTS_ATLAS_RAW.height,
    sprites: OBJECTS_ATLAS_RAW.sprites.map((s) => ({
        ...s,
        uv: [
            {
                x: s.x / OBJECTS_ATLAS_RAW.width,
                y: s.y / OBJECTS_ATLAS_RAW.height,
            },
            {
                x: (s.x + s.width) / OBJECTS_ATLAS_RAW.width,
                y: (s.y + s.height) / OBJECTS_ATLAS_RAW.height,
            },
        ] as [SpriteUV, SpriteUV],
    })),
};

interface DrawCall {
    offset: number;
    count: number;
    texture: number;
}

interface Batch {
    mode: number;
    ibo_index: number;
    vbo_index: number;
    calls: DrawCall[];
}

export interface RendererConfig {
    background: boolean;
    scenery_back: boolean;
    scenery_middle: boolean;
    scenery_front: boolean;
    polygons: boolean;
    texture: boolean;
    wireframe: boolean;
    colliders: boolean;
    highlight: boolean;
    highlight_list: number[];
    objects: boolean;
    objects_list: number[];
}

export class MapRenderer {
    private vbo!: VertexBuffer;
    private ibo!: IndexBuffer;
    private objectsVbo!: VertexBuffer;
    private objectsIbo!: IndexBuffer;
    private batches: Record<string, Batch> = {};
    private activeBatches: Batch[] = [];
    private activeObjects: SpawnPoint[] = [];
    private textures: Texture[] = [];
    private blackTexture!: Texture;
    private colliderTexture!: Texture;
    private objectsTexture!: Texture;

    private cfg: RendererConfig = {
        background: true,
        scenery_back: true,
        scenery_middle: true,
        scenery_front: true,
        polygons: true,
        texture: true,
        wireframe: false,
        colliders: false,
        highlight: false,
        highlight_list: [],
        objects: true,
        objects_list: OBJECTS_ATLAS.sprites.map((_, i) => i),
    };

    constructor(
        private gfx: GfxContext,
        private map: PmsMap,
        private filelist: string[],
        private root: string,
        onReady: (self: MapRenderer) => void,
        private onUpdate?: () => void
    ) {
        this.activeObjects = map.spawnpoints;
        this.setupTextures();
        this.init();
        onReady(this);
        this.loadImages();
    }

    config(): RendererConfig;
    config(
        name: keyof RendererConfig,
        value: RendererConfig[keyof RendererConfig]
    ): void;
    config(
        name?: keyof RendererConfig,
        value?: RendererConfig[keyof RendererConfig]
    ): RendererConfig | void {
        if (name === undefined) return this.cfg;

        (this.cfg as unknown as Record<string, unknown>)[name] = value;

        if (
            name === "background" ||
            name === "polygons" ||
            name === "scenery_back" ||
            name === "scenery_middle" ||
            name === "scenery_front" ||
            name === "highlight" ||
            name === "colliders" ||
            name === "wireframe"
        ) {
            this.updateActiveBatches();
        } else if (name === "texture") {
            const val = value as boolean;
            this.batches.polygons!.calls[0]!.texture = val ? 0 : -1;
            this.batches.wireframe!.calls[0]!.texture = val ? -1 : -2;
        } else if (name === "highlight_list") {
            this.updateHighlightBatch();
        } else if (name === "objects_list") {
            const list = value as number[];
            this.activeObjects = this.map.spawnpoints.filter((s) =>
                list.includes(s.team)
            );
        }
    }

    draw(x: number, y: number, s: number): void {
        const m = mat3();
        m[0] = s;
        m[3] = 0;
        m[6] = x * s;
        m[1] = 0;
        m[4] = s;
        m[7] = y * s;
        m[2] = 0;
        m[5] = 0;
        m[8] = 1;
        this.gfx.transform(m);

        for (const batch of this.activeBatches) {
            this.drawBatch(batch);
        }

        const { gfx, objectsTexture, objectsVbo, objectsIbo, activeObjects } =
            this;
        if (this.cfg.objects && activeObjects.length > 0) {
            objectsVbo.clear();
            const white: readonly number[] = [255, 255, 255, 255];
            for (const obj of activeObjects) {
                const sprite = OBJECTS_ATLAS.sprites[obj.team];
                if (!sprite) continue;
                const w = sprite.width;
                const h = sprite.height;
                const uv = sprite.uv;
                const ox = Math.floor(mat3mulx(m, obj.x, -obj.y) - 0.5 * w);
                const oy = Math.floor(mat3muly(m, obj.x, -obj.y) - 0.5 * h);
                objectsVbo.push(ox, oy, uv[0].x, uv[1].y, white);
                objectsVbo.push(ox + w, oy, uv[1].x, uv[1].y, white);
                objectsVbo.push(ox + w, oy + h, uv[1].x, uv[0].y, white);
                objectsVbo.push(ox, oy + h, uv[0].x, uv[0].y, white);
            }
            objectsVbo.upload();
            gfx.transform(mat3identity(m));
            gfx.bind(objectsTexture);
            gfx.draw(
                gfx.Triangles,
                objectsVbo,
                objectsIbo,
                0,
                6 * activeObjects.length
            );
        }
    }

    screenshot(ratio: number): void {
        const { gfx, map } = this;
        const vertices = map.polygons.flatMap((p) => p.vertices);
        const xs = vertices.map((v) => v.x);
        const ys = vertices.map((v) => v.y);
        const margin = 10;
        const xmin = Math.floor(Math.min(...xs)) - margin;
        const xmax = Math.ceil(Math.max(...xs)) + margin;
        const ymin = Math.floor(Math.min(...ys)) - margin;
        const ymax = Math.ceil(Math.max(...ys)) + margin;

        const oldW = gfx.canvas.width;
        const oldH = gfx.canvas.height;

        gfx.canvas.width = Math.floor(Math.abs(xmax - xmin) * ratio);
        gfx.canvas.height = Math.floor(Math.abs(ymax - ymin) * ratio);

        const w = gfx.canvas.width / ratio;
        const h = gfx.canvas.height / ratio;

        gfx.viewport(0, 0, gfx.canvas.width, gfx.canvas.height);
        gfx.projection(mat3ortho(0, w, 0, h, mat3()));
        gfx.blend(
            gfx.SrcAlpha,
            gfx.OneMinusSrcAlpha,
            gfx.SrcAlpha,
            gfx.OneMinusSrcAlpha
        );
        gfx.clear_color(0, 0, 0, 1);
        gfx.clear();
        this.draw(w / 2, h / 2, 1);

        gfx.canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = map.id + ".png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, "image/png");

        gfx.canvas.width = oldW;
        gfx.canvas.height = oldH;
    }

    private drawBatch(batch: Batch): void {
        const { gfx, vbo, ibo, textures } = this;
        for (const call of batch.calls) {
            gfx.bind(textures[call.texture + 4] ?? gfx.White);
            gfx.draw(
                batch.mode,
                vbo,
                ibo,
                batch.ibo_index + call.offset,
                call.count
            );
        }
    }

    private imagePath(path: string): string | null {
        const exts = ["png", "jpg", "gif", "bmp"];
        const parts = path.toLowerCase().split(".");
        parts.pop();
        const base = parts.join(".");

        for (const ext of exts) {
            const found = this.filelist.find(
                (fp) => fp.toLowerCase() === `${this.root}/${base}.${ext}`
            );
            if (found) return "/mapviewer/data/" + found;
        }
        return null;
    }

    private createTextureFromImage(
        image: HTMLImageElement,
        pot: boolean
    ): Texture {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        let w = image.width;
        let h = image.height;
        if (pot) {
            let pw = 1;
            while (pw < w) pw <<= 1;
            w = pw;
            let ph = 1;
            while (ph < h) ph <<= 1;
            h = ph;
        }
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(image, 0, 0, w, h);
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            if (data[i] === 0 && data[i + 1] === 255 && data[i + 2] === 0) {
                data[i + 1] = 0;
                data[i + 3] = 0;
            }
        }
        ctx.putImageData(imageData, 0, 0);
        return this.gfx.create_texture(canvas);
    }

    private setupTextures(): void {
        const { gfx, map } = this;

        this.blackTexture = gfx.create_texture(
            1,
            1,
            gfx.RGBA,
            (_x, _y, rgba) => {
                rgba[0] = rgba[1] = rgba[2] = 0.5;
                rgba[3] = 1;
            }
        );

        this.colliderTexture = gfx.create_texture(
            256,
            256,
            gfx.RGBA,
            (x, y, rgba) => {
                const dx = x - 128,
                    dy = y - 128;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const inner = 1,
                    outer = 0.5;
                const color = inner + (outer - inner) * (dist / 128);
                const t = Math.max(Math.min((dist - 127) / (128 - 127), 1), 0);
                const alpha = 1 - t * t * (3 - 2 * t);
                rgba[0] = rgba[1] = rgba[2] = 1;
                rgba[3] = color * alpha;
            }
        );
        this.colliderTexture.generateMipmap();
        this.colliderTexture.filter(
            gfx.LinearMipmapLinear,
            gfx.Linear ?? gfx.Nearest
        );

        this.objectsTexture = gfx.White;

        for (let i = 0; i < map.images.length + 1; i++)
            this.textures.push(gfx.White);
        this.textures.unshift(
            this.objectsTexture,
            this.colliderTexture,
            this.blackTexture,
            gfx.White
        );
    }

    private loadImages(): void {
        const { gfx, map } = this;

        const texturePaths: (string | null)[] = [];
        texturePaths[0] = this.imagePath("textures/" + map.texture);
        for (let i = 0; i < map.objects.length; i++) {
            texturePaths[map.objects[i]!.style] = this.imagePath(
                "scenery-gfx/" + map.images[map.objects[i]!.style - 1]!
            );
        }

        const load = (index: number, src: string) => {
            const image = new Image();
            image.onload = () => {
                const tex = this.createTextureFromImage(image, index === 0);
                if (index === 0) tex.wrap(gfx.Repeat, gfx.Repeat);
                this.textures[index + 4] = tex;
                this.onUpdate?.();
            };
            image.onerror = () => {
                this.textures[index + 4] = gfx.White;
                this.onUpdate?.();
            };
            image.src = src;
        };

        for (let i = 0; i < texturePaths.length; i++) {
            if (texturePaths[i] !== null && texturePaths[i] !== undefined) {
                load(i, texturePaths[i]!);
            }
        }

        const objImage = new Image();
        objImage.onload = () => {
            const tex = gfx.create_texture(objImage);
            tex.filter(gfx.Nearest, gfx.Nearest);
            this.objectsTexture = tex;
            this.textures[0] = tex;
            this.onUpdate?.();
        };
        objImage.onerror = () => {
            this.objectsTexture = gfx.White;
            this.textures[0] = gfx.White;
            this.onUpdate?.();
        };
        objImage.src = "/mapviewer/data/objects/objects.png";
    }

    private getEdges(): [
        [
            {
                x: number;
                y: number;
                u: number;
                v: number;
                color: readonly number[];
            },
            {
                x: number;
                y: number;
                u: number;
                v: number;
                color: readonly number[];
            },
        ],
    ] {
        const polys = [...this.map.polygons, ...this.map.bgpolygons];
        type Edge = [
            {
                x: number;
                y: number;
                u: number;
                v: number;
                color: readonly number[];
            },
            {
                x: number;
                y: number;
                u: number;
                v: number;
                color: readonly number[];
            },
        ];
        const list: Edge[] = [];

        for (const poly of polys) {
            list.push([poly.vertices[0]!, poly.vertices[1]!]);
            list.push([poly.vertices[1]!, poly.vertices[2]!]);
            list.push([poly.vertices[2]!, poly.vertices[0]!]);
        }
        list.reverse();

        const isVertEq = (
            a: { x: number; y: number },
            b: { x: number; y: number }
        ) => Math.abs(a.x - b.x) < 0.01 && Math.abs(a.y - b.y) < 0.01;

        const filtered: Edge[] = [];
        for (const edge of list) {
            if (
                !filtered.some(
                    (e) =>
                        (isVertEq(e[0], edge[0]) && isVertEq(e[1], edge[1])) ||
                        (isVertEq(e[0], edge[1]) && isVertEq(e[1], edge[0]))
                )
            ) {
                filtered.push(edge);
            }
        }
        filtered.reverse();
        return filtered as unknown as [
            [
                {
                    x: number;
                    y: number;
                    u: number;
                    v: number;
                    color: readonly number[];
                },
                {
                    x: number;
                    y: number;
                    u: number;
                    v: number;
                    color: readonly number[];
                },
            ],
        ];
    }

    private setupMatrix(
        m: Float32Array,
        obj: {
            x: number;
            y: number;
            rotation: number;
            scalex: number;
            scaley: number;
        }
    ): Float32Array {
        const c = Math.cos(obj.rotation),
            s = Math.sin(obj.rotation);
        m[0] = c * obj.scalex;
        m[3] = -s * obj.scaley;
        m[6] = obj.x;
        m[1] = s * obj.scalex;
        m[4] = c * obj.scaley;
        m[7] = -obj.y;
        m[2] = 0;
        m[5] = 0;
        m[8] = 1;
        return m;
    }

    private init(): void {
        const { gfx, map } = this;
        const sceneryBack = map.objects.filter((o) => o.level === 0);
        const sceneryMiddle = map.objects.filter((o) => o.level === 1);
        const sceneryFront = map.objects.filter((o) => o.level === 2);
        const { polygons, bgpolygons, colliders } = map;
        const edges = this.getEdges() as unknown as Array<
            [
                {
                    x: number;
                    y: number;
                    u: number;
                    v: number;
                    color: readonly number[];
                },
                {
                    x: number;
                    y: number;
                    u: number;
                    v: number;
                    color: readonly number[];
                },
            ]
        >;

        const vboSize =
            4 +
            3 * bgpolygons.length +
            4 * sceneryBack.length +
            4 * sceneryMiddle.length +
            4 * sceneryFront.length +
            3 * polygons.length +
            3 * (polygons.length + bgpolygons.length) +
            2 * edges.length +
            4 * colliders.length;

        const iboSize =
            6 +
            3 * bgpolygons.length +
            6 * sceneryBack.length +
            6 * sceneryMiddle.length +
            6 * sceneryFront.length +
            3 * polygons.length +
            3 * (polygons.length + bgpolygons.length) +
            2 * edges.length +
            6 * colliders.length;

        this.vbo = gfx.create_vbo(vboSize, gfx.Static);
        this.ibo = gfx.create_ibo(iboSize, gfx.Static);
        this.vbo.size = vboSize;
        this.ibo.size = iboSize;

        const vbo = this.vbo,
            ibo = this.ibo;
        const idx = { vbo: 0, ibo: 0 };

        // Background
        const bgBatch: Batch = {
            mode: gfx.Triangles,
            ibo_index: idx.ibo,
            vbo_index: idx.vbo,
            calls: [],
        };
        bgBatch.calls.push({ offset: idx.ibo, count: 6, texture: -1 });
        const d = map.sector_division,
            n = map.num_sectors;
        ibo.set(idx.ibo++, idx.vbo + 0);
        ibo.set(idx.ibo++, idx.vbo + 1);
        ibo.set(idx.ibo++, idx.vbo + 2);
        ibo.set(idx.ibo++, idx.vbo + 2);
        ibo.set(idx.ibo++, idx.vbo + 3);
        ibo.set(idx.ibo++, idx.vbo + 0);
        vbo.set(idx.vbo++, -n * d, n * d, 0, 0, map.bg_color_top);
        vbo.set(idx.vbo++, n * d, n * d, 0, 0, map.bg_color_top);
        vbo.set(idx.vbo++, n * d, -n * d, 0, 0, map.bg_color_bottom);
        vbo.set(idx.vbo++, -n * d, -n * d, 0, 0, map.bg_color_bottom);
        this.batches.background = bgBatch;

        // BG polygons
        const bgPolyBatch: Batch = {
            mode: gfx.Triangles,
            ibo_index: idx.ibo,
            vbo_index: idx.vbo,
            calls: [],
        };
        bgPolyBatch.calls.push({
            offset: 0,
            count: 3 * bgpolygons.length,
            texture: 0,
        });
        for (const tri of bgpolygons) {
            ibo.set(idx.ibo++, idx.vbo);
            ibo.set(idx.ibo++, idx.vbo + 1);
            ibo.set(idx.ibo++, idx.vbo + 2);
            for (const v of tri.vertices)
                vbo.set(idx.vbo++, v.x, -v.y, v.u, v.v, v.color);
        }
        this.batches.bgpolygons = bgPolyBatch;

        // Scenery batches
        this.batches.scenery_back = this.createSceneryBatch(sceneryBack, idx);
        this.batches.scenery_middle = this.createSceneryBatch(
            sceneryMiddle,
            idx
        );
        this.batches.scenery_front = this.createSceneryBatch(sceneryFront, idx);

        // Polygons
        const polyBatch: Batch = {
            mode: gfx.Triangles,
            ibo_index: idx.ibo,
            vbo_index: idx.vbo,
            calls: [],
        };
        polyBatch.calls.push({
            offset: 0,
            count: 3 * polygons.length,
            texture: 0,
        });
        for (const tri of polygons) {
            ibo.set(idx.ibo++, idx.vbo);
            ibo.set(idx.ibo++, idx.vbo + 1);
            ibo.set(idx.ibo++, idx.vbo + 2);
            for (const v of tri.vertices)
                vbo.set(idx.vbo++, v.x, -v.y, v.u, v.v, v.color);
        }
        this.batches.polygons = polyBatch;

        // Highlight batch
        const hlColor: readonly number[] = [255, 255, 0, 128];
        const hlBatch: Batch = {
            mode: gfx.Triangles,
            ibo_index: idx.ibo,
            vbo_index: idx.vbo,
            calls: [],
        };
        hlBatch.calls.push({ offset: 0, count: 0, texture: -1 });
        const allPolys = [...polygons, ...bgpolygons];
        for (const tri of allPolys) {
            ibo.set(idx.ibo++, idx.vbo);
            ibo.set(idx.ibo++, idx.vbo + 1);
            ibo.set(idx.ibo++, idx.vbo + 2);
            for (const v of tri.vertices)
                vbo.set(idx.vbo++, v.x, -v.y, 0, 0, hlColor);
        }
        this.batches.highlight = hlBatch;

        // Wireframe
        const wireBatch: Batch = {
            mode: gfx.Lines,
            ibo_index: idx.ibo,
            vbo_index: idx.vbo,
            calls: [],
        };
        wireBatch.calls.push({
            offset: 0,
            count: 2 * edges.length,
            texture: -1,
        });
        for (const [e0, e1] of edges) {
            ibo.set(idx.ibo++, idx.vbo);
            ibo.set(idx.ibo++, idx.vbo + 1);
            vbo.set(idx.vbo++, e0.x, -e0.y, e0.u, e0.v, [
                e0.color[0]!,
                e0.color[1]!,
                e0.color[2]!,
                255,
            ]);
            vbo.set(idx.vbo++, e1.x, -e1.y, e1.u, e1.v, [
                e1.color[0]!,
                e1.color[1]!,
                e1.color[2]!,
                255,
            ]);
        }
        this.batches.wireframe = wireBatch;

        // Colliders
        const colliderColor: readonly number[] = [255, 0, 0, 255];
        const colBatch: Batch = {
            mode: gfx.Triangles,
            ibo_index: idx.ibo,
            vbo_index: idx.vbo,
            calls: [],
        };
        colBatch.calls.push({
            offset: 0,
            count: 6 * colliders.length,
            texture: -3,
        });
        for (const col of colliders) {
            const cx = col.x,
                cy = -col.y,
                r = col.radius / 2.0;
            ibo.set(idx.ibo++, idx.vbo);
            ibo.set(idx.ibo++, idx.vbo + 1);
            ibo.set(idx.ibo++, idx.vbo + 2);
            ibo.set(idx.ibo++, idx.vbo + 2);
            ibo.set(idx.ibo++, idx.vbo + 3);
            ibo.set(idx.ibo++, idx.vbo);
            vbo.set(idx.vbo++, cx - r, cy - r, 0, 0, colliderColor);
            vbo.set(idx.vbo++, cx + r, cy - r, 1, 0, colliderColor);
            vbo.set(idx.vbo++, cx + r, cy + r, 1, 1, colliderColor);
            vbo.set(idx.vbo++, cx - r, cy + r, 0, 1, colliderColor);
        }
        this.batches.colliders = colBatch;

        // Spawn objects buffer
        this.objectsVbo = gfx.create_vbo(
            4 * map.spawnpoints.length,
            gfx.Stream
        );
        this.objectsIbo = gfx.create_ibo(
            6 * map.spawnpoints.length,
            gfx.Stream
        );
        for (let i = 0; i < 4 * map.spawnpoints.length; i += 4)
            this.objectsIbo.push(i, i + 1, i + 2, i + 2, i + 3, i);

        vbo.upload();
        ibo.upload();
        this.objectsIbo.upload();
        this.updateActiveBatches();
    }

    private createSceneryBatch(
        scenery: PmsMap["objects"],
        idx: { vbo: number; ibo: number }
    ): Batch {
        const { gfx, vbo, ibo } = this;
        const batch: Batch = {
            mode: gfx.Triangles,
            ibo_index: idx.ibo,
            vbo_index: idx.vbo,
            calls: [],
        };
        if (scenery.length === 0) return batch;

        let call: DrawCall = {
            offset: 0,
            count: 0,
            texture: scenery[0]!.style,
        };
        const m = mat3();

        for (const obj of scenery) {
            if (obj.style !== call.texture) {
                batch.calls.push(call);
                call = {
                    offset: call.offset + call.count,
                    count: 0,
                    texture: obj.style,
                };
            }
            this.setupMatrix(m, obj);
            const w = obj.width,
                h = obj.height,
                color = obj.color;
            ibo.set(idx.ibo++, idx.vbo);
            ibo.set(idx.ibo++, idx.vbo + 1);
            ibo.set(idx.ibo++, idx.vbo + 2);
            ibo.set(idx.ibo++, idx.vbo + 2);
            ibo.set(idx.ibo++, idx.vbo + 3);
            ibo.set(idx.ibo++, idx.vbo);
            vbo.set(
                idx.vbo++,
                mat3mulx(m, 0, 0),
                mat3muly(m, 0, 0),
                0,
                0,
                color
            );
            vbo.set(
                idx.vbo++,
                mat3mulx(m, w, 0),
                mat3muly(m, w, 0),
                1,
                0,
                color
            );
            vbo.set(
                idx.vbo++,
                mat3mulx(m, w, -h),
                mat3muly(m, w, -h),
                1,
                1,
                color
            );
            vbo.set(
                idx.vbo++,
                mat3mulx(m, 0, -h),
                mat3muly(m, 0, -h),
                0,
                1,
                color
            );
            call.count += 6;
        }
        batch.calls.push(call);
        return batch;
    }

    private updateActiveBatches(): void {
        const { cfg, batches } = this;
        this.activeBatches = [];
        if (cfg.background) this.activeBatches.push(batches.background!);
        if (cfg.polygons) this.activeBatches.push(batches.bgpolygons!);
        if (cfg.scenery_back) this.activeBatches.push(batches.scenery_back!);
        if (cfg.scenery_middle)
            this.activeBatches.push(batches.scenery_middle!);
        if (cfg.polygons) this.activeBatches.push(batches.polygons!);
        if (cfg.highlight) this.activeBatches.push(batches.highlight!);
        if (cfg.scenery_front) this.activeBatches.push(batches.scenery_front!);
        if (cfg.colliders) this.activeBatches.push(batches.colliders!);
        if (cfg.wireframe) this.activeBatches.push(batches.wireframe!);
    }

    private updateHighlightBatch(): void {
        const { map } = this;
        const types = this.cfg.highlight_list;
        const allPolys = [...map.polygons, ...map.bgpolygons];
        const matching = allPolys
            .map((_, i) => i)
            .filter((i) => types.includes(allPolys[i]!.type));

        this.batches.highlight!.calls[0]!.count = 3 * matching.length;
        let iboIndex = this.batches.highlight!.ibo_index;
        const vboBase = this.batches.highlight!.vbo_index;

        for (const polyIdx of matching) {
            const vboIndex = vboBase + 3 * polyIdx;
            this.ibo.set(iboIndex++, vboIndex);
            this.ibo.set(iboIndex++, vboIndex + 1);
            this.ibo.set(iboIndex++, vboIndex + 2);
        }
        this.ibo.upload(this.batches.highlight!.ibo_index, 3 * matching.length);
    }
}
