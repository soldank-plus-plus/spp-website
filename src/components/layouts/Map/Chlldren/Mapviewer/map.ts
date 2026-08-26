export type RGBA = [number, number, number, number];

export interface Vec3 {
    x: number;
    y: number;
    z: number;
}

export interface Vertex {
    x: number;
    y: number;
    z: number;
    rhw: number;
    color: RGBA;
    u: number;
    v: number;
}

export interface Polygon {
    vertices: Vertex[];
    normals: Vec3[];
    type: number;
}

export interface MapObject {
    active: boolean;
    style: number;
    width: number;
    height: number;
    x: number;
    y: number;
    rotation: number;
    scalex: number;
    scaley: number;
    color: RGBA;
    level: number;
}

export interface Collider {
    active: boolean;
    x: number;
    y: number;
    radius: number;
}

export interface SpawnPoint {
    active: boolean;
    x: number;
    y: number;
    team: number;
}

export interface WayPoint {
    active: boolean;
    id: number;
    x: number;
    y: number;
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
    jet: boolean;
    path: number;
    action: number;
    c2: number;
    c3: number;
    cconnections: number[];
}

export interface PmsMap {
    id: string;
    version: number;
    name: string;
    texture: string;
    bg_color_top: RGBA;
    bg_color_bottom: RGBA;
    jet_amount: number;
    grenades: number;
    medikits: number;
    weather: number;
    steps: number;
    rand_id: number;
    polygons: Polygon[];
    bgpolygons: Polygon[];
    sector_division: number;
    num_sectors: number;
    sectors: number[][];
    objects: MapObject[];
    images: string[];
    scenery_counts: number[];
    colliders: Collider[];
    spawnpoints: SpawnPoint[];
    waypoints: WayPoint[];
}

class Reader {
    offset = 0;
    private view: DataView;

    constructor(buffer: ArrayBuffer) {
        this.view = new DataView(buffer);
    }

    i8(): number {
        return this.view.getInt8(this.offset++);
    }
    u8(): number {
        return this.view.getUint8(this.offset++);
    }
    i16(): number {
        const v = this.view.getInt16(this.offset, true);
        this.offset += 2;
        return v;
    }
    u16(): number {
        const v = this.view.getUint16(this.offset, true);
        this.offset += 2;
        return v;
    }
    i32(): number {
        const v = this.view.getInt32(this.offset, true);
        this.offset += 4;
        return v;
    }
    u32(): number {
        const v = this.view.getUint32(this.offset, true);
        this.offset += 4;
        return v;
    }
    f32(): number {
        const v = this.view.getFloat32(this.offset, true);
        this.offset += 4;
        return v;
    }
    skip(n: number): void {
        this.offset += n;
    }

    str(max: number): string {
        const len = this.u8();
        const chars: number[] = [];
        for (let i = 0; i < len; i++) chars.push(this.u8());
        this.skip(max - len);
        return String.fromCharCode(...chars);
    }
}

function bgra(b: number, g: number, r: number, a: number): RGBA {
    return [r, g, b, a];
}
function vec3(x: number, y: number, z: number): Vec3 {
    return { x, y, z };
}

function readVertex(r: Reader): Vertex {
    return {
        x: r.f32(),
        y: r.f32(),
        z: r.f32(),
        rhw: r.f32(),
        color: bgra(r.u8(), r.u8(), r.u8(), r.u8()),
        u: r.f32(),
        v: r.f32(),
    };
}

function readPolygon(r: Reader): Polygon {
    const polygon: Polygon = { vertices: [], normals: [], type: 0 };
    polygon.vertices.push(readVertex(r), readVertex(r), readVertex(r));
    polygon.normals.push(
        vec3(r.f32(), r.f32(), r.f32()),
        vec3(r.f32(), r.f32(), r.f32()),
        vec3(r.f32(), r.f32(), r.f32())
    );
    polygon.type = r.u8();
    return polygon;
}

function readHeader(r: Reader, data: PmsMap): void {
    data.version = r.i32();
    data.name = r.str(38);
    data.texture = r.str(24);
    data.bg_color_top = bgra(r.u8(), r.u8(), r.u8(), r.u8());
    data.bg_color_bottom = bgra(r.u8(), r.u8(), r.u8(), r.u8());
    data.jet_amount = r.i32();
    data.grenades = r.u8();
    data.medikits = r.u8();
    data.weather = r.u8();
    data.steps = r.u8();
    data.rand_id = r.i32();
}

function readPolygons(r: Reader, data: PmsMap): void {
    const count = r.i32();
    for (let i = 0; i < count; i++) {
        const poly = readPolygon(r);
        if (poly.type > 23) data.bgpolygons.push(poly);
        else data.polygons.push(poly);
    }
}

