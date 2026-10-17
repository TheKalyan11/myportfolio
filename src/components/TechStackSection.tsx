"use client";

import React, { useEffect, useRef } from "react";
import { Boxes, BrainCircuit, LayoutTemplate, ScanSearch, Smartphone, type LucideIcon } from "lucide-react";
import { prefersReducedMotion } from "@/lib/motion";
import {
  siHtml5,
  siCss,
  siJavascript,
  siTypescript,
  siReact,
  siNextdotjs,
  siTailwindcss,
  siVite,
  siSass,
  siFlutter,
  siDart,
  siFigma,
  siGsap,
  siFramer,
  siLottiefiles,
  siNodedotjs,
  siExpress,
  siPhp,
  siLaravel,
  siGraphql,
  siPrisma,
  siMysql,
  siPostgresql,
  siMongodb,
  siRedis,
  siFirebase,
  siSupabase,
  siHostinger,
  siCpanel,
  siNginx,
  siLinux,
  siVercel,
  siCloudflare,
  siDigitalocean,
  siGooglecloud,
  siShopify,
  siWordpress,
  siWoocommerce,
  siStrapi,
  siStripe,
  siRazorpay,
  siGit,
  siGithub,
  siGithubactions,
  siDocker,
  siPostman,
  siNpm,
  siClaude,
  siGooglegemini,
  siGithubcopilot,
  siCursor,
  siPerplexity,
  siLangchain,
  siHuggingface,
  siOllama,
  siPython,
  siFastapi,
  siQdrant,
  siPaytm,
  siPhonepe,
  siWise,
  siPaypal,
  siClaudecode,
  siReplit,
  siV0,
} from "simple-icons";

type BrandIcon = { title: string; path: string; hex: string; evenodd?: boolean; viewBox?: string };

// Logos that are not in the Simple Icons set come from the MIT-licensed @lobehub/icons-static-svg pack.
// OpenAI is a single-colour mark, so its path is used directly; Antigravity is a full-colour logo, so it
// is served as a file from /public/logos.
const OPENAI: BrandIcon = {
  title: "OpenAI",
  hex: "0A0A0A",
  evenodd: true,
  path: "M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z",
};

// PayU comes from the MIT-licensed Fontisto set (via Iconify). It is a card shape with the PayU wordmark cut
// out, so it is wider than the 24x24 icons, and drawn in PayU's green.
const PAYU: BrandIcon = {
  title: "PayU",
  hex: "A6C300",
  viewBox: "0 0 36 24",
  path: "M33.6 24H2.4A2.4 2.4 0 0 1 0 21.6V2.4A2.4 2.4 0 0 1 2.4 0h31.2A2.4 2.4 0 0 1 36 2.4v19.2a2.4 2.4 0 0 1-2.4 2.4m-15.159-6.408c-.33 1.04-.672 1.55-1.72 1.658c-.209.018-.344.047-.42.148a.48.48 0 0 0-.031.394l-.001-.003l.028.127c.062.294.166.48.497.48q.052.001.112-.006c1.536-.1 2.358-.926 2.84-2.854l1.642-6.576a.54.54 0 0 0-.029-.456l.001.003a.54.54 0 0 0-.435-.128h.003h-.129a.583.583 0 0 0-.688.54v.002l-1.185 4.927c-.149.606-.356.72-.711.72c-.436 0-.61-.104-.784-.72l-1.342-4.927a.6.6 0 0 0-.706-.538l.004-.001h-.114a.53.53 0 0 0-.432.131a.53.53 0 0 0-.012.46l-.001-.003l1.36 4.97c.254.951.56 1.739 1.687 1.739h.031q.288 0 .549-.084l-.013.004zm-6.938-4.32c-2.05 0-3.005.692-3.005 2.177c0 1.44.986 2.233 2.776 2.233c2.127 0 3.076-.724 3.076-2.348v-2.829c0-1.57-1.011-2.334-3.09-2.334h-.072a8 8 0 0 0-1.527.151l.049-.008c-.361.08-.512.176-.512.577v.114a.63.63 0 0 0 .074.346l-.002-.003a.31.31 0 0 0 .257.135l.023-.001h-.001a1 1 0 0 0 .225-.034l-.006.002c.46-.098.988-.154 1.529-.154h.021h-.001c1.264 0 1.78.35 1.78 1.209v.766zm12.005-5.178c-.855 0-1.213.132-1.213.95v4.983a3.7 3.7 0 0 0 .539 2.044l-.009-.016c.677 1.062 2 1.624 3.84 1.624s3.175-.56 3.852-1.624a3.67 3.67 0 0 0 .529-2.033v.006v-3.84h.995a.386.386 0 0 0 .386-.386V7.821a.386.386 0 0 0-.386-.386h-1.957a.387.387 0 0 0-.386.387v.273h-.142c-.855 0-1.213.132-1.213.95v4.983a1.37 1.37 0 0 1-.194.782l.004-.006c-.24.367-.709.539-1.481.541s-1.242-.174-1.481-.541a1.4 1.4 0 0 1-.192-.709l.002-.07v.003V9.04c0-.818-.358-.95-1.212-.95zm-20.274 0c-1.13-.003-1.634.501-1.634 1.63v7.255c0 .437.14.577.577.577h.143c.437 0 .577-.14.577-.577V14.16h2.45c2.176 0 3.19-.96 3.19-3.034S7.52 8.091 5.347 8.091zM32.72 5.39a.287.287 0 0 0-.287.286v1.472c0 .158.129.287.287.287h1.454a.286.286 0 0 0 .286-.286V5.68a.29.29 0 0 0-.287-.287zM31.245 4a.195.195 0 0 0-.195.195v.999c0 .108.087.195.194.195h.987a.195.195 0 0 0 .195-.195v-.999A.194.194 0 0 0 32.232 4zM11.259 16.57c-1.015 0-1.508-.367-1.508-1.12c0-.83.495-1.153 1.766-1.153h1.58v.995c-.001.808-.298 1.278-1.838 1.278m-5.912-3.623H2.896V9.896c0-.423.16-.58.58-.58h1.871c1.2 0 1.894.296 1.894 1.809c0 1.182-.302 1.822-1.894 1.822",
};

