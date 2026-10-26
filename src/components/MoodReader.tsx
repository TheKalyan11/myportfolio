"use client";

import React, { useMemo, useState } from "react";
import { X, Gauge } from "lucide-react";

/**
 * Mood Reader: sentiment analysis that runs in the browser.
 * It uses a small word list with scores (like the classic lexicon approach), flips a word's score after "not" and
 * strengthens it after words like "very". That is far simpler than an AI model, but it shows the idea and runs instantly.
 */

const LEXICON: Record<string, number> = {
  love: 3, loved: 3, great: 3, amazing: 4, awesome: 4, good: 2, happy: 3, excellent: 4, wonderful: 4, fantastic: 4,
  beautiful: 3, nice: 2, best: 3, brilliant: 4, enjoy: 2, enjoyed: 2, perfect: 4, fun: 2, smooth: 2, fast: 2,
  helpful: 2, clean: 2, easy: 2, excited: 3, proud: 3, win: 2, glad: 2, thanks: 1, thank: 1, super: 2, cool: 2,
  impressive: 3, delightful: 3, creative: 2, reliable: 2, like: 1,
  hate: -3, terrible: -4, awful: -4, bad: -2, sad: -3, angry: -3, worst: -4, horrible: -4, boring: -2, slow: -2,
  broken: -3, bug: -2, buggy: -2, ugly: -3, annoying: -3, poor: -2, fail: -3, failed: -3, disappointing: -3,
  useless: -3, hard: -1, confusing: -2, crash: -3, crashed: -3, stress: -2, tired: -1, lost: -2, problem: -2,
  painful: -3, rude: -3, scary: -2, messy: -2,
};
const NEGATIONS = new Set(["not", "never", "no", "dont", "don't", "isnt", "isn't", "wasnt", "wasn't", "cant", "can't", "didnt", "didn't", "hardly"]);
const BOOSTERS: Record<string, number> = { very: 1.5, really: 1.5, so: 1.4, extremely: 1.8, super: 1.5, totally: 1.4, absolutely: 1.6, slightly: 0.6, somewhat: 0.7, bit: 0.7 };

const PRESETS = [
  { label: "Happy", text: "I absolutely love this portfolio, the animations are amazing and everything feels smooth!" },
  { label: "Unhappy", text: "The page was slow and buggy, and the layout was confusing. Really disappointing." },
  { label: "Mixed", text: "The design is beautiful but the loading was slow, not a great experience overall." },
  { label: "Negation", text: "This is not bad at all, I am not disappointed." },
];

type Piece = { text: string; score: number; space: string };

function analyze(text: string) {
  const parts = text.match(/\S+\s*/g) ?? [];
  const pieces: Piece[] = [];
  let total = 0;
  let positive = 0;
  let negative = 0;
  const bare = (w: string) => w.toLowerCase().replace(/[^a-z']/g, "");
  parts.forEach((raw, i) => {
    const word = bare(raw);
    let score = LEXICON[word] ?? LEXICON[word.replace(/'/g, "")] ?? 0;
    if (score) {
      const prev = i > 0 ? bare(parts[i - 1]) : "";
      const prev2 = i > 1 ? bare(parts[i - 2]) : "";
      if (BOOSTERS[prev]) score *= BOOSTERS[prev];
      if (NEGATIONS.has(prev) || NEGATIONS.has(prev2)) score *= -0.8;
      if (/!/.test(raw)) score *= 1.2;
      total += score;
      if (score > 0) positive++;
      else negative++;
    }
    const trimmed = raw.trimEnd();
    pieces.push({ text: trimmed, score, space: raw.slice(trimmed.length) });
  });
  // squash the total into -1 .. 1 so long texts do not always max out
  const compound = total / Math.sqrt(total * total + 15);
  return { pieces, compound, positive, negative };
}

const labelFor = (c: number) =>
  c >= 0.6 ? "Very positive" : c >= 0.2 ? "Positive" : c > -0.2 ? "Neutral" : c > -0.6 ? "Negative" : "Very negative";
const faceFor = (c: number) => (c >= 0.6 ? "😄" : c >= 0.2 ? "🙂" : c > -0.2 ? "😐" : c > -0.6 ? "🙁" : "😠");

export default function MoodReader({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState(PRESETS[0].text);
  const result = useMemo(() => analyze(text), [text]);
  const angle = result.compound * 80; // needle: -80deg (negative) to +80deg (positive)

  return (
    <div className="lab" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Mood Reader">
      <header className="lab-top">
        <span className="lab-logo">
          <Gauge size={16} /> MOOD READER
        </span>
        <button type="button" className="lab-close" onClick={onClose} aria-label="Close Mood Reader">
          <X size={18} />
        </button>
      </header>

      <div className="lab-body">
        <p className="lab-lede">Write a sentence and see what mood it carries. This is sentiment analysis, the same idea behind review and feedback scoring.</p>

        <textarea className="lab-text" value={text} onChange={(e) => setText(e.target.value)} rows={3} maxLength={500} aria-label="Text to analyze" />
        <div className="lab-chips">
          {PRESETS.map((p) => (
            <button key={p.label} type="button" className="lab-chip" onClick={() => setText(p.text)}>
              {p.label}
            </button>
          ))}
        </div>

        <div className="lab-mood">
          <div className="lab-gauge" role="img" aria-label={`Mood: ${labelFor(result.compound)}`}>
            <svg viewBox="0 0 200 110">
              <defs>
                <linearGradient id="mood-grad" x1="0" x2="1">
                  <stop offset="0" stopColor="#e63b2e" />
                  <stop offset="0.5" stopColor="#f5b942" />
                  <stop offset="1" stopColor="#3aa17e" />
                </linearGradient>
              </defs>
              <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="url(#mood-grad)" strokeWidth="14" strokeLinecap="round" />
              <g className="lab-needle" style={{ transform: `rotate(${angle}deg)` }}>
                <path d="M100 100 L100 36" stroke="#0a0a0a" strokeWidth="4" strokeLinecap="round" />
                <circle cx="100" cy="100" r="8" fill="#0a0a0a" />
              </g>
            </svg>
          </div>
          <div className="lab-verdict">
            <span className="lab-face" aria-hidden>
              {faceFor(result.compound)}
            </span>
            <strong>{labelFor(result.compound)}</strong>
            <span>
              score {result.compound >= 0 ? "+" : ""}
              {result.compound.toFixed(2)} · {result.positive} positive, {result.negative} negative words
            </span>
          </div>
        </div>

        <p className="lab-words" aria-label="Words, coloured by mood">
          {result.pieces.map((p, i) => (
            <React.Fragment key={i}>
              <span className={p.score > 0 ? "lab-pos" : p.score < 0 ? "lab-neg" : undefined}>{p.text}</span>
              {p.space}
            </React.Fragment>
          ))}
        </p>
        <p className="lab-note">A small word-list method that runs in your browser. It understands &quot;not good&quot; and &quot;very good&quot;, but not sarcasm. Real AI models do much better.</p>
      </div>
    </div>
  );
}