function readSectors(r: Reader, data: PmsMap): void {
    data.sector_division = r.i32();
    data.num_sectors = r.i32();
    const count = (2 * data.num_sectors + 1) ** 2;
    for (let i = 0; i < count; i++) {
        const sector: number[] = [];
        const polyCount = r.u16();
        for (let j = 0; j < polyCount; j++) sector.push(r.u16());
        data.sectors.push(sector);
    }
}

function readObject(r: Reader, data: PmsMap): MapObject {
    const obj: MapObject = {
        active: r.u8() !== 0,
        style: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        rotation: 0,
        scalex: 0,
        scaley: 0,
        color: [0, 0, 0, 0],
        level: 0,
    };
    r.skip(1);
    obj.style = r.u16();
    obj.width = r.i32();
    obj.height = r.i32();
    obj.x = r.f32();
    obj.y = r.f32();
    obj.rotation = r.f32();
    obj.scalex = r.f32();
    obj.scaley = r.f32();
    data.scenery_counts[obj.style - 1] =
        (data.scenery_counts[obj.style - 1] ?? 0) + 1;
    const alpha = r.u8();
    r.skip(3);
    obj.color = bgra(r.u8(), r.u8(), r.u8(), r.u8());
    obj.color[3] = alpha;
    obj.level = r.u8();
    r.skip(3);
    return obj;
}

function readObjects(r: Reader, data: PmsMap): void {
    const count = r.i32();
    for (let i = 0; i < count; i++) data.objects.push(readObject(r, data));
}

function readImages(r: Reader, data: PmsMap): void {
    const count = r.i32();
    for (let i = 0; i < count; i++) {
        data.images.push(r.str(50));
        r.skip(4);
    }
    if (data.images.length > data.scenery_counts.length)
        data.scenery_counts.length = data.images.length;
    data.scenery_counts = Array.from(data.scenery_counts, (v) =>
        v === undefined ? 0 : v
    );
}

function readCollider(r: Reader): Collider {
    const c: Collider = { active: r.u8() !== 0, x: 0, y: 0, radius: 0 };
    r.skip(3);
    c.x = r.f32();
    c.y = r.f32();
    c.radius = r.f32();
    return c;
}

function readColliders(r: Reader, data: PmsMap): void {
    const count = r.i32();
    for (let i = 0; i < count; i++) data.colliders.push(readCollider(r));
}

function readSpawnPoint(r: Reader): SpawnPoint {
    const s: SpawnPoint = { active: r.u8() !== 0, x: 0, y: 0, team: 0 };
    r.skip(3);
    s.x = r.i32();
    s.y = r.i32();
    s.team = r.u32();
    return s;
}

function readSpawnPoints(r: Reader, data: PmsMap): void {
    const count = r.i32();
    for (let i = 0; i < count; i++) data.spawnpoints.push(readSpawnPoint(r));
}

function readWaypoint(r: Reader): WayPoint {
    const w: WayPoint = {
        active: r.u8() !== 0,
        id: 0,
        x: 0,
        y: 0,
        left: false,
        right: false,
        up: false,
        down: false,
        jet: false,
        path: 0,
        action: 0,
        c2: 0,
        c3: 0,
        cconnections: [],
    };
    r.skip(3);
    w.id = r.i32();
    w.x = r.i32();
    w.y = r.i32();
    w.left = r.u8() !== 0;
    w.right = r.u8() !== 0;
    w.up = r.u8() !== 0;
    w.down = r.u8() !== 0;
    w.jet = r.u8() !== 0;
    w.path = r.u8();
    w.action = r.u8();
    w.c2 = r.u8();
    w.c3 = r.u8();
    r.skip(3);
    const count = r.i32();
    for (let i = 0; i < count; i++) w.cconnections.push(r.i32());
    r.skip(4 * (20 - count));
    return w;
}

function readWaypoints(r: Reader, data: PmsMap): void {
    const count = r.i32();
    for (let i = 0; i < count; i++) data.waypoints.push(readWaypoint(r));
}

export function parseMap(buffer: ArrayBuffer): PmsMap {
    const r = new Reader(buffer);
    const data: PmsMap = {
        id: "",
        version: 0,
        name: "",
        texture: "",
        bg_color_top: [0, 0, 0, 0],
        bg_color_bottom: [0, 0, 0, 0],
        jet_amount: 0,
        grenades: 0,
        medikits: 0,
        weather: 0,
        steps: 0,
        rand_id: 0,
        polygons: [],
        bgpolygons: [],
        sector_division: 0,
        num_sectors: 0,
        sectors: [],
        objects: [],
        images: [],
        scenery_counts: [],
        colliders: [],
        spawnpoints: [],
        waypoints: [],
    };
    readHeader(r, data);
    readPolygons(r, data);
    readSectors(r, data);
    readObjects(r, data);
    readImages(r, data);
    readColliders(r, data);
    readSpawnPoints(r, data);
    readWaypoints(r, data);
    return data;
}
