import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import JSZip from "jszip";
import { GfxContext, mat3, mat3ortho } from "./gfx";
import { parseMap, PmsMap } from "./map";
import { MapRenderer, RendererConfig } from "./render";
import { FuzzySearch } from "./fuzzy";

const SPAWN_LABELS = [
    "General", "Alpha", "Bravo", "Charlie", "Delta",
    "Alpha Flag", "Bravo Flag", "Grenades", "Medkits", "Clusters",
    "Vest", "Flamer", "Berserker", "Predator", "Yellow Flag",
    "Rambo Bow", "Stat Gun",
];

const HIGHLIGHT_LABELS = [
    "Normal", "Only Bullets Collide", "Only Players Collide", "No Collide",
    "Ice", "Deadly", "Bloody deadly", "Hurts", "Regenerates", "Lava",
    "Alpha Bullets", "Alpha Players", "Bravo Bullets", "Bravo Players",
    "Charlie Bullets", "Charlie Players", "Delta Bullets", "Delta Players",
    "Bouncy", "Explosive", "Hurt Flaggers", "Flagger Collides",
    "Non Flagger Collides", "Flag Collides", "Background", "Background Transition",
];

const defaultConfig: RendererConfig = {
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
    objects_list: SPAWN_LABELS.map((_, i) => i),
};

function escapeUrl(s: string): string {
    return s.replace(/#/g, "%23");
}

const Checkbox: React.FC<{
    id: string;
    label: string;
    checked: boolean;
    onChange: (id: string, checked: boolean) => void;
}> = ({ id, label, checked, onChange }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}
        onClick={() => onChange(id, !checked)}>
        <span style={{
            display: "inline-block", width: 9, height: 9,
            border: "1px solid #fff", boxSizing: "border-box",
            position: "relative", flexShrink: 0,
        }}>
            {checked && (
                <span style={{
                    position: "absolute", top: 2, left: 2,
                    width: 3, height: 3, background: "#fff",
                }} />
            )}
        </span>
        <span>{label}</span>
    </div>
);

