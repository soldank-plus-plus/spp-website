import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { GfxContext, mat3, mat3ortho } from "../gfx";
import { parseMap } from "../map";
import { MapRenderer, RendererConfig } from "../render";
import { FuzzySearch } from "../fuzzy";
import { SPAWN_LABELS, HIGHLIGHT_LABELS, SIDEBAR_WIDTH, defaultConfig, escapeUrl } from "./appTypes";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/shadcn/sidebar";

const Checkbox: React.FC<{
    id: string;
    label: string;
    checked: boolean;
    onChange: (id: string, checked: boolean) => void;
}> = ({ id, label, checked, onChange }) => (
    <div
        className="flex items-center gap-1.5 cursor-pointer select-none py-0.5"
        onClick={() => onChange(id, !checked)}
    >
        <span className="inline-flex items-center justify-center w-2.5 h-2.5 border border-white shrink-0">
            {checked && <span className="w-1.5 h-1.5 bg-white block" />}
        </span>
        <span>{label}</span>
    </div>
);

export const App: React.FC = () => {
    const [searchParams] = useSearchParams();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gfxRef = useRef<GfxContext | null>(null);
    const rendererRef = useRef<MapRenderer | null>(null);
    const filelistRef = useRef<string[]>([]);
    const fuzzyRef = useRef<FuzzySearch | null>(null);

    const dxRef = useRef(0);
    const dyRef = useRef(0);
    const scaleRef = useRef(1);
    const mouseRef = useRef({ x: 0, y: 0 });

    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
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

        const w = (canvas.width = window.innerWidth);
        const h = (canvas.height = window.innerHeight);

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

                    new MapRenderer(
                        gfxRef.current!,
                        map,
                        filelistRef.current,
                        category,
                        (renderer) => {
                            rendererRef.current = renderer;
                            setLoading(false);

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
                            const W = window.innerWidth - SIDEBAR_WIDTH;
                            const H = window.innerHeight;

                            scaleRef.current = 0.9 * Math.min(W / (xmax - xmin), H / (ymax - ymin));
                            dxRef.current = -(xmin + xmax) / 2 - SIDEBAR_WIDTH / (2 * scaleRef.current);
                            dyRef.current = -(ymin + ymax) / 2;

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
    }, []);

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

        if (name === "objects") {
            const newList = checked ? SPAWN_LABELS.map((_, i) => i) : [];
            applyCfgChange("objects_list", newList);
            applyCfgChange("objects", checked);
        } else if (name === "highlight") {
            const newList = checked ? HIGHLIGHT_LABELS.map((_, i) => i) : [];
            applyCfgChange("highlight_list", newList);
            applyCfgChange("highlight", checked);
        } else if (name.startsWith("objects_idx_")) {
            const idx = parseInt(name.split("_").pop()!);
            const newList = checked
                ? [...viewCfg.objects_list, idx]
                : viewCfg.objects_list.filter((i) => i !== idx);
            applyCfgChange("objects_list", newList);
            applyCfgChange("objects", newList.length > 0);
        } else if (name.startsWith("highlight_idx_")) {
            const idx = parseInt(name.split("_").pop()!);
            const newList = checked
                ? [...viewCfg.highlight_list, idx]
                : viewCfg.highlight_list.filter((i) => i !== idx);
            applyCfgChange("highlight_list", newList);
            applyCfgChange("highlight", newList.length > 0);
        } else if (name === "scenery_back" || name === "scenery_middle" || name === "scenery_front") {
            applyCfgChange(name, checked);
            if (checked) applyCfgChange("scenery_back", viewCfg.scenery_back || name === "scenery_back");
        } else {
            applyCfgChange(name, checked);
        }
    };

    const handleScreenshot = () => {
        rendererRef.current?.screenshot(1);
        draw();
    };

    return (
        <SidebarProvider
            defaultOpen={true}
            className="h-svh overflow-hidden"
            style={{
                "--sidebar-background": "0 0% 0%",
                "--sidebar-foreground": "0 0% 100%",
                "--sidebar-border": "0 0% 15%",
                "--sidebar-accent": "0 0% 10%",
                "--sidebar-accent-foreground": "0 0% 100%",
            } as React.CSSProperties}
        >
            <canvas
                ref={canvasRef}
                style={{
                    position: "fixed", top: 0, left: 0,
                    width: "100vw", height: "100vh", zIndex: 0,
                    display: loading || loadError ? "none" : "block",
                    background: "#000",
                }}
            />

            {loading && (
                <div style={{
                    position: "fixed", inset: 0, display: "flex",
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
                    position: "fixed", inset: 0, display: "flex",
                    alignItems: "center", justifyContent: "center", zIndex: 10,
                    color: "#ccc", fontFamily: "sans-serif", fontWeight: "bold", fontSize: 14,
                }}>
                    MAP NOT FOUND
                </div>
            )}

            <div style={{
                position: "fixed", top: 16, left: 16, zIndex: 5,
                display: "flex", alignItems: "center", gap: 6,
                fontFamily: "monospace", fontSize: 12, color: "#fff",
            }}>
                <SidebarTrigger className="text-white hover:bg-transparent hover:text-white h-6 w-6" />

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
            </div>

            <div style={{ flex: 1 }} />

            <Sidebar side="right" collapsible="offcanvas" className="font-mono text-xs text-white border-l border-white/20">
                <SidebarContent>

                    <SidebarGroup>
                        <SidebarGroupLabel className="text-white/50 text-[10px] uppercase tracking-widest px-3 py-2">
                            View
                        </SidebarGroupLabel>
                        <SidebarGroupContent className="px-3 space-y-0.5">
                            <Checkbox id="background" label="Background" checked={viewCfg.background} onChange={handleViewChange} />
                            <Checkbox id="polygons"   label="Polygons"   checked={viewCfg.polygons}   onChange={handleViewChange} />
                            <Checkbox id="texture"    label="Texture"    checked={viewCfg.texture}    onChange={handleViewChange} />
                            <Checkbox id="wireframe"  label="Wireframe"  checked={viewCfg.wireframe}  onChange={handleViewChange} />
                            <Checkbox id="colliders"  label="Colliders"  checked={viewCfg.colliders}  onChange={handleViewChange} />
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel className="text-white/50 text-[10px] uppercase tracking-widest px-3 py-2">
                            Scenery
                        </SidebarGroupLabel>
                        <SidebarGroupContent className="px-3 space-y-0.5">
                            <Checkbox id="scenery_back"   label="Back"   checked={viewCfg.scenery_back}   onChange={handleViewChange} />
                            <Checkbox id="scenery_middle" label="Middle" checked={viewCfg.scenery_middle} onChange={handleViewChange} />
                            <Checkbox id="scenery_front"  label="Front"  checked={viewCfg.scenery_front}  onChange={handleViewChange} />
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel className="text-white/50 text-[10px] uppercase tracking-widest px-3 py-2">
                            Spawns
                        </SidebarGroupLabel>
                        <SidebarGroupContent className="px-3 space-y-0.5">
                            <Checkbox id="objects" label="All" checked={viewCfg.objects_list.length === SPAWN_LABELS.length} onChange={handleViewChange} />
                            {SPAWN_LABELS.map((label, i) => (
                                <Checkbox key={i} id={`objects_idx_${i}`} label={label} checked={viewCfg.objects_list.includes(i)} onChange={handleViewChange} />
                            ))}
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel className="text-white/50 text-[10px] uppercase tracking-widest px-3 py-2">
                            Highlight polygons
                        </SidebarGroupLabel>
                        <SidebarGroupContent className="px-3 space-y-0.5">
                            <Checkbox id="highlight" label="All" checked={viewCfg.highlight_list.length === HIGHLIGHT_LABELS.length} onChange={handleViewChange} />
                            {HIGHLIGHT_LABELS.map((label, i) => (
                                <Checkbox key={i} id={`highlight_idx_${i}`} label={label} checked={viewCfg.highlight_list.includes(i)} onChange={handleViewChange} />
                            ))}
                        </SidebarGroupContent>
                    </SidebarGroup>

                </SidebarContent>
            </Sidebar>
        </SidebarProvider>
    );
};
