"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { X, Pencil, Eraser, PaintBucket, Pipette, Undo2, Redo2, Trash2, Download, FlipHorizontal2, Grid3x3 } from "lucide-react";

/**
 * Pixel Studio: a small pixel-art maker that runs entirely in the browser.
 * Nothing is uploaded; "Save PNG" turns the canvas into a file on the visitor's own device.
 */

type Tool = "pencil" | "eraser" | "fill" | "pick";
type Grid = (string | null)[]; // one hex color (or null = empty) per cell, row by row

const SIZES = [16, 24, 32] as const;
const CANVAS_PX = 512; // internal canvas resolution; CSS scales it down on small screens
const MAX_UNDO = 60;

const PALETTE = [
  "#0a0a0a", "#3d3d3d", "#7a7a7a", "#bdbdbd",
  "#ffffff", "#ff5d73", "#ff9f43", "#ffd43b",
  "#8ce99a", "#2ecc71", "#38bdf8", "#3b82f6",
  "#8b5cf6", "#ff6fb1", "#8b5a2b", "#fcd5b5",
];

const TOOLS: { id: Tool; label: string; key: string; Icon: typeof Pencil }[] = [
  { id: "pencil", label: "Pencil", key: "P", Icon: Pencil },
  { id: "eraser", label: "Eraser", key: "E", Icon: Eraser },
  { id: "fill", label: "Fill", key: "F", Icon: PaintBucket },
  { id: "pick", label: "Pick color", key: "I", Icon: Pipette },
];

const blank = (n: number): Grid => Array<string | null>(n * n).fill(null);

// a tiny smiley so the canvas is not empty the first time
function starter(n: number): Grid {
  const g = blank(n);
  const c = (n - 1) / 2;
  const r = n * 0.42;
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const d = Math.hypot(x - c, y - c);
      if (d <= r) g[y * n + x] = "#ffd43b";
      if (d <= r && d > r - 1.1) g[y * n + x] = "#0a0a0a";
    }
  }
  const t = Math.max(1, Math.floor(n / 12)); // line thickness: 1 cell on 16, 2 on 24 and 32
  const ex = Math.round(n * 0.33);
  const ey = Math.round(n * 0.34);
  for (let dy = 0; dy < t * 2; dy++) {
    for (let dx = 0; dx < t; dx++) {
      g[(ey + dy) * n + ex + dx] = "#0a0a0a";
      g[(ey + dy) * n + (n - 1 - ex - dx)] = "#0a0a0a";
    }
  }
  const mx = Math.round(n * 0.3);
  const my = Math.round(n * 0.64);
  for (let x = mx; x <= n - 1 - mx; x++) {
    const corner = x < mx + t || x > n - 1 - mx - t;
    for (let dy = 0; dy < t; dy++) g[(my + dy - (corner ? t : 0)) * n + x] = "#ff5d73";
  }
  return g;
}