// Google AI Studio comes from the same MIT-licensed pack as OpenAI (two shapes joined into one path), in Google blue.
const AI_STUDIO: BrandIcon = {
  title: "Google AI Studio",
  hex: "4285F4",
  evenodd: true,
  path: "M9.921 4.196H6.328A2.705 2.705 0 003.623 6.9v11.362a2.705 2.705 0 002.705 2.705h11.363a2.705 2.705 0 002.705-2.705v-4.756l1.623-1.113v5.87a4.329 4.329 0 01-4.328 4.328H6.328A4.329 4.329 0 012 18.263V6.901a4.328 4.328 0 014.328-4.329h4.545l-.952 1.624z M17.82 0c.145 0 .268.104.299.246a7 7 0 001.9 3.484 7 7 0 003.485 1.901c.142.031.246.154.246.3a.308.308 0 01-.246.298A7 7 0 0020.02 8.13a7 7 0 00-1.912 3.535.297.297 0 01-.288.238.297.297 0 01-.288-.238A7 7 0 0015.62 8.13a7 7 0 00-3.535-1.912.297.297 0 01-.238-.288c0-.14.1-.26.238-.288A7 7 0 0015.62 3.73 7.001 7.001 0 0017.521.246.308.308 0 0117.82 0z",
};

type Tool = {
  name: string;
  brand?: BrandIcon; // the real logo from the Simple Icons set (CC0)
  image?: string; // a logo file in /public (used when the logo is multi-colour or comes as a file)
  wide?: boolean; // a wide wordmark: gets a wider icon box so it stays readable
  rounded?: boolean; // a square app icon: gets rounded corners
  zoom?: number; // enlarge a logo whose file has empty margin around the mark
  generic?: { Icon: LucideIcon; color: string }; // for tools with no brand logo
};

// The main card is split into groups under subheadings. Add, remove or rename freely.
// Anything marked "picked" is a common choice added to round out the stack, not something you told me you use.
const FRONTEND_TOOLS: Tool[] = [
  // frontend
  { name: "HTML5", brand: siHtml5 },
  { name: "CSS", brand: siCss },
  { name: "JavaScript", brand: siJavascript },
  { name: "TypeScript", brand: siTypescript }, // picked
  { name: "React", brand: siReact },
  { name: "Next.js", brand: siNextdotjs },
  { name: "Tailwind CSS", brand: siTailwindcss }, // picked
  { name: "Vite", brand: siVite }, // picked
  { name: "Sass", brand: siSass }, // picked
  // mobile
  { name: "Flutter", brand: siFlutter },
  { name: "Dart", brand: siDart }, // picked (Flutter's language)
  // React Native has no logo in the icon set, so it gets a generic phone icon
  { name: "React Native", generic: { Icon: Smartphone, color: "#1c9fc4" } }, // picked
  // design & motion
  { name: "Figma", brand: siFigma }, // picked
  { name: "GSAP", brand: siGsap }, // picked
  { name: "Framer Motion", brand: siFramer }, // picked (Framer's logo)
  { name: "Lottie", brand: siLottiefiles }, // picked (LottieFiles' logo)
];