export const App: React.FC = () => {
    const [searchParams] = useSearchParams();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);
    const gfxRef = useRef<GfxContext | null>(null);
    const rendererRef = useRef<MapRenderer | null>(null);
    const mapRef = useRef<PmsMap | null>(null);
    const filelistRef = useRef<string[]>([]);
    const fuzzyRef = useRef<FuzzySearch | null>(null);
    const edgeslistRef = useRef<string[]>([]);

    const dxRef = useRef(0);
    const dyRef = useRef(0);
    const scaleRef = useRef(1);
    const mouseRef = useRef({ x: 0, y: 0 });

    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [mapName, setMapName] = useState("");
    const [mapCategory, setMapCategory] = useState("");
    const [mapInfo, setMapInfo] = useState<PmsMap | null>(null);
    const [screenshotScale, setScreenshotScale] = useState("1x");
    const [viewCfg, setViewCfg] = useState<RendererConfig>({ ...defaultConfig });
    const [searchText, setSearchText] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [focusedIdx, setFocusedIdx] = useState(-1);
    const searchRef = useRef<HTMLInputElement>(null);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        const gfx = gfxRef.current;
        const renderer = rendererRef.current;
        if (!canvas || !gfx || !renderer) return;

        const w = (canvas.width = canvas.offsetWidth);
        const h = (canvas.height = canvas.offsetHeight);

        gfx.viewport(0, 0, w, h);
        gfx.projection(mat3ortho(0, w, 0, h, mat3()));
        gfx.blend(gfx.SrcAlpha, gfx.OneMinusSrcAlpha, gfx.SrcAlpha, gfx.OneMinusSrcAlpha);
        gfx.clear_color(0, 0, 0, 1);
        gfx.clear();
        renderer.draw(
            (1 / scaleRef.current) * (w / 2) + dxRef.current,
            (1 / scaleRef.current) * (h / 2) + dyRef.current,
            scaleRef.current,
        );
    }, []);

    const loadMap = useCallback(
        (nameArg: string) => {
            if (!gfxRef.current) return;
            const parts = nameArg.split("/");
            if (parts.length === 1) parts.unshift("climb");

            const category = parts[0]!;
            const name = decodeURIComponent(parts[1]!);

            setLoading(true);
            setLoadError(false);

            fetch(`/mapviewer/data/${category}/maps/${escapeUrl(name)}.pms`)
                .then((res) => {
                    if (!res.ok) throw new Error("not found");
                    return res.arrayBuffer();
                })
                .then((buffer) => {
                    dxRef.current = 0;
                    dyRef.current = 0;
                    scaleRef.current = 1;

                    const prevCfg = rendererRef.current?.config();
                    const map = parseMap(buffer);
                    map.id = `${category}_${name}`;

                    mapRef.current = map;

                    new MapRenderer(
                        gfxRef.current!,
                        map,
                        filelistRef.current,
                        category,
                        (renderer) => {
                            rendererRef.current = renderer;
                            setLoading(false);
                            setMapName(name);
                            setMapCategory(category);
                            setMapInfo(map);

                            if (prevCfg) {
                                (Object.keys(prevCfg) as Array<keyof RendererConfig>).forEach((k) => {
                                    renderer.config(k, (prevCfg as unknown as Record<string, unknown>)[k] as never);
                                });
                            }

                            const verts = map.polygons.flatMap((p) => p.vertices);
                            if (verts.length === 0) { draw(); return; }

                            const xs = verts.map((v) => v.x);
                            const ys = verts.map((v) => v.y);
                            const xmin = Math.min(...xs), xmax = Math.max(...xs);
                            const ymin = Math.min(...ys), ymax = Math.max(...ys);
                            const wopt = optionsRef.current?.offsetWidth ?? 200;
                            const W = window.innerWidth - wopt;

                            scaleRef.current = 0.9 * Math.min(W / (xmax - xmin), window.innerHeight / (ymax - ymin));
                            dxRef.current = xmin + (xmax - xmin) * 0.5 - 0.5 * (wopt / scaleRef.current);
                            dyRef.current = ymin + (ymax - ymin) * 0.5;

                            draw();
                        },
                        () => draw(),
                    );
                })
                .catch((err) => {
                    console.error("loadMap error:", err);
                    setLoading(false);
                    setLoadError(true);
                });
        },
        [draw],
    );

    useEffect(() => {
        if (!canvasRef.current) return;
        gfxRef.current = new GfxContext(canvasRef.current, { alpha: false });

        fetch("/mapviewer/data/filelist")
            .then((r) => r.text())
            .then((text) => {
                const list = text.split(/\r?\n/).filter((l) => l !== "");
                filelistRef.current = list;

                edgeslistRef.current = list
                    .filter((p) => /\/edges\//.test(p))
                    .map((p) => p.split("/")[3] ?? "");

                const maplist = list
                    .filter((p) => p.split(".").pop() === "pms")
                    .map((p) => {
                        const parts = p.split("/");
                        return parts[0]! + "/" + parts[parts.length - 1]!.slice(0, -4);
                    });

                fuzzyRef.current = new FuzzySearch(maplist);

                const mapParam = searchParams.get("map");
                loadMap(mapParam ?? "climb/mc_1octagon");
            });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        window.addEventListener("resize", draw);
        return () => window.removeEventListener("resize", draw);
    }, [draw]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const onMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };

        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            const prev = scaleRef.current;
            const ox = mouseRef.current.x - window.innerWidth / 2;
            const oy = -(mouseRef.current.y - window.innerHeight / 2);
            if (e.deltaY < 0) scaleRef.current *= 1.25;
            else scaleRef.current /= 1.25;
            dxRef.current += ox / scaleRef.current - ox / prev;
            dyRef.current += oy / scaleRef.current - oy / prev;
            draw();
        };

        const onDblClick = (e: MouseEvent) => {
            e.preventDefault();
            scaleRef.current = 1;
            draw();
        };

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.code === "NumpadAdd" || e.key === "+") {
                const prev = scaleRef.current;
                scaleRef.current *= 1.25;
                const ox = mouseRef.current.x - window.innerWidth / 2;
                const oy = -(mouseRef.current.y - window.innerHeight / 2);
                dxRef.current += ox / scaleRef.current - ox / prev;
                dyRef.current += oy / scaleRef.current - oy / prev;
                draw();
            } else if (e.code === "NumpadSubtract" || e.key === "-") {
                const prev = scaleRef.current;
                scaleRef.current /= 1.25;
                const ox = mouseRef.current.x - window.innerWidth / 2;
                const oy = -(mouseRef.current.y - window.innerHeight / 2);
                dxRef.current += ox / scaleRef.current - ox / prev;
                dyRef.current += oy / scaleRef.current - oy / prev;
                draw();
            }
        };

        const onMouseDown = (e: MouseEvent) => {
            searchRef.current?.blur();
            e.preventDefault();
            let x = e.clientX, y = e.clientY;

            const onMove = (ev: MouseEvent) => {
                dxRef.current += (ev.clientX - x) / scaleRef.current;
                dyRef.current += (y - ev.clientY) / scaleRef.current;
                x = ev.clientX;
                y = ev.clientY;
                requestAnimationFrame(draw);
            };
            const onUp = () => {
                window.removeEventListener("mousemove", onMove);
                window.removeEventListener("mouseup", onUp);
            };
            window.addEventListener("mousemove", onMove);
            window.addEventListener("mouseup", onUp);
        };

        window.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("wheel", onWheel, { passive: false });
        canvas.addEventListener("dblclick", onDblClick);
        canvas.addEventListener("mousedown", onMouseDown);
        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            canvas.removeEventListener("wheel", onWheel);
            canvas.removeEventListener("dblclick", onDblClick);
            canvas.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [draw]);

    const handleSearchChange = (val: string) => {
        setSearchText(val);
        setFocusedIdx(-1);
        if (val.length > 0 && fuzzyRef.current) {
            setSuggestions(fuzzyRef.current.find(val).slice(0, 50));
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const selectMap = (name: string) => {
        setSearchText(name);
        setShowSuggestions(false);
        setSuggestions([]);
        loadMap(name);
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showSuggestions) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setFocusedIdx((i) => Math.min(i + 1, suggestions.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setFocusedIdx((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            const target = focusedIdx >= 0 ? suggestions[focusedIdx] : suggestions[0];
            if (target) selectMap(target);
        } else if (e.key === "Escape") {
            setShowSuggestions(false);
        }
    };

    const applyCfgChange = (key: keyof RendererConfig, value: unknown) => {
        setViewCfg((prev) => {
            const next = { ...prev, [key]: value };
            rendererRef.current?.config(key, value as never);
            draw();
            return next;
        });
    };

    const handleViewChange = (key: string, checked: boolean) => {
        const name = key as keyof RendererConfig;

        if (name === "scenery_back" || name === "scenery_middle" || name === "scenery_front") {
            applyCfgChange(name, checked);
            if (checked) applyCfgChange("scenery_back", viewCfg.scenery_back || name === "scenery_back");
        } else if (name.startsWith("highlight_idx_")) {
            const idx = parseInt(name.split("_").pop()!);
            const newList = checked
                ? [...viewCfg.highlight_list, idx]
                : viewCfg.highlight_list.filter((i) => i !== idx);
            applyCfgChange("highlight_list", newList);
            if (newList.length > 0) applyCfgChange("highlight", true);
            else applyCfgChange("highlight", false);
        } else if (name.startsWith("objects_idx_")) {
            const idx = parseInt(name.split("_").pop()!);
            const newList = checked
                ? [...viewCfg.objects_list, idx]
                : viewCfg.objects_list.filter((i) => i !== idx);
            applyCfgChange("objects_list", newList);
            if (newList.length > 0) applyCfgChange("objects", true);
            else applyCfgChange("objects", false);
        } else {
            applyCfgChange(name, checked);
        }
    };

    const handleScreenshot = () => {
        const scale = parseFloat(screenshotScale) || 1;
        rendererRef.current?.screenshot(scale);
        draw();
    };

    const handleDownload = async () => {
        const map = mapRef.current;
        if (!map || !mapName || !mapCategory) return;

        const zip = new JSZip();
        const urls: string[] = [];

        for (let i = 0; i < map.images.length; i++) {
            if (map.scenery_counts[i] !== 0) urls.push(`scenery-gfx/${map.images[i]}`);
        }
        for (const edge of edgeslistRef.current) {
            if (map.texture.slice(0, -4).toLowerCase() === edge.slice(0, -4).toLowerCase())
                urls.push(`textures/edges/${edge}`);
        }
        urls.push(`maps/${mapName}.pms`, `textures/${map.texture}`);

        await Promise.all(
            urls.map(async (url) => {
                try {
                    const res = await fetch(`/mapviewer/data/${mapCategory}/${escapeUrl(url)}`);
                    if (res.ok) zip.file(url, await res.arrayBuffer());
                    else window.alert(`Warning: ${url} not found`);
                } catch {
                    window.alert(`Warning: ${url} could not be fetched`);
                }
            }),
        );

        const blob = await zip.generateAsync({ type: "blob" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${mapName} (${map.name}).zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    };

    const category = mapCategory
        ? mapCategory.charAt(0).toUpperCase() + mapCategory.slice(1)
        : "";

    const texturePath = mapInfo
        ? `/mapviewer/data/${mapCategory}/textures/${mapInfo.texture}`
        : "";

    return (
        <div style={{ margin: 0, padding: 0, width: "100vw", height: "100vh", overflow: "hidden", background: "#000", position: "relative" }}>
            {loading && (
                <div style={{
                    position: "absolute", inset: 0, display: "flex",
                    alignItems: "center", justifyContent: "center", zIndex: 10,
                }}>
                    <div style={{
                        width: 150, height: 150, lineHeight: "150px", textAlign: "center",
                        color: "#ccc", fontFamily: "sans-serif", fontWeight: "bold",
                        border: "5px solid #fff", borderRadius: "100px",
                        boxShadow: "0 0 50px #fff, inset 0 0 50px #fff",
                    }}>
                        LOADING
                    </div>
                </div>
            )}

            {loadError && !loading && (
                <div style={{
                    position: "absolute", inset: 0, display: "flex",
                    alignItems: "center", justifyContent: "center", zIndex: 10,
                    color: "#ccc", fontFamily: "sans-serif", fontWeight: "bold", fontSize: 14,
                }}>
                    MAP NOT FOUND
                </div>
            )}

            <canvas
                ref={canvasRef}
                style={{ display: loading || loadError ? "none" : "block", width: "100%", height: "100%" }}
            />

            {!loading && !loadError && (
                <div style={{
                    position: "absolute", top: 20, left: 20, zIndex: 5,
                    fontFamily: "monospace", fontSize: 13, color: "#fff",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div style={{ position: "relative" }}>
                            <input
                                ref={searchRef}
                                value={searchText}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                onFocus={() => searchText && setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                                placeholder="Search maps..."
                                style={{
                                    outline: "none", border: "1px solid #fff",
                                    background: "rgba(0,0,0,0.7)", color: "#fff",
                                    padding: "2px 4px", fontFamily: "monospace", fontSize: 12,
                                    width: 180,
                                }}
                            />
                            {showSuggestions && suggestions.length > 0 && (
                                <ul style={{
                                    position: "absolute", top: "100%", left: 0,
                                    background: "#000", border: "1px solid #fff", borderTop: 0,
                                    margin: 0, padding: "0 10px", listStyle: "none",
                                    color: "#fff", maxHeight: 200, overflowY: "auto",
                                    opacity: 0.9, zIndex: 20, minWidth: "100%",
                                }}>
                                    {suggestions.map((s, i) => (
                                        <li
                                            key={s}
                                            onMouseDown={() => selectMap(s)}
                                            style={{
                                                padding: "2px 0", cursor: "pointer", whiteSpace: "nowrap",
                                                background: i === focusedIdx ? "#2e4183" : "transparent",
                                            }}
                                        >
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <button
                            onClick={handleScreenshot}
                            style={{
                                background: "transparent", border: "none", color: "#fff",
                                fontSize: 18, cursor: "pointer", padding: 0, lineHeight: 1,
                            }}
                            title="Screenshot"
                        >
                            📷
                        </button>
                        <input
                            value={screenshotScale}
                            onChange={(e) => setScreenshotScale(e.target.value)}
                            onBlur={(e) => {
                                const v = parseFloat(e.target.value);
                                setScreenshotScale((isNaN(v) || v <= 0 ? 1 : v) + "x");
                            }}
                            style={{
                                width: 40, background: "rgba(0,0,0,0.7)", border: "1px solid #fff",
                                color: "#fff", fontFamily: "monospace", fontSize: 12, padding: "2px 4px",
                            }}
                        />
                    </div>
                </div>
            )}

            {!loading && !loadError && mapInfo && (
                <div style={{
                    position: "absolute", bottom: 20, left: 20, background: "#000",
                    border: "1px solid #fff", padding: "3px 16px",
                    fontFamily: "monospace", fontSize: 13, color: "#fff", opacity: 0.85,
                    maxWidth: 350, zIndex: 5, lineHeight: "1.4em",
                }}>
                    <p style={{ fontWeight: "bold", fontSize: 20, margin: "4px 0" }}>{mapName}</p>
                    <p style={{ fontSize: 12, margin: "0 0 10px" }}>{mapInfo.name}</p>
                    <div><span style={{ fontWeight: "bold" }}>Gamemode:</span> {category}</div>
                    <div>
                        <span style={{ fontWeight: "bold" }}>Texture:</span>{" "}
                        <a href={texturePath} target="_blank" rel="noreferrer" style={{ color: "#fff" }}>
                            {mapInfo.texture}
                        </a>{" "}
                        <a href={texturePath} target="_blank" rel="noreferrer" style={{ color: "#fff", fontSize: 18 }} title="Download texture">⬇</a>
                    </div>
                    <div>
                        <span style={{ fontWeight: "bold" }}>Polygons:</span>{" "}
                        {mapInfo.polygons.length + mapInfo.bgpolygons.length} ({mapInfo.bgpolygons.length} background)
                    </div>
                    <div><span style={{ fontWeight: "bold" }}>Spawnpoints:</span> {mapInfo.spawnpoints.length}</div>
                    <div><span style={{ fontWeight: "bold" }}>Jet amount:</span> {mapInfo.jet_amount}</div>
                    <div style={{ textAlign: "center", padding: "12px 8px 8px" }}>
                        <button
                            onClick={handleDownload}
                            style={{
                                padding: "0.4em", border: "0.1em solid #fff",
                                background: "transparent", color: "#fff",
                                textTransform: "uppercase", cursor: "pointer",
                                fontFamily: "monospace", fontSize: 13,
                            }}
                        >
                            DOWNLOAD {mapName}
                        </button>
                    </div>
                </div>
            )}

            {!loading && !loadError && (
                <div ref={optionsRef} style={{
                    position: "absolute", top: 0, right: 0, bottom: 0,
                    background: "#000", borderLeft: "1px solid #fff",
                    fontFamily: "monospace", fontSize: 13, color: "#fff",
                    lineHeight: "1.5em", opacity: 0.8, overflowY: "auto",
                    whiteSpace: "nowrap", padding: "10px 30px 10px 16px", zIndex: 5,
                }}>
                    <Checkbox id="background" label="Background" checked={viewCfg.background} onChange={handleViewChange} />
                    <Checkbox id="polygons" label="Polygons" checked={viewCfg.polygons} onChange={handleViewChange} />
                    <Checkbox id="texture" label="Texture" checked={viewCfg.texture} onChange={handleViewChange} />
                    <Checkbox id="wireframe" label="Wireframe" checked={viewCfg.wireframe} onChange={handleViewChange} />
                    <Checkbox id="colliders" label="Colliders" checked={viewCfg.colliders} onChange={handleViewChange} />

                    <Checkbox id="scenery_back" label="Scenery Back" checked={viewCfg.scenery_back} onChange={handleViewChange} />
                    <Checkbox id="scenery_middle" label="Scenery Middle" checked={viewCfg.scenery_middle} onChange={handleViewChange} />
                    <Checkbox id="scenery_front" label="Scenery Front" checked={viewCfg.scenery_front} onChange={handleViewChange} />

                    <Checkbox id="objects" label="Spawns" checked={viewCfg.objects} onChange={handleViewChange} />
                    <div style={{ marginLeft: 10 }}>
                        {SPAWN_LABELS.map((label, i) => (
                            <Checkbox
                                key={i}
                                id={`objects_idx_${i}`}
                                label={label}
                                checked={viewCfg.objects_list.includes(i)}
                                onChange={handleViewChange}
                            />
                        ))}
                    </div>

                    <Checkbox id="highlight" label="Highlight polygons" checked={viewCfg.highlight} onChange={handleViewChange} />
                    <div style={{ marginLeft: 10 }}>
                        {HIGHLIGHT_LABELS.map((label, i) => (
                            <Checkbox
                                key={i}
                                id={`highlight_idx_${i}`}
                                label={label}
                                checked={viewCfg.highlight_list.includes(i)}
                                onChange={handleViewChange}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
