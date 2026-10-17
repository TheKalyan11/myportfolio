"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ApplePayLogo, GooglePayLogo, PayPalLogo } from "@/components/PayLogos";
import { X, Volume2, VolumeX, ArrowUpDown, Delete } from "lucide-react";

/**
 * The Crazy Calculator: a joke mini-game that never gives the right answer.
 * Nothing is ever charged — the "$1" message is part of the joke and no payment details are asked for.
 */

type Op = "+" | "−" | "×" | "÷";

// Rows of four keys. The "=" key is tall (it spans the last two rows), so it appears once, in the fifth row.
const KEYS: string[] = [
  "C", "(", ")", "×",
  "√", "%", "±", "÷",
  "7", "8", "9", "−",
  "4", "5", "6", "+",
  "1", "2", "3", "=",
  ".", "0", "⌫",
];

const QUIPS = [
  "Math teachers hate this one trick!",
  "Calculated with 100% confidence and 0% accuracy.",
  "My abacus is crying right now.",
  "Trust me, I'm a calculator.",
  "Einstein just rolled over in his grave.",
  "Close enough! (It was not.)",
  "That answer was fresh out of the oven.",
  "Carrying the one... straight into the trash.",
  "Beep boop. Wrong, but with style.",
];

const isOp = (k: string): k is Op => k === "+" || k === "−" || k === "×" || k === "÷";
const digitsOf = (s: string) => s.replace(/\D/g, "");

// The ridiculous answer. + and × glue the numbers together, − fills with nines, ÷ gives pizza.
function crazyAnswer(a: string, op: Op, b: string): string {
  if (op === "+" || op === "×") return `${a}${b}`;
  if (op === "−") return "9".repeat(Math.max(1, digitsOf(a).length));
  return `${a}🍕${b}`;
}

