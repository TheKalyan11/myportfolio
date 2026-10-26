"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpRight, GitFork, Star } from "lucide-react";
import { SOCIALS } from "@/data/contact";

/**
 * Open source: the latest public repositories from the GitHub profile, loaded live from GitHub's public API
 * when the visitor opens the page (no key needed). If GitHub cannot be reached, a link to the profile is shown instead.
 */

const PROFILE = SOCIALS.find((s) => s.label === "GitHub")?.href ?? "https://github.com";
const USER = PROFILE.replace(/\/+$/, "").split("/").pop() ?? "";
const CACHE_KEY = "kalyan-github-repos-v1";

type Repo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
};

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", PHP: "#4f5d95", Python: "#3572a5", HTML: "#e34c26", CSS: "#563d7c",
  Dart: "#00b4ab", Java: "#b07219", Go: "#00add8", Rust: "#dea584", Shell: "#89e051", Kotlin: "#a97bff", Vue: "#41b883",
};

const ago = (iso: string) => {
  const days = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 86_400_000));
  if (days < 1) return "today";
  if (days < 31) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.round(months / 12);
  return `${years} year${years === 1 ? "" : "s"} ago`;
};

export default function OpenSourceSection() {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    const show = (list: Repo[]) =>
      setRepos(
        list
          .filter((r) => !r.archived && r.name.toLowerCase() !== USER.toLowerCase()) // the profile README repository is not a project
          .sort((a, b) => Number(a.fork) - Number(b.fork) || +new Date(b.pushed_at) - +new Date(a.pushed_at))
          .slice(0, 6),
      );
    // GitHub allows only a few anonymous requests an hour per visitor, so the answer is kept for the browser session
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        show(JSON.parse(cached));
        return;
      }
    } catch {
      /* storage can be blocked; just fetch */
    }
    fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`, { signal: ctrl.signal, headers: { Accept: "application/vnd.github+json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((list: Repo[]) => {
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(list));
        } catch {
          /* ignore */
        }
        show(list);
      })
      .catch((e) => {
        if (e?.name !== "AbortError") setFailed(true);
      });
    return () => ctrl.abort();
  }, []);

  return (
    <section id="open-source" className="os" aria-labelledby="os-heading">
      <p className="pr-kicker">(OPEN SOURCE)</p>
      <h2 id="os-heading" className="pr-heading">
        Open source
      </h2>
      <p className="os-lede">I contribute to open source. These are my latest public repositories, loaded live from GitHub.</p>

      {repos && repos.length > 0 && (
        <ul className="os-grid">
          {repos.map((r) => (
            <li key={r.id}>
              <a className="os-card" href={r.html_url} target="_blank" rel="noopener noreferrer">
                <span className="os-name">
                  {r.name}
                  {r.fork && <em>fork</em>}
                  <ArrowUpRight size={18} className="os-arrow" aria-hidden />
                </span>
                <span className="os-desc">{r.description}</span>
                <span className="os-meta">
                  {r.language && (
                    <span className="os-lang">
                      <i style={{ background: LANG_COLORS[r.language] ?? "#8a8a8a" }} />
                      {r.language}
                    </span>
                  )}
                  <span title="Stars">
                    <Star size={14} /> {r.stargazers_count}
                  </span>
                  <span title="Forks">
                    <GitFork size={14} /> {r.forks_count}
                  </span>
                  <span className="os-when">Updated {ago(r.pushed_at)}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}

      {!repos && !failed && (
        <ul className="os-grid" aria-hidden>
          {[0, 1, 2].map((i) => (
            <li key={i} className="os-card os-skeleton">
              <span />
              <span />
              <span />
            </li>
          ))}
        </ul>
      )}

      {(failed || (repos && repos.length === 0)) && <p className="os-lede">The repositories could not be loaded right now. You can see them all on GitHub.</p>}

      <a className="cs-link" href={PROFILE} target="_blank" rel="noopener noreferrer">
        See everything on GitHub <ArrowUpRight size={16} />
      </a>
    </section>
  );
}
