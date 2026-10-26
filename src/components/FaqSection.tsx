"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { EMAIL } from "@/data/contact";

// Edit the questions and answers freely.
const FAQS = [
  {
    q: "What do you build?",
    a: "Websites and web apps, mobile apps, AI features and agents, Shopify and ecommerce stores, animations and microinteractions, and the UI and UX design behind them. Most projects mix several of these.",
  },
  {
    q: "Can you work on a project that already exists?",
    a: "Yes. I can pick up an existing codebase, read it first, then fix, improve or extend it. You do not need to start from scratch.",
  },
  {
    q: "Do you build AI features?",
    a: "Yes: generative AI and LLM apps, RAG pipelines that use your own data, AI agents and workflow automation. I start with the smallest version that proves its value, then make it reliable.",
  },
  {
    q: "Which technologies do you use?",
    a: "Next.js, React and TypeScript for the web, Flutter for cross-platform mobile apps, REST APIs and databases for the back end, and AWS for the cloud. I choose what fits the project rather than what is fashionable.",
  },
  {
    q: "Can you work with clients in other countries?",
    a: "Yes. I am based in Hyderabad, India (IST) and work remotely with clients anywhere.",
  },
  {
    q: "How do we start?",
    a: `Send a short message about what you want to build, by the contact form below or at ${EMAIL}. I will reply with questions and the next steps.`,
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="fq" aria-labelledby="fq-heading">
      <p className="pr-kicker">(FAQ)</p>
      <h2 id="fq-heading" className="pr-heading">
        Questions, answered
      </h2>

      <ul className="fq-list">
        {FAQS.map((item, i) => {
          const isOpen = open === i;
          return (
            <li key={item.q} className="fq-item" data-open={isOpen}>
              <h3>
                <button
                  type="button"
                  className="fq-q"
                  aria-expanded={isOpen}
                  aria-controls={`fq-a-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span>{item.q}</span>
                  <Plus size={22} className="fq-plus" aria-hidden />
                </button>
              </h3>
              <div id={`fq-a-${i}`} className="fq-a" role="region">
                <p>{item.a}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
