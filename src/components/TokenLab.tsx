"use client";

import React, { useMemo, useState } from "react";
import { X, Binary } from "lucide-react";

/**
 * Token Lab: shows how a language model reads text, as a row of tokens.
 * The splitting here is a simple approximation (words, numbers, punctuation, long words cut into pieces). Real tokenizers
 * such as the ones used by GPT or Claude differ in the details, but the idea, and why long text costs more, is the same.
 */

const PALETTE = ["#ffd9d0", "#d6ecff", "#e2f5d3", "#fff0b8", "#e6dcff", "#ffd8ec", "#cdf3ee", "#ffe3c2"];

const PRESETS = [
  { label: "Greeting", text: "Hello! I'm Kalyan, a Full Stack & AI Engineer from Hyderabad." },
  { label: "Code", text: "const answer = await fetch('/api/chat', { method: 'POST' });" },
  { label: "Long words", text: "Internationalization and misunderstanding are unexpectedly extraordinary words." },
  { label: "Numbers", text: "In 2026 the model handled 1250000 requests in 48 hours." },
];

function tokenize(text: string): string[] {
  const out: string[] = [];
  const re = /\s*[A-Za-z]+|\s*\d{1,3}|\s*[^\sA-Za-z\d]|\s+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const piece = m[0];
    const lead = piece.match(/^\s*/)![0];
    const core = piece.slice(lead.length);
    if (/^[A-Za-z]{8,}$/.test(core)) {
      // a long word is cut into pieces of up to 5 letters
      (core.match(/.{1,5}/g) ?? []).forEach((part, i) => out.push((i === 0 ? lead : "") + part));
    } else {
      out.push(piece);
    }
  }
  return out;
}

// a stable made-up number for each token, so "show IDs" looks like a real vocabulary lookup
const idOf = (t: string) => {
  let h = 2166136261;
  for (const ch of t) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return (h >>> 0) % 50000;
};

export default function TokenLab({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState(PRESETS[0].text);
  const [ids, setIds] = useState(false);
  const [price, setPrice] = useState(3);

  const tokens = useMemo(() => tokenize(text), [text]);
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const cost = (tokens.length / 1_000_000) * price;

  return (
    <div className="lab" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Token Lab">
      <header className="lab-top">
        <span className="lab-logo">
          <Binary size={16} /> TOKEN LAB
        </span>
        <button type="button" className="lab-close" onClick={onClose} aria-label="Close Token Lab">
          <X size={18} />
        </button>
      </header>

      <div className="lab-body">
        <p className="lab-lede">Models do not read letters or words. They read tokens. Type something and see how it is split.</p>

        <textarea className="lab-text" value={text} onChange={(e) => setText(e.target.value)} rows={3} maxLength={600} aria-label="Text to tokenize" />
        <div className="lab-chips">
          {PRESETS.map((p) => (
            <button key={p.label} type="button" className="lab-chip" onClick={() => setText(p.text)}>
              {p.label}
            </button>
          ))}
        </div>

        <div className="lab-stats">
          <div>
            <b>{tokens.length}</b>
            <span>tokens</span>
          </div>
          <div>
            <b>{words}</b>
            <span>words</span>
          </div>
          <div>
            <b>{text.length}</b>
            <span>characters</span>
          </div>
          <div>
            <b>{tokens.length ? (text.length / tokens.length).toFixed(1) : "0"}</b>
            <span>chars / token</span>
          </div>
        </div>

        <div className="lab-tokens" aria-label="Tokens">
          {tokens.map((t, i) => (
            <span key={i} className="lab-token" style={{ background: PALETTE[i % PALETTE.length] }}>
              <span>{t.replace(/^\s+/, (s) => "·".repeat(s.length)).replace(/\n/g, "↵") || "·"}</span>
              {ids && <em>{idOf(t)}</em>}
            </span>
          ))}
        </div>

        <div className="lab-row">
          <label className="lab-check">
            <input type="checkbox" checked={ids} onChange={(e) => setIds(e.target.checked)} /> Show token IDs
          </label>
          <label className="lab-price">
            Price per 1M tokens: $
            <input type="number" min={0} step={0.5} value={price} onChange={(e) => setPrice(Math.max(0, Number(e.target.value) || 0))} />
            <strong>≈ ${cost < 0.01 ? cost.toFixed(5) : cost.toFixed(3)}</strong>
          </label>
        </div>
        <p className="lab-note">The dots mark spaces. This is a simple approximation of tokenization; real tokenizers split text in slightly different places.</p>
      </div>
    </div>
  );
}