const BACKEND_TOOLS: Tool[] = [
  // backend
  { name: "Node.js", brand: siNodedotjs }, // picked
  { name: "Express", brand: siExpress }, // picked
  { name: "PHP", brand: siPhp },
  { name: "Laravel", brand: siLaravel },
  { name: "GraphQL", brand: siGraphql }, // picked
  { name: "Prisma", brand: siPrisma }, // picked
  // databases
  { name: "MySQL", brand: siMysql }, // picked
  { name: "PostgreSQL", brand: siPostgresql }, // picked
  { name: "MongoDB", brand: siMongodb }, // picked
  { name: "Redis", brand: siRedis }, // picked
  { name: "Firebase", brand: siFirebase }, // picked
  { name: "Supabase", brand: siSupabase }, // picked
];

const HOSTING_TOOLS: Tool[] = [
  { name: "AWS", image: "/logos/aws.svg" },
  { name: "Hostinger", brand: siHostinger },
  { name: "cPanel", brand: siCpanel }, // picked
  { name: "Nginx", brand: siNginx }, // picked
  { name: "Linux", brand: siLinux }, // picked
  { name: "Vercel", brand: siVercel }, // picked
  { name: "Cloudflare", brand: siCloudflare }, // picked
  { name: "DigitalOcean", brand: siDigitalocean }, // picked
  { name: "Google Cloud", brand: siGooglecloud }, // picked
];

// AI tools and agents used to write and ship code faster. Bolt's logo comes from the SVGL logo library.
const VIBE_CODING_TOOLS: Tool[] = [
  { name: "Claude Code", brand: siClaudecode },
  { name: "Antigravity", image: "/logos/antigravity.svg" },
  { name: "Cursor", brand: siCursor }, // picked
  { name: "GitHub Copilot", brand: siGithubcopilot }, // picked
  { name: "Lovable", image: "/logos/lovable.svg" },
  { name: "Replit", brand: siReplit },
  { name: "Google AI Studio", brand: AI_STUDIO },
  { name: "v0", brand: siV0 },
  { name: "Bolt", image: "/logos/bolt.svg", wide: true },
  { name: "Gemini", brand: siGooglegemini }, // picked
  { name: "OpenAI", brand: OPENAI }, // picked
  { name: "Perplexity", brand: siPerplexity }, // picked
];

// Payment gateways and wallets. Cashfree Payments, Pine Labs and Easebuzz are not in the open icon sets, so
// their logo files are the ones each company publishes on its own website.
const PAYMENT_TOOLS: Tool[] = [
  { name: "Stripe", brand: siStripe }, // picked
  { name: "Razorpay", brand: siRazorpay }, // picked
  { name: "Cashfree Payments", image: "/logos/cashfree.png", zoom: 1.35 },
  { name: "PayU", brand: PAYU },
  { name: "Pine Labs", image: "/logos/pinelabs.svg", wide: true },
  { name: "Easebuzz", image: "/logos/easebuzz.png", rounded: true },
  { name: "Paytm", brand: siPaytm },
  { name: "PhonePe", brand: siPhonepe },
  // Wise's lime green is too faint on a white tile, so its mark is drawn in the brand's dark green
  { name: "Wise", brand: { ...siWise, hex: "163300" } },
  { name: "PayPal", brand: siPaypal },
];

// CMS and ecommerce platforms plus everyday developer tools.
const OTHER_TOOLS: Tool[] = [
  { name: "Shopify", brand: siShopify },
  { name: "WordPress", brand: siWordpress }, // picked
  { name: "WooCommerce", brand: siWoocommerce }, // picked
  { name: "Strapi", brand: siStrapi }, // picked
  { name: "CMS", generic: { Icon: LayoutTemplate, color: "#8b6f47" } },
  { name: "NextERP", generic: { Icon: Boxes, color: "#c4552d" } },
  { name: "Git", brand: siGit }, // picked
  { name: "GitHub", brand: siGithub }, // picked
  { name: "GitHub Actions", brand: siGithubactions }, // picked
  { name: "Docker", brand: siDocker }, // picked
  { name: "Postman", brand: siPostman }, // picked
  { name: "npm", brand: siNpm }, // picked
];

