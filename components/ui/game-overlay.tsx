"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ── Types ─────────────────────────────────────────────────────────────── */
type Health    = 0 | 1 | 2;
type FelixAnim = "idle" | "walking_right" | "walking_left" | "fixing";
type GamePhase = "playing" | "won" | "lost";

interface WinCell { row: number; col: number; health: Health; }

/* ── Constants ─────────────────────────────────────────────────────────── */
const ROWS          = 4;
const COLS          = 5;
const RALPH_MS      = 1000;  // ralph moves every 1000 ms

/* ── Sprite paths ──────────────────────────────────────────────────────── */
const G = {
  bg:         "/game/background.png",
  top:        "/game/top.png",
  bottom:     "/game/bottom.png",
  winNew:     "/game/new.png",
  winBroken:  "/game/broken.png",
  winOver:    "/game/over.png",
  ralph:      "/game/ralph.png",
  ralphWreck: "/game/ralph-wrecking.png",
  felix:      "/game/felix.png",
  felixFix:   "/game/felix_fixing.png",
  felixRight: "/game/felix_walking_right.png",
  felixLeft:  "/game/felix_walking_left.png",
};

/* ── Helpers ───────────────────────────────────────────────────────────── */
function initWindows(): WinCell[] {
  const out: WinCell[] = [];
  for (let row = 0; row < ROWS; row++)
    for (let col = 0; col < COLS; col++)
      out.push({ row, col, health: 2 });
  return out;
}

function calcPoints(windows: WinCell[]) {
  return (windows.reduce((s, w) => s + w.health, 0) - 15) * 100;
}

function winImg(health: Health) {
  if (health === 2) return G.winNew;
  if (health === 1) return G.winBroken;
  return G.winOver;
}

function felixImg(anim: FelixAnim) {
  if (anim === "walking_right") return G.felixRight;
  if (anim === "walking_left")  return G.felixLeft;
  if (anim === "fixing")        return G.felixFix;
  return G.felix;
}

/* ── Component ─────────────────────────────────────────────────────────── */
interface Props {
  url: string;
  isPublishing?: boolean;
  buildSeconds?: number;
  onComplete: () => void;
}