export default function PixelStudio({ onClose }: { onClose: () => void }) {
  const [size, setSize] = useState<number>(16);
  const [grid, setGrid] = useState<Grid>(() => starter(16));
  const [tool, setTool] = useState<Tool>("pencil");
  const [color, setColor] = useState(PALETTE[13]);
  const [mirror, setMirror] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [name, setName] = useState("my-pixel-art");
  const [undoCount, setUndoCount] = useState(0);
  const [redoCount, setRedoCount] = useState(0);
  const [note, setNote] = useState("Draw something. Everything stays on your device.");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const live = useRef<Grid>(grid); // the grid while a stroke is in progress, so dragging stays smooth
  const undo = useRef<Grid[]>([]);
  const redo = useRef<Grid[]>([]);

  const syncCounts = () => {
    setUndoCount(undo.current.length);
    setRedoCount(redo.current.length);
  };

  // paint the grid onto the canvas
  useEffect(() => {
    const cv = canvasRef.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const cell = CANVAS_PX / size;
    ctx.clearRect(0, 0, CANVAS_PX, CANVAS_PX);
    // checkerboard behind empty cells so "transparent" is visible
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        ctx.fillStyle = (x + y) % 2 ? "#e4e4e4" : "#fafafa";
        ctx.fillRect(x * cell, y * cell, cell, cell);
        const c = grid[y * size + x];
        if (c) {
          ctx.fillStyle = c;
          ctx.fillRect(x * cell, y * cell, cell, cell);
        }
      }
    }
    if (showGrid) {
      ctx.strokeStyle = "rgba(0, 0, 0, 0.16)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 1; i < size; i++) {
        ctx.moveTo(i * cell + 0.5, 0);
        ctx.lineTo(i * cell + 0.5, CANVAS_PX);
        ctx.moveTo(0, i * cell + 0.5);
        ctx.lineTo(CANVAS_PX, i * cell + 0.5);
      }
      ctx.stroke();
    }
  }, [grid, size, showGrid]);

  const commitHistory = (before: Grid) => {
    undo.current = [...undo.current, before].slice(-MAX_UNDO);
    redo.current = [];
    syncCounts();
  };

  const cellAt = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * size);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * size);
    if (x < 0 || y < 0 || x >= size || y >= size) return null;
    return { x, y };
  };

  const paint = (g: Grid, x: number, y: number, value: string | null) => {
    g[y * size + x] = value;
    if (mirror) g[y * size + (size - 1 - x)] = value;
  };

  const floodFill = (g: Grid, x: number, y: number, value: string | null) => {
    const target = g[y * size + x];
    if (target === value) return;
    const stack = [[x, y]];
    while (stack.length) {
      const [cx, cy] = stack.pop()!;
      if (cx < 0 || cy < 0 || cx >= size || cy >= size || g[cy * size + cx] !== target) continue;
      g[cy * size + cx] = value;
      stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }
  };

  const apply = (x: number, y: number, first: boolean) => {
    const next = live.current.slice();
    if (tool === "pencil") paint(next, x, y, color);
    else if (tool === "eraser") paint(next, x, y, null);
    else if (tool === "fill") {
      if (!first) return;
      floodFill(next, x, y, color);
    } else {
      const picked = next[y * size + x];
      if (picked) {
        setColor(picked);
        setTool("pencil");
        setNote(`Picked ${picked}`);
      }
      return;
    }
    live.current = next;
    setGrid(next);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const p = cellAt(e);
    if (!p) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    live.current = grid;
    if (tool !== "pick") commitHistory(grid);
    apply(p.x, p.y, true);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || (tool !== "pencil" && tool !== "eraser")) return;
    const p = cellAt(e);
    if (p) apply(p.x, p.y, false);
  };
  const endStroke = () => {
    drawing.current = false;
  };

  const doUndo = useCallback(() => {
    const prev = undo.current.pop();
    if (!prev) return;
    redo.current.push(live.current);
    live.current = prev;
    setGrid(prev);
    syncCounts();
  }, []);
  const doRedo = useCallback(() => {
    const next = redo.current.pop();
    if (!next) return;
    undo.current.push(live.current);
    live.current = next;
    setGrid(next);
    syncCounts();
  }, []);

  const clearAll = () => {
    commitHistory(live.current);
    const g = blank(size);
    live.current = g;
    setGrid(g);
    setNote("Clean canvas. Go wild.");
  };

  const changeSize = (n: number) => {
    if (n === size) return;
    const g = blank(n);
    live.current = g;
    undo.current = [];
    redo.current = [];
    syncCounts();
    setSize(n);
    setGrid(g);
    setNote(`${n} × ${n} canvas ready.`);
  };

  // Save PNG: draw the cells (no grid lines, transparent background) at a big scale so it stays sharp
  const savePng = () => {
    const scale = Math.max(8, Math.floor(1024 / size));
    const out = document.createElement("canvas");
    out.width = out.height = size * scale;
    const ctx = out.getContext("2d");
    if (!ctx) return;
    grid.forEach((c, i) => {
      if (!c) return;
      ctx.fillStyle = c;
      ctx.fillRect((i % size) * scale, Math.floor(i / size) * scale, scale, scale);
    });
    out.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const safe = name.trim().replace(/[^\w-]+/g, "-").replace(/^-+|-+$/g, "") || "pixel-art";
      a.href = url;
      a.download = `${safe}.png`;
      a.click();
      URL.revokeObjectURL(url);
      setNote(`Saved ${safe}.png (${size * scale} × ${size * scale}).`);
    }, "image/png");
  };

  // keyboard shortcuts (not while typing the file name)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) doRedo();
        else doUndo();
      } else if (mod && e.key.toLowerCase() === "y") {
        e.preventDefault();
        doRedo();
      } else if (!mod) {
        const t = TOOLS.find((x) => x.key.toLowerCase() === e.key.toLowerCase());
        if (t) setTool(t.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [doUndo, doRedo]);

  const filled = grid.reduce((n, c) => n + (c ? 1 : 0), 0);

  return (
    <div className="px" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Pixel Studio">
      <header className="px-top">
        <span className="px-logo">
          <span className="px-logo-dot" aria-hidden /> PIXEL STUDIO
        </span>
        <button type="button" className="px-icon" onClick={onClose} aria-label="Close Pixel Studio">
          <X size={18} />
        </button>
      </header>

      <div className="px-body">
        <div className="px-stage">
          <canvas
            ref={canvasRef}
            className="px-canvas"
            width={CANVAS_PX}
            height={CANVAS_PX}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endStroke}
            onPointerCancel={endStroke}
            aria-label={`Drawing canvas, ${size} by ${size} pixels`}
          />
          <p className="px-note" aria-live="polite">{note}</p>
        </div>

        <aside className="px-side">
          <div className="px-group" role="toolbar" aria-label="Tools">
            {TOOLS.map(({ id, label, key, Icon }) => (
              <button
                key={id}
                type="button"
                className={`px-tool ${tool === id ? "active" : ""}`}
                onClick={() => setTool(id)}
                aria-pressed={tool === id}
                title={`${label} (${key})`}
              >
                <Icon size={17} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="px-group">
            <span className="px-label">Colors</span>
            <div className="px-palette">
              {PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`px-swatch ${color === c ? "active" : ""}`}
                  style={{ background: c }}
                  onClick={() => {
                    setColor(c);
                    if (tool === "eraser" || tool === "pick") setTool("pencil");
                  }}
                  aria-label={`Color ${c}`}
                  aria-pressed={color === c}
                />
              ))}
            </div>
            <label className="px-custom">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Pick any color" />
              <span>Any color · {color}</span>
            </label>
          </div>

          <div className="px-group">
            <span className="px-label">Canvas</span>
            <div className="px-sizes">
              {SIZES.map((n) => (
                <button key={n} type="button" className={`px-chip ${size === n ? "active" : ""}`} onClick={() => changeSize(n)}>
                  {n}×{n}
                </button>
              ))}
            </div>
            <div className="px-sizes">
              <button type="button" className={`px-chip ${mirror ? "active" : ""}`} onClick={() => setMirror((m) => !m)} aria-pressed={mirror}>
                <FlipHorizontal2 size={14} /> Mirror
              </button>
              <button type="button" className={`px-chip ${showGrid ? "active" : ""}`} onClick={() => setShowGrid((s) => !s)} aria-pressed={showGrid}>
                <Grid3x3 size={14} /> Grid
              </button>
            </div>
          </div>

          <div className="px-group px-actions">
            <button type="button" className="px-chip" onClick={doUndo} disabled={!undoCount} aria-label="Undo">
              <Undo2 size={14} /> Undo
            </button>
            <button type="button" className="px-chip" onClick={doRedo} disabled={!redoCount} aria-label="Redo">
              <Redo2 size={14} /> Redo
            </button>
            <button type="button" className="px-chip" onClick={clearAll} disabled={!filled} aria-label="Clear canvas">
              <Trash2 size={14} /> Clear
            </button>
          </div>

          <div className="px-save">
            <input className="px-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} aria-label="File name" />
            <button type="button" className="px-go" onClick={savePng} disabled={!filled}>
              <Download size={16} /> Save PNG
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