export default function CrazyCalculator({ onClose }: { onClose: () => void }) {
  const [a, setA] = useState("");
  const [op, setOp] = useState<Op | null>(null);
  const [b, setB] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [quip, setQuip] = useState("Go on, ask me anything. I will lie.");
  const [pop, setPop] = useState(0); // bumps on every result so the display re-plays its wobble
  const [stage, setStage] = useState<"none" | "pay" | "joke">("none");
  const [sound, setSound] = useState(true);
  const [dark, setDark] = useState(false);
  const [shake, setShake] = useState(false);
  const audio = useRef<AudioContext | null>(null);

  // small synth sounds, created on the first click (browsers need a gesture first)
  const beep = useCallback(
    (freqs: number[], type: OscillatorType = "square", step = 0.09, gain = 0.07) => {
      if (!sound) return;
      try {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = (audio.current ??= new Ctx());
        const t0 = ctx.currentTime;
        freqs.forEach((f, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = type;
          o.frequency.setValueAtTime(f, t0 + i * step);
          g.gain.setValueAtTime(gain, t0 + i * step);
          g.gain.exponentialRampToValueAtTime(0.0001, t0 + i * step + step * 0.95);
          o.connect(g).connect(ctx.destination);
          o.start(t0 + i * step);
          o.stop(t0 + i * step + step);
        });
      } catch {
        /* no audio available, the jokes still work */
      }
    },
    [sound],
  );

  useEffect(() => () => void audio.current?.close().catch(() => {}), []);

  // the joke window and the "just kidding" notice each get a little sound
  useEffect(() => {
    if (stage === "joke") beep([523, 659, 784, 1047, 784, 1047], "triangle", 0.08, 0.08);
    if (stage === "pay") beep([988, 1319], "square", 0.12, 0.06); // cha-ching
  }, [stage, beep]);

  const tick = () => beep([480 + Math.random() * 360], "square", 0.07);
  const showResult = (expr: string, answer: string) => {
    setResult(answer);
    setStage("none");
    setPop((n) => n + 1);
    setHistory((h) => [...h, expr].slice(-3));
    setQuip(QUIPS[Math.floor(Math.random() * QUIPS.length)]);
    beep([392, 330, 262, 196], "sawtooth", 0.1, 0.07); // sad trombone
  };
  const wobble = (message: string) => {
    beep([140], "sawtooth", 0.18);
    setShake(true);
    window.setTimeout(() => setShake(false), 400);
    setQuip(message);
  };

  const clear = () => {
    setA("");
    setOp(null);
    setB("");
    setResult(null);
    setStage("none");
    setQuip("Fresh start. Fresh lies.");
  };

  // the number being typed right now (the second one after an operator, otherwise the first)
  const current = op ? b : a;
  const setCurrent = (v: string) => (op ? setB(v) : setA(v));

  const press = (k: string) => {
    if (k === "C") {
      beep([220, 165], "sawtooth", 0.1);
      return clear();
    }
    if (k === "(" || k === ")") {
      tick();
      setQuip(k === "(" ? "Brackets are for sandwiches. 🥪" : "Nice brackets. Sadly I only speak chaos.");
      return;
    }
    if (k === "=") {
      if (result !== null) return;
      if (!op || a === "" || b === "") return wobble("Type two numbers and an operator first, genius.");
      return showResult(`${a} ${op} ${b}`, crazyAnswer(a, op, b));
    }

    // after an answer, an operator carries on from what is on screen and anything else starts over
    if (result !== null) {
      tick();
      setStage("none");
      setResult(null);
      if (isOp(k)) {
        setA(digitsOf(result).slice(0, 10) || "0");
        setOp(k);
        setB("");
      } else if (k === "." || /\d/.test(k)) {
        setA(k === "." ? "0." : k);
        setOp(null);
        setB("");
      } else {
        clear();
      }
      return;
    }

    if (isOp(k)) {
      tick();
      if (a !== "") setOp(k);
      return;
    }
    if (k === "√" || k === "%") {
      if (current === "" || current === "-") return wobble("Give me a number first.");
      // the joke versions: a "square root" reverses the digits, a "percent" just adds more percent
      const answer = k === "√" ? `${[...current].reverse().join("")}√` : `${current}%%`;
      return showResult(`${k === "√" ? "√" : ""}${current}${k === "%" ? "%" : ""}`, answer);
    }
    if (k === "±") {
      tick();
      if (current !== "") setCurrent(current.startsWith("-") ? current.slice(1) : `-${current}`);
      return;
    }
    if (k === "⌫") {
      beep([300], "square", 0.06);
      if (current !== "") return setCurrent(current.slice(0, -1));
      if (op) setOp(null);
      return;
    }
    if (k === ".") {
      tick();
      if (current.includes(".")) return;
      return setCurrent(current === "" || current === "-" ? `${current}0.` : `${current}.`);
    }
    tick();
    if (digitsOf(current).length < 10) setCurrent(current === "0" ? k : current + k);
  };

  // keyboard support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, string> = { "*": "×", "/": "÷", "-": "−", Enter: "=", Backspace: "⌫", Delete: "C", c: "C" };
      const k = map[e.key] ?? e.key;
      if (KEYS.includes(k)) {
        e.preventDefault();
        press(k);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const expression = op ? `${a} ${op} ${b}` : a;

  return (
    <div className="crz" data-theme={dark ? "dark" : "light"} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Crazy Calculator">
      <div className="crz-top">
        <span className="crz-logo">CRAZY CALCULATOR</span>
        <div className="crz-top-actions">
          <button type="button" className="crz-icon" onClick={() => setSound((s) => !s)} aria-label={sound ? "Mute sounds" : "Turn sounds on"}>
            {sound ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <button type="button" className="crz-icon" onClick={onClose} aria-label="Close calculator">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className={`crz-screen ${shake ? "crz-shake" : ""}`}>
        <div className="crz-history" aria-hidden>
          {(result !== null ? history.slice(0, -1) : history).map((h, i) => (
            <div key={i}>{h}</div>
          ))}
        </div>
        <div className="crz-expr">{expression || " "}</div>
        <div key={pop} className={`crz-result ${result !== null ? "crz-pop" : ""}`}>
          <span className="crz-eq-sign">=</span> {result !== null ? result : "?"}
        </div>
      </div>

      <p className="crz-quip" aria-live="polite">{quip}</p>

      <div className="crz-toolbar">
        <label className="crz-switch">
          <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} />
          <span className="crz-track" aria-hidden />
          <span className="crz-switch-label">{dark ? "Switch to light theme" : "Switch to dark theme"}</span>
        </label>
        <button type="button" className="crz-key crz-flip" onClick={() => { setHistory([]); tick(); }} aria-label="Clear history">
          <ArrowUpDown size={18} />
        </button>
      </div>

      <div className="crz-keys">
        {KEYS.map((k) => {
          const kind = k === "=" ? "eq" : k === "C" ? "clr" : isOp(k) ? "op" : "()√%±".includes(k) ? "fn" : "num";
          return (
            <button key={k} type="button" className={`crz-key crz-${kind}`} onClick={() => press(k)} aria-label={k === "⌫" ? "Backspace" : undefined}>
              {k === "⌫" ? <Delete size={20} /> : k}
            </button>
          );
        })}
      </div>

      {result !== null && stage === "none" && (
        <button type="button" className="crz-real" onClick={() => setStage("pay")}>
          Show me the real answer
        </button>
      )}

      {stage === "pay" && (
        <div className="crz-pay-overlay" onClick={() => setStage("none")}>
          <div className="crz-pay" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Pay $1 (joke)">
            <button type="button" className="crz-icon crz-pay-close" onClick={() => setStage("none")} aria-label="Close">
              <X size={16} />
            </button>
            <strong className="crz-pay-title">Pay $1 to unlock the correct answer!</strong>
            <p className="crz-pay-sub">Choose how to pay</p>
            <div className="crz-pay-options">
              <button type="button" className="crz-pay-btn" onClick={() => setStage("joke")} aria-label="PayPal">
                <PayPalLogo />
              </button>
              <button type="button" className="crz-pay-btn" onClick={() => setStage("joke")} aria-label="Apple Pay">
                <ApplePayLogo />
              </button>
              <button type="button" className="crz-pay-btn" onClick={() => setStage("joke")} aria-label="Google Pay">
                <GooglePayLogo />
              </button>
            </div>
            <p className="crz-pay-fine">It&apos;s a joke. Nothing is charged and nothing is collected.</p>
          </div>
        </div>
      )}

      {stage === "joke" && (
        <div className="crz-joke-overlay" onClick={() => setStage("none")}>
          <div className="crz-joke" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Just kidding">
            <div className="crz-gif">
              <iframe
                src="https://giphy.com/embed/3oKIPjzfv0sI2p7fDW"
                title="Funny reaction GIF"
                loading="lazy"
                referrerPolicy="no-referrer"
                allowFullScreen
              />
            </div>
            <a className="crz-gif-credit" href="https://giphy.com/gifs/BaywatchMovie-comedy-the-rock-3oKIPjzfv0sI2p7fDW" target="_blank" rel="noopener noreferrer">
              via GIPHY
            </a>
            <p>
              <strong>Just kidding!</strong> No payment required. This is a crazy calculator, so you&apos;ll never get the correct answer here!
            </p>
            <button type="button" className="crz-real" onClick={() => setStage("none")}>
              Ha ha, OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