const GROUPS: { label: string; tools: Tool[] }[] = [
  { label: "Frontend", tools: FRONTEND_TOOLS },
  { label: "Backend & Database", tools: BACKEND_TOOLS },
  { label: "Hosting & Cloud", tools: HOSTING_TOOLS },
  { label: "Vibe Coding & Code Agents", tools: VIBE_CODING_TOOLS },
  { label: "Payments", tools: PAYMENT_TOOLS },
  { label: "Other", tools: OTHER_TOOLS },
];

// Building with AI: LLMs, RAG and the tooling around them. "LLMs" and "RAG" are ideas rather than products,
// so they use generic icons; every other tile uses the real logo of the tool. Anything marked "picked" is a
// common choice added to round the list out, not something you told me you use.
const AI_TOOLS: Tool[] = [
  { name: "LLMs", generic: { Icon: BrainCircuit, color: "#7c5cff" } },
  { name: "RAG", generic: { Icon: ScanSearch, color: "#e0782f" } },
  { name: "LangChain", brand: siLangchain },
  { name: "LangGraph", image: "/logos/langgraph.svg" }, // picked
  { name: "LlamaIndex", image: "/logos/llamaindex.svg" }, // picked
  { name: "Hugging Face", brand: siHuggingface },
  { name: "OpenAI API", brand: OPENAI }, // picked
  { name: "Claude API", brand: siClaude }, // picked
  { name: "Gemini API", brand: siGooglegemini }, // picked
  { name: "Mistral AI", image: "/logos/mistral.svg" }, // picked
  { name: "Ollama", brand: siOllama }, // picked
  { name: "Qdrant", brand: siQdrant }, // picked (vector database)
  { name: "Python", brand: siPython }, // picked
  { name: "FastAPI", brand: siFastapi }, // picked
];

export default function TechStackSection() {
  const root = useRef<HTMLElement>(null);

  // The block and its tiles fade up once as they scroll into view, tiles a beat after each other.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const targets = Array.from(el.querySelectorAll<HTMLElement>("[data-ts-reveal]"));
    if (!("IntersectionObserver" in window) || prefersReducedMotion()) {
      targets.forEach((t) => t.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  // A soft light follows the pointer across whichever tile it is over (set as CSS variables, no re-render).
  const track = (e: React.PointerEvent<HTMLLIElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const renderTiles = (tools: Tool[]) => (
    <ul className="ts-tools">
      {tools.map((tool, i) => (
        <li
          key={tool.name}
          className="ts-tool"
          style={{ transitionDelay: `${i * 60}ms` }}
          data-ts-reveal
          onPointerMove={track}
        >
          <span className={`ts-icon${tool.wide ? " ts-icon-wide" : ""}${tool.rounded ? " ts-icon-round" : ""}`} aria-hidden>
            {tool.brand ? (
              <svg viewBox={tool.brand.viewBox ?? "0 0 24 24"} width="100%" height="100%" role="img">
                <path d={tool.brand.path} fill={`#${tool.brand.hex}`} fillRule={tool.brand.evenodd ? "evenodd" : undefined} />
              </svg>
            ) : tool.image ? (
              // eslint-disable-next-line @next/next/no-img-element -- a small static logo file
              <img src={tool.image} alt="" width={40} height={40} className="ts-img" style={tool.zoom ? { transform: `scale(${tool.zoom})` } : undefined} />
            ) : tool.generic ? (
              <tool.generic.Icon size={34} strokeWidth={1.6} color={tool.generic.color} />
            ) : null}
          </span>
          <span className="ts-name">{tool.name}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <section ref={root} id="tech-stack" className="ts" aria-labelledby="ts-heading">
      <h2 id="ts-heading" className="ts-heading" data-ts-reveal>
        Tech Stack
      </h2>

      <div className="ts-card" data-ts-reveal>
        <p className="ts-blurb">The tools I build with, from the front end and mobile apps to the back end, databases, cloud and hosting, and the AI tools I work with.</p>
        {GROUPS.map((group) => (
          <div key={group.label} className="ts-group">
            <h3 className="ts-sub">{group.label}</h3>
            {renderTiles(group.tools)}
          </div>
        ))}
      </div>

      <div className="ts-card" data-ts-reveal>
        <h3 className="ts-title">AI &amp; LLM Engineering</h3>
        <p className="ts-blurb">Building with large language models: RAG pipelines, agents and the tooling around them.</p>
        {renderTiles(AI_TOOLS)}
      </div>
    </section>
  );
}
