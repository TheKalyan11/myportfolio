"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Send, Sparkles } from "lucide-react";
import { EMAIL, SOCIALS } from "@/data/contact";

/**
 * Ask Kalyan: a small assistant that answers questions about this portfolio.
 * It works like a tiny RAG pipeline that runs in the browser: the question is matched against a handful of facts
 * (retrieval), and the best matches are streamed back as the answer. No AI service is called and nothing is sent anywhere.
 */

type Fact = { id: string; title: string; keys: string[]; answer: string };

const GITHUB = SOCIALS.find((s) => s.label === "GitHub")?.href ?? "https://github.com";

const FACTS: Fact[] = [
  {
    id: "about",
    title: "About",
    keys: ["who", "kalyan", "about", "introduce", "yourself", "developer", "engineer", "person"],
    answer: "Kalyan is a Full Stack & AI Engineer based in Hyderabad, India. He builds scalable web and mobile apps, AI solutions and cloud systems on AWS.",
  },
  {
    id: "skills",
    title: "Skills",
    keys: ["skill", "skills", "stack", "tech", "technology", "technologies", "nextjs", "next", "react", "typescript", "javascript", "build", "use", "tools", "language"],
    answer: "The main stack is Next.js, React 19 and TypeScript on the front end, REST APIs and database design on the back end, Flutter for cross-platform mobile apps, and AWS (ECS, Lambda, S3, CloudFront) for the cloud.",
  },
  {
    id: "ai",
    title: "AI work",
    keys: ["ai", "llm", "llms", "rag", "agent", "agents", "generative", "genai", "automation", "gpt", "machine", "intelligent", "model"],
    answer: "On the AI side: generative AI and LLM applications, RAG pipelines and AI integrations, AI agents and workflow automation, built to be reliable in production and not just in a demo.",
  },
  {
    id: "projects",
    title: "Projects",
    keys: ["project", "projects", "portfolio", "built", "mesh", "annakoot", "movie365", "braj", "hkm", "baala", "example", "examples", "client", "clients"],
    answer: "Selected work includes Braj Nidhi, HKM Dehradun, Baala Media Works, MD Mesh, Annakoot and Movie365. Open the Selected Projects section to see each one.",
  },
  {
    id: "certs",
    title: "Certifications",
    keys: ["certificate", "certificates", "certification", "certifications", "certified", "aws", "flutter", "google", "microsoft", "course", "learning"],
    answer: "Certifications: Full-Stack Certified, a Full-Stack Web Development Program, Flutter Certified, AWS Certified, AI Certified from Google and a Generative AI Foundations Certificate from Microsoft.",
  },
  {
    id: "services",
    title: "Services",
    keys: ["service", "services", "offer", "help", "do", "hire", "shopify", "ecommerce", "ui", "ux", "design", "animation", "animations", "mobile", "web", "app", "apps"],
    answer: "Services: web development and CMS, mobile development, AI solutions and agents, animations and microinteractions, Shopify and ecommerce, and UI and UX design.",
  },
  {
    id: "opensource",
    title: "Open source",
    keys: ["open", "source", "contribute", "contributor", "contributions", "repo", "repository", "github", "code"],
    answer: `Kalyan is an open source contributor, and some projects (MD Mesh and Movie365) have public repositories. Everything is on GitHub: ${GITHUB}`,
  },
  {
    id: "contact",
    title: "Contact",
    keys: ["contact", "email", "mail", "reach", "talk", "message", "linkedin", "touch", "connect", "available", "freelance"],
    answer: `The easiest way is email: ${EMAIL}. There is also a contact form at the bottom of this page.`,
  },
  {
    id: "location",
    title: "Location",
    keys: ["where", "location", "based", "live", "city", "hyderabad", "india", "timezone", "time", "country"],
    answer: "Kalyan is based in Hyderabad, India, on Indian Standard Time (IST), and works with clients remotely.",
  },
];

const SUGGESTIONS = ["What can you build?", "Tell me about the AI work", "Which certificates are there?", "How can I contact Kalyan?"];

const STOP = new Set(["the", "a", "an", "is", "are", "of", "to", "me", "you", "your", "can", "what", "which", "how", "tell", "about", "does", "have", "has", "his", "he", "and", "for", "in", "on", "with", "any"]);

// Retrieval: count how many words of the question match each fact's keywords, and keep the best two.
function retrieve(question: string): { fact: Fact; hits: number }[] {
  const words = question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !STOP.has(w));
  return FACTS.map((fact) => ({ fact, hits: words.filter((w) => fact.keys.includes(w)).length }))
    .filter((r) => r.hits > 0)
    .sort((a, b) => b.hits - a.hits)
    .slice(0, 2);
}

type Message = { role: "user" | "bot"; text: string; sources?: { title: string; hits: number }[]; done?: boolean };

export default function AiAssistant({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hi, I'm the Kalyan assistant. Ask me about his skills, projects, AI work or how to get in touch.", done: true },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const timer = useRef<number | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => () => void (timer.current && window.clearInterval(timer.current)), []);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  const ask = (raw: string) => {
    const question = raw.trim();
    if (!question || busy) return;
    setInput("");
    setBusy(true);
    const found = retrieve(question);
    const answer = found.length
      ? found.map((f) => f.fact.answer).join(" ")
      : "I only know about Kalyan's work, so try asking about his skills, projects, AI work, certificates or contact details.";
    const sources = found.map((f) => ({ title: f.fact.title, hits: f.hits }));
    setMessages((m) => [...m, { role: "user", text: question }, { role: "bot", text: "", sources }]);

    // stream the answer a few characters at a time, like a model would
    let shown = 0;
    timer.current = window.setInterval(() => {
      shown = Math.min(answer.length, shown + 3);
      setMessages((m) => {
        const copy = m.slice();
        copy[copy.length - 1] = { role: "bot", text: answer.slice(0, shown), sources, done: shown >= answer.length };
        return copy;
      });
      if (shown >= answer.length) {
        if (timer.current) window.clearInterval(timer.current);
        setBusy(false);
      }
    }, 22);
  };

  return (
    <div className="lab" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Ask Kalyan, an assistant">
      <header className="lab-top">
        <span className="lab-logo">
          <Sparkles size={16} /> ASK KALYAN
        </span>
        <button type="button" className="lab-close" onClick={onClose} aria-label="Close assistant">
          <X size={18} />
        </button>
      </header>

      <div className="lab-body lab-chat">
        <div className="lab-msgs" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`lab-msg lab-msg-${m.role}`}>
              {m.role === "bot" && m.sources && m.sources.length > 0 && (
                <div className="lab-sources">
                  <span>Retrieved</span>
                  {m.sources.map((s) => (
                    <b key={s.title}>
                      {s.title} · {s.hits} {s.hits === 1 ? "match" : "matches"}
                    </b>
                  ))}
                </div>
              )}
              <p>
                {m.text}
                {m.role === "bot" && !m.done && <i className="lab-caret" />}
              </p>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="lab-chips">
          {SUGGESTIONS.map((s) => (
            <button key={s} type="button" className="lab-chip" onClick={() => ask(s)} disabled={busy}>
              {s}
            </button>
          ))}
        </div>

        <form
          className="lab-form"
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
        >
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about skills, projects, AI, contact…" aria-label="Your question" maxLength={160} />
          <button type="submit" className="lab-go" disabled={busy || !input.trim()} aria-label="Send">
            <Send size={16} />
          </button>
        </form>
        <p className="lab-note">A small assistant that runs in your browser. It matches your question against facts about Kalyan; no AI service is called and nothing is sent anywhere.</p>
      </div>
    </div>
  );
}