export function GameOverlay({ url, isPublishing = false, buildSeconds = 15, onComplete }: Props) {
  /* -- Game state -- */
  const [windows,      setWindows]      = useState<WinCell[]>(initWindows);
  const [ralphCol,     setRalphCol]     = useState(2);
  const [ralphWreck,   setRalphWreck]   = useState(false);
  const [felixRow,     setFelixRow]     = useState(0);
  const [felixCol,     setFelixCol]     = useState(0);
  const [felixAnim,    setFelixAnim]    = useState<FelixAnim>("idle");
  const [gamePhase,    setGamePhase]    = useState<GamePhase>("playing");

  /* -- Build progress -- */
  const [buildElapsed, setBuildElapsed] = useState(0);
  const buildDone = buildElapsed >= buildSeconds && !isPublishing;
  const buildPct  = Math.min(isPublishing ? 99 : 100, Math.round((buildElapsed / buildSeconds) * 100));
  
  const BUILD_STEPS = [
    { label: "Design wird angewendet…",             at: 0 },
    { label: "Seitenstruktur wird aufgebaut…",      at: Math.floor(buildSeconds * 0.25) },
    { label: "Bilder werden platziert…",            at: Math.floor(buildSeconds * 0.5) },
    { label: "Letzte Details werden verfeinert…",   at: Math.floor(buildSeconds * 0.75) },
    { label: "Neue Website ist fast fertig!",       at: buildSeconds - 1 },
  ];
  
  const stepLabel = [...BUILD_STEPS].reverse().find(s => buildElapsed >= s.at)?.label ?? BUILD_STEPS[0].label;

  /* -- Refs to avoid stale closures in intervals/listeners -- */
  const felixRowRef  = useRef(0);
  const felixColRef  = useRef(0);
  const phaseRef     = useRef<GamePhase>("playing");

  useEffect(() => { felixRowRef.current = felixRow; }, [felixRow]);
  useEffect(() => { felixColRef.current = felixCol; }, [felixCol]);
  useEffect(() => { phaseRef.current    = gamePhase; }, [gamePhase]);

  const points = calcPoints(windows);

  /* -- Build progress timer -- */
  useEffect(() => {
    if (buildDone) return;
    const id = setInterval(() => {
      setBuildElapsed(p => {
        if (p >= buildSeconds && isPublishing) return p;
        return Math.min(buildSeconds, p + 1);
      });
    }, 1000);
    return () => clearInterval(id);
  }, [buildDone, buildSeconds, isPublishing]);

  /* -- Lose condition -- */
  useEffect(() => {
    if (points <= 0 && gamePhase === "playing") setGamePhase("lost");
  }, [points, gamePhase]);

  /* -- Ralph movement + damage (nested functional updaters to avoid staleness) -- */
  useEffect(() => {
    if (gamePhase !== "playing") return;
    const id = setInterval(() => {
      setRalphCol(prev => {
        const dir  = Math.random() < 0.5 ? -1 : 1;
        let next   = prev + dir;
        if (next < 0)     next = 1;
        if (next >= COLS) next = COLS - 2;

        setWindows(ws => {
          const targets = ws.filter(w => w.col === next && w.health > 0);
          if (!targets.length) return ws;
          const t = targets[Math.floor(Math.random() * targets.length)];
          return ws.map(w =>
            w.row === t.row && w.col === t.col
              ? { ...w, health: Math.max(0, w.health - 1) as Health }
              : w
          );
        });

        setRalphWreck(true);
        setTimeout(() => setRalphWreck(false), 380);
        return next;
      });
    }, RALPH_MS);
    return () => clearInterval(id);
  }, [gamePhase]);

  /* -- Felix animation reset helper -- */
  const resetAnim = useCallback(() => {
    const t = setTimeout(() => setFelixAnim("idle"), 320);
    return () => clearTimeout(t);
  }, []);

  /* -- Fix action (shared between keyboard + touch) -- */
  const doFix = useCallback(() => {
    const r = felixRowRef.current;
    const c = felixColRef.current;
    setWindows(ws => ws.map(w =>
      w.row === r && w.col === c && w.health < 2
        ? { ...w, health: Math.min(2, w.health + 1) as Health } : w
    ));
    setFelixAnim("fixing");
    resetAnim();
  }, [resetAnim]);

  /* -- Move felix -- */
  const moveFelix = useCallback((dir: "up" | "down" | "left" | "right") => {
    if (dir === "up")    setFelixRow(r => { const n = Math.max(0, r - 1);        felixRowRef.current = n; return n; });
    if (dir === "down")  setFelixRow(r => { const n = Math.min(ROWS-1, r + 1);   felixRowRef.current = n; return n; });
    if (dir === "left")  setFelixCol(c => { const n = Math.max(0, c - 1);        felixColRef.current = n; return n; });
    if (dir === "right") setFelixCol(c => { const n = Math.min(COLS-1, c + 1);   felixColRef.current = n; return n; });
    setFelixAnim(dir === "left" ? "walking_left" : "walking_right");
    resetAnim();
  }, [resetAnim]);

  /* -- Keyboard handler -- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phaseRef.current !== "playing") return;
      switch (e.code) {
        case "KeyW": case "ArrowUp":    e.preventDefault(); moveFelix("up");    break;
        case "KeyS": case "ArrowDown":  e.preventDefault(); moveFelix("down");  break;
        case "KeyA": case "ArrowLeft":  e.preventDefault(); moveFelix("left");  break;
        case "KeyD": case "ArrowRight": e.preventDefault(); moveFelix("right"); break;
        case "KeyF": case "Space":      e.preventDefault(); doFix();            break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moveFelix, doFix]);

  const restart = useCallback(() => {
    setWindows(initWindows());
    setRalphCol(2);
    setFelixRow(0); felixRowRef.current = 0;
    setFelixCol(0); felixColRef.current = 0;
    setFelixAnim("idle");
    setGamePhase("playing");
  }, []);

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/88 backdrop-blur-lg p-4 gap-3" tabIndex={-1}>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-white font-extrabold text-lg tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          Felix braucht deine Hilfe!
        </p>
        <p className="text-white/50 text-sm mt-0.5">
          Repariere die Fenster, während wir deine Website bauen.
        </p>
      </motion.div>

      {/* Progress bar */}
      <div className="w-full max-w-[440px] bg-white/8 border border-white/10 rounded-2xl px-5 py-4">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-white/75 text-sm font-medium">{stepLabel}</span>
          <span className="text-white/40 text-xs font-mono tabular-nums">{buildPct}%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full origin-left"
            style={{ background: "var(--color-brand-green)" }}
            animate={{ width: `${buildPct}%` }}
            transition={{ duration: 1.1, ease: "linear" }}
          />
        </div>
      </div>

      {/* Game board */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-[440px] rounded-2xl overflow-hidden border-[3px] border-black shadow-2xl"
        style={{ background: `url(${G.bg}) bottom center #6ea5e5 repeat-x`, backgroundSize: "cover" }}
      >
        {/* Stats */}
        <div className="absolute top-2 left-3 z-20 text-white text-xs font-bold drop-shadow-lg leading-5">
          <div>Punkte: {Math.max(0, points)}</div>
        </div>

        <div style={{ maxWidth: 400, margin: "0 auto" }}>

          {/* Ralph row */}
          <div className="flex" style={{ height: 90 }}>
            {Array.from({ length: COLS }, (_, col) => (
              <div key={col} className="flex-1 flex items-end justify-center">
                {ralphCol === col && (
                  <img
                    src={ralphWreck ? G.ralphWreck : G.ralph}
                    alt=""
                    draggable={false}
                    style={{ width: "85%", height: "88px", objectFit: "contain", objectPosition: "bottom" }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Building top cap */}
          <div style={{
            height: 60,
            background: `url(${G.top}) center center no-repeat`,
            backgroundSize: "103%",
          }} />

          {/* Windows grid */}
          {Array.from({ length: ROWS }, (_, row) => (
            <div key={row} className="flex">
              {Array.from({ length: COLS }, (_, col) => {
                const win     = windows.find(w => w.row === row && w.col === col)!;
                const isFelix = felixRow === row && felixCol === col;
                return (
                  <div
                    key={col}
                    className="flex-1 relative"
                    style={{
                      height: 80,
                      background: `url(${winImg(win.health)}) center center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  >
                    {isFelix && (
                      <img
                        src={felixImg(felixAnim)}
                        alt="Felix"
                        draggable={false}
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: "50%",
                          transform: "translateX(-50%)",
                          height: 72,
                          width: "auto",
                          zIndex: 10,
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Building bottom cap */}
          <div style={{
            height: 50,
            background: `url(${G.bottom}) bottom center no-repeat`,
            backgroundSize: "99%",
          }} />
        </div>

        {/* Game over / you win panel */}
        <AnimatePresence>
          {gamePhase !== "playing" && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-30"
              style={{ background: "rgba(0,0,0,0.72)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              <p
                className="text-white text-2xl font-extrabold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {gamePhase === "won" ? "Geschafft!" : "Nicht geschafft!"}
              </p>
              <button
                onClick={restart}
                className="px-6 py-3 text-white font-semibold rounded-xl transition-colors"
                style={{ background: "var(--color-brand-green)" }}
              >
                Nochmal spielen
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Controls hint */}
      <p className="text-white/35 text-xs tracking-wide hidden md:block">
        WASD&nbsp;/&nbsp;↑↓←→&nbsp;&nbsp;bewegen&nbsp;&nbsp;·&nbsp;&nbsp;F&nbsp;oder&nbsp;Leertaste&nbsp;&nbsp;reparieren
      </p>

      {/* Mobile D-pad */}
      <div className="flex items-center gap-5 md:hidden">
        <div className="grid grid-cols-3 gap-1.5">
          {/* up */}
          <div />
          <button
            onPointerDown={() => moveFelix("up")}
            className="w-12 h-12 rounded-xl text-white text-lg font-bold flex items-center justify-center active:opacity-70"
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)" }}
          >↑</button>
          <div />
          {/* left / down / right */}
          <button
            onPointerDown={() => moveFelix("left")}
            className="w-12 h-12 rounded-xl text-white text-lg font-bold flex items-center justify-center active:opacity-70"
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)" }}
          >←</button>
          <button
            onPointerDown={() => moveFelix("down")}
            className="w-12 h-12 rounded-xl text-white text-lg font-bold flex items-center justify-center active:opacity-70"
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)" }}
          >↓</button>
          <button
            onPointerDown={() => moveFelix("right")}
            className="w-12 h-12 rounded-xl text-white text-lg font-bold flex items-center justify-center active:opacity-70"
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)" }}
          >→</button>
        </div>
        {/* Fix button */}
        <button
          onPointerDown={doFix}
          className="w-16 h-16 rounded-2xl text-white font-extrabold text-xl flex items-center justify-center active:opacity-70"
          style={{ background: "var(--color-brand-green)" }}
          title="Reparieren (F)"
        >
          🔨
        </button>
      </div>

      {/* ── Build-complete modal ── */}
      <AnimatePresence>
        {buildDone && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-[300]"
            style={{ background: "rgba(0,0,0,0.88)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="text-center flex flex-col items-center gap-5 max-w-sm px-6"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 280, damping: 24 }}
            >
              <div className="text-5xl">🏗️</div>
              <div>
                <h2
                  className="text-white text-2xl font-extrabold mb-1.5"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Deine Website ist fertig!
                </h2>
                <p className="text-white/50 text-sm break-all">{url}</p>
              </div>
              <button
                onClick={onComplete}
                className="px-8 py-4 text-white font-bold text-base rounded-xl transition-colors"
                style={{ background: "var(--color-brand-green)", fontFamily: "var(--font-display)" }}
              >
                Zur neuen Website →
              </button>
              <button
                onClick={onComplete}
                className="text-white/35 text-sm underline underline-offset-4 hover:text-white/60 transition-colors"
              >
                Schließen
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
