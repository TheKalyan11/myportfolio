export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: "all" | "fullstack" | "aicloud" | "frontend" | "tools";
  description: string;
  longDescription: string;
  image?: string;
  graphicType: "image" | "telemetry" | "canvas" | "ecommerce" | "security" | "review";
  tags: string[];
  metrics: { label: string; value: string }[];
  architecture: {
    frontend: string;
    backend: string;
    database: string;
    infrastructure: string;
  };
  highlights: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
}

export interface SkillCategory {
  title: string;
  iconName: string;
  skills: {
    name: string;
    level: number; // percentage
    years: string;
    icon: string;
    tag?: string;
  }[];
}

export interface Experience {
  period: string;
  role: string;
  company: string;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
}

export const PORTFOLIO_DATA = {
  personal: {
    name: "Kalyan",
    fullName: "Kalyan V.",
    headline: "Senior Full-Stack Engineer & Systems Architect",
    subheadline: "Crafting mission-critical web applications, cloud-native distributed backends, and AI-powered interfaces with pixel-level precision.",
    bio: "With over 5 years of experience delivering robust digital products, I bridge complex backend architectures with fluid, high-performance user experiences. Passionate about Next.js, TypeScript, cloud scalability, and generative AI systems that solve real-world problems.",
    location: "Hyderabad, India",
    availability: "Available for Full-time Roles & High-Impact Consulting",
    email: "kalyan.developer@outlook.com",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://x.com",
    resumeUrl: "#",
    profileImage: "/profile.png",
  },
  stats: [
    { label: "Years Experience", value: "5+", detail: "Enterprise & startup engineering" },
    { label: "Shipped Projects", value: "30+", detail: "From concept to production" },
    { label: "Production Uptime", value: "99.9%", detail: "Reliability & performance first" },
    { label: "Global Users Impacted", value: "150K+", detail: "Across consumer & B2B platforms" },
  ],
  projects: [
    {
      id: "nexus-ai",
      title: "NexusAI – Autonomous Neural Ops Platform",
      subtitle: "Multi-Agent Workflow Orchestration & Real-Time Telemetry",
      category: "aicloud",
      description: "An enterprise-grade platform to build, evaluate, and monitor autonomous LLM agent graphs with sub-20ms distributed state coordination and streaming telemetry.",
      longDescription: "NexusAI addresses the challenge of running complex multi-agent workflows with strict reliability constraints. Features a visual DAG editor, sandboxed Python code execution environments, token rate limiting, and comprehensive audit trails with vector-backed memory search.",
      image: "/projects/nexusai.jpg",
      graphicType: "image",
      tags: ["Next.js 16", "React 19", "TypeScript", "Python FastAPI", "Redis", "Docker", "WebSockets"],
      metrics: [
        { label: "Task Success Rate", value: "99.2%" },
        { label: "Concurrent Agents", value: "150+" },
        { label: "State Latency", value: "<18ms" },
      ],
      architecture: {
        frontend: "Next.js 16 App Router, React 19 Server Components, Custom Canvas DAG visualizer",
        backend: "FastAPI async worker cluster, Celery task scheduling, WebSockets event bus",
        database: "PostgreSQL with pgvector for memory retrieval, Redis Cluster for state cache",
        infrastructure: "AWS ECS Fargate, CloudFront CDN, Docker multi-stage containers",
      },
      highlights: [
        "Constructed visual DAG workflow builder with dynamic cycle detection and breakpoint debugging",
        "Implemented real-time token streaming via WebSockets with automatic reconnection backoff",
        "Reduced agent execution latency by 44% utilizing Redis pipeline state caching",
      ],
      liveUrl: "https://nexusai-demo.vercel.app",
      githubUrl: "https://github.com/kalyan/nexus-ai-orchestrator",
      featured: true,
    },
    {
      id: "hyperion-cloud",
      title: "Hyperion Cloud – Global Telemetry Mesh",
      subtitle: "Multi-Region Infrastructure Monitoring & Anomaly Detection",
      category: "fullstack",
      description: "Real-time distributed systems observability engine tracking microservice health, geographic latency distributions, and automatic failover metrics.",
      longDescription: "Engineered to ingest millions of telemetry data points per minute across multi-cloud clusters. Incorporates automated threshold anomaly detection, live topology maps, and interactive latency heatmaps.",
      graphicType: "telemetry",
      tags: ["Next.js", "TypeScript", "Go", "GraphQL", "TimescaleDB", "Kafka", "Prometheus"],
      metrics: [
        { label: "Events Ingested / Sec", value: "120K+" },
        { label: "MTTR Reduction", value: "48%" },
        { label: "Query Response", value: "42ms" },
      ],
      architecture: {
        frontend: "Next.js, WebGL chart rendering, Tailwind-styled responsive dashboard",
        backend: "Golang microservices, Kafka streaming pipeline, Apollo GraphQL federation",
        database: "TimescaleDB time-series hyper-tables, ClickHouse analytical aggregation",
        infrastructure: "Kubernetes on EKS, Envoy service mesh, Grafana integration",
      },
      highlights: [
        "Engineered real-time SVG & Canvas cluster visualization rendering 5,000 nodes at 60 FPS",
        "Optimized analytical time-series queries down from 4.2s to 42ms via hyper-table compression",
        "Built automated PagerDuty & Slack webhook incident alert routing with deduplication",
      ],
      liveUrl: "https://hyperion-cloud-demo.vercel.app",
      githubUrl: "https://github.com/kalyan/hyperion-telemetry-mesh",
      featured: true,
    },
    {
      id: "pulseflow-canvas",
      title: "PulseFlow – Collaborative Knowledge Canvas",
      subtitle: "Multiplayer Infinite Workspace with CRDT Document Sync",
      category: "frontend",
      description: "Low-latency collaborative digital workspace featuring infinite zoomable canvas, bi-directional markdown linking, and conflict-free peer syncing.",
      longDescription: "PulseFlow gives distributed teams a unified workspace for brainstorming, architecture mapping, and documentation. Utilizes Yjs CRDTs for instantaneous real-time collaboration with offline persistence.",
      graphicType: "canvas",
      tags: ["React 19", "Next.js", "WebGL", "TypeScript", "WebRTC", "Yjs", "IndexedDB"],
      metrics: [
        { label: "Frame Rate", value: "60 FPS" },
        { label: "Peer Sync Latency", value: "<15ms" },
        { label: "Weekly Creators", value: "35K+" },
      ],
      architecture: {
        frontend: "Custom HTML5 Canvas & WebGL 2D renderer, React 19 concurrent features",
        backend: "Node.js WebSocket signaling server, WebRTC data channels",
        database: "IndexedDB for local first storage, S3 bucket document snapshots",
        infrastructure: "Cloudflare Workers edge nodes, Vercel edge deployment",
      },
      highlights: [
        "Implemented custom spatial hash indexing for instantaneous viewport culling of 10,000+ nodes",
        "Built offline-first synchronization enabling zero data loss during network disruptions",
        "Integrated custom undo/redo tree with fine-grained CRDT operation stacking",
      ],
      liveUrl: "https://pulseflow-canvas.vercel.app",
      githubUrl: "https://github.com/kalyan/pulseflow-workspace",
      featured: true,
    },
    {
      id: "veloce-store",
      title: "Veloce – Headless Luxury Commerce Storefront",
      subtitle: "Sub-Second Edge Commerce with Dynamic Currency & Checkout",
      category: "fullstack",
      description: "High-performance omnichannel storefront achieving a 100/100 Core Web Vitals score, dynamic multi-currency hedging, and instant Stripe Elements checkout.",
      longDescription: "A modern ecommerce experience designed for rapid conversions and minimal layout shifts. Features optimistic cart updates, server-driven UI configuration, and smart predictive product prefetching.",
      graphicType: "ecommerce",
      tags: ["Next.js App Router", "TypeScript", "Shopify API", "Stripe", "Tailwind CSS"],
      metrics: [
        { label: "Lighthouse Score", value: "100/100" },
        { label: "Checkout Conversion", value: "+34%" },
        { label: "First Contentful Paint", value: "0.4s" },
      ],
      architecture: {
        frontend: "Next.js 16 Partial Prerendering (PPR), React Server Actions, CSS Modules",
        backend: "Shopify Storefront GraphQL, Stripe Custom Connect APIs",
        database: "Redis edge session storage, Upstash KV for inventory cache",
        infrastructure: "Vercel Edge Network, Multi-zone CDN caching",
      },
      highlights: [
        "Achieved 100/100 performance across mobile and desktop through Partial Prerendering",
        "Reduced cart abandonment by 28% via 1-click Apple Pay & Google Pay integration",
        "Engineered zero-CLS responsive product media gallery with progressive WebP blur hashes",
      ],
      liveUrl: "https://veloce-storefront.vercel.app",
      githubUrl: "https://github.com/kalyan/veloce-headless-store",
      featured: false,
    },
    {
      id: "aura-id",
      title: "AuraID – Zero-Knowledge Identity Vault",
      subtitle: "Privacy-Preserving Credential Attestation & Passkeys",
      category: "tools",
      description: "Cryptographic identity verification engine generating zero-knowledge proofs client-side to authenticate user age and credentials without leaking raw PII.",
      longDescription: "Allows users to verify attributes (e.g. over 21, certified developer, enterprise member) using snarkjs and Circom circuits in the browser without revealing personal identification details.",
      graphicType: "security",
      tags: ["Next.js", "Circom", "Web3", "Rust Wasm", "WebAuthn", "TypeScript"],
      metrics: [
        { label: "Client Proof Time", value: "1.1s" },
        { label: "PII Leaked", value: "0 bytes" },
        { label: "Passkey Auth", value: "<300ms" },
      ],
      architecture: {
        frontend: "Next.js, Rust WebAssembly cryptographic primitives, WebAuthn API",
        backend: "Node.js proof verification microservice, EdDSA signature validator",
        database: "Decentralized IPFS pinning, tamper-proof audit merkle trees",
        infrastructure: "AWS Lambda verification endpoints, Cloudflare Zero Trust",
      },
      highlights: [
        "Compiled Circom ZK circuits into highly optimized WebAssembly running entirely client-side",
        "Eliminated passwords via FIDO2 / WebAuthn hardware biometric passkeys",
        "Published open-source verification SDK adopted by 8 developer tooling startups",
      ],
      liveUrl: "https://auraid-vault.vercel.app",
      githubUrl: "https://github.com/kalyan/auraid-zk-vault",
      featured: false,
    },
    {
      id: "devpulse-ai",
      title: "DevPulse – Pull Request Velocity Intelligence",
      subtitle: "Semantic Code Health & Merge Risk Prediction Bot",
      category: "aicloud",
      description: "Automated engineering intelligence bot that parses AST diffs, spots hidden architectural regressions, and generates contextual review summaries.",
      longDescription: "Integrates directly into GitHub workflows to reduce review bottlenecks. Parses abstract syntax trees to determine structural impact rather than line diffs, highlighting security vulnerabilities and performance bottlenecks.",
      graphicType: "review",
      tags: ["TypeScript", "Next.js", "OpenAI API", "GitHub API", "PostgreSQL", "Redis"],
      metrics: [
        { label: "Review Turnaround", value: "-62%" },
        { label: "PRs Analyzed", value: "40K+" },
        { label: "Accuracy Rating", value: "94%" },
      ],
      architecture: {
        frontend: "Next.js App Router, shadcn/ui inspired custom CSS tokens, Tremor charts",
        backend: "Node.js queue consumers, OpenAI embeddings & reasoning models",
        database: "PostgreSQL on Supabase, Redis BullMQ asynchronous queues",
        infrastructure: "Vercel serverless, GitHub Apps Webhooks architecture",
      },
      highlights: [
        "Designed semantic AST diff parser in TypeScript providing context-aware review suggestions",
        "Processed over 40,000 pull requests with 99.8% webhook delivery reliability",
        "Decreased developer onboarding time by surfacing codebase architectural references on changes",
      ],
      liveUrl: "https://devpulse-insights.vercel.app",
      githubUrl: "https://github.com/kalyan/devpulse-code-intel",
      featured: false,
    },
  ] as Project[],
  skillsData: [
    {
      title: "Frontend Engineering",
      iconName: "Layout",
      skills: [
        { name: "Next.js (App Router / PPR)", level: 96, years: "4 yrs", icon: "nextjs", tag: "Expert" },
        { name: "React 19 & Server Components", level: 95, years: "5 yrs", icon: "react", tag: "Expert" },
        { name: "TypeScript / JavaScript (ESNext)", level: 94, years: "5 yrs", icon: "typescript", tag: "Expert" },
        { name: "Modern CSS / CSS Modules", level: 92, years: "5 yrs", icon: "css", tag: "Advanced" },
        { name: "Tailwind CSS & Design Systems", level: 90, years: "4 yrs", icon: "tailwind", tag: "Advanced" },
        { name: "HTML5 Canvas & WebGL", level: 82, years: "2 yrs", icon: "webgl", tag: "Proficient" },
      ],
    },
    {
      title: "Backend & Systems",
      iconName: "Server",
      skills: [
        { name: "Node.js / Express / NestJS", level: 92, years: "5 yrs", icon: "nodejs", tag: "Expert" },
        { name: "Python (FastAPI & AsyncIO)", level: 88, years: "3 yrs", icon: "python", tag: "Advanced" },
        { name: "Golang Microservices", level: 80, years: "2 yrs", icon: "golang", tag: "Proficient" },
        { name: "RESTful & GraphQL APIs", level: 94, years: "5 yrs", icon: "graphql", tag: "Expert" },
        { name: "WebSockets & Event-Driven Arcs", level: 89, years: "4 yrs", icon: "websocket", tag: "Advanced" },
        { name: "gRPC & Protocol Buffers", level: 78, years: "2 yrs", icon: "grpc", tag: "Intermediate" },
      ],
    },
    {
      title: "Databases & Storage",
      iconName: "Database",
      skills: [
        { name: "PostgreSQL & pgvector", level: 92, years: "4 yrs", icon: "postgresql", tag: "Advanced" },
        { name: "Redis (Cache, Pub/Sub, Queues)", level: 90, years: "4 yrs", icon: "redis", tag: "Advanced" },
        { name: "MongoDB & Document Stores", level: 86, years: "4 yrs", icon: "mongodb", tag: "Advanced" },
        { name: "Prisma & Drizzle ORM", level: 90, years: "3 yrs", icon: "prisma", tag: "Advanced" },
        { name: "ClickHouse & Time-Series", level: 75, years: "2 yrs", icon: "clickhouse", tag: "Proficient" },
      ],
    },
    {
      title: "Cloud, DevOps & AI",
      iconName: "Cloud",
      skills: [
        { name: "Docker & Containerization", level: 90, years: "4 yrs", icon: "docker", tag: "Advanced" },
        { name: "AWS (ECS, Lambda, S3, CloudFront)", level: 86, years: "3 yrs", icon: "aws", tag: "Advanced" },
        { name: "CI/CD (GitHub Actions, Automated Testing)", level: 92, years: "4 yrs", icon: "github", tag: "Expert" },
        { name: "LLM Orchestration & LangChain", level: 88, years: "2 yrs", icon: "ai", tag: "Cutting-Edge" },
        { name: "Vector Search & RAG Architecture", level: 86, years: "2 yrs", icon: "rag", tag: "Cutting-Edge" },
      ],
    },
  ] as SkillCategory[],
  radar: [
    { title: "Distributed Consensus & Raft", status: "Deep-diving", progress: 75 },
    { title: "WebAssembly (Rust to Wasm)", status: "Active Experimentation", progress: 85 },
    { title: "WebGPU Compute Shaders", status: "Early Prototypes", progress: 60 },
    { title: "Autonomous Multi-Agent Routing", status: "Production Prototyping", progress: 90 },
  ],
  experience: [
    {
      period: "2023 – Present",
      role: "Senior Full-Stack Engineer",
      company: "CognitiveScale Tech Solutions",
      location: "Hyderabad, India / Remote",
      description: "Leading frontend architecture and cloud integrations for enterprise AI platforms serving Fortune 500 financial and healthcare institutions.",
      achievements: [
        "Architected core dashboard handling 100K+ daily events with 99.98% reliability",
        "Spearheaded migration to Next.js App Router and React Server Components, decreasing initial bundle size by 47%",
        "Mentored a team of 7 engineers, established automated CI testing with 85%+ coverage standard",
        "Implemented real-time streaming AI chat and reasoning agent visualizations",
      ],
      technologies: ["Next.js 15/16", "TypeScript", "Python", "Redis", "AWS", "Docker", "Tailwind CSS"],
    },
    {
      period: "2021 – 2023",
      role: "Full-Stack Software Engineer",
      company: "Vanguard Digital Systems",
      location: "Hyderabad, India",
      description: "Engineered scalable customer-facing SaaS web applications, payment integrations, and microservices backends.",
      achievements: [
        "Re-engineered checkout funnel with optimistic state updates, driving an 18% lift in conversion rates",
        "Constructed high-throughput webhooks pipeline consuming 2M+ events weekly with zero data drops",
        "Implemented role-based access control (RBAC) and OAuth2/SAML SSO authentication across 4 core apps",
      ],
      technologies: ["React", "Node.js", "Express", "PostgreSQL", "GraphQL", "Redis", "Jest"],
    },
    {
      period: "2019 – 2021",
      role: "Frontend & Web Developer",
      company: "Apex Innovations",
      location: "Hyderabad, India",
      description: "Developed interactive web applications, high-performance landing pages, and responsive design systems.",
      achievements: [
        "Developed custom UI component library adopted across 6 company products",
        "Improved website Core Web Vitals to green scores (LCP < 1.2s, FID < 50ms, CLS < 0.02)",
        "Collaborated closely with UX designers to transform Figma prototypes into accessible, responsive code",
      ],
      technologies: ["JavaScript (ES6+)", "React", "HTML5", "CSS3/Sass", "Webpack", "REST APIs"],
    },
  ] as Experience[],
  testimonials: [
    {
      name: "Marcus Sterling",
      role: "VP of Engineering",
      company: "CognitiveScale Tech",
      avatar: "MS",
      content: "Kalyan is one of the rarest engineers who commands absolute mastery of both systems-level backend performance and pixel-perfect modern frontend design. His work on our AI orchestration platform saved us months of engineering time.",
      rating: 5,
    },
    {
      name: "Elena Rostova",
      role: "Product Lead",
      company: "Vanguard SaaS",
      avatar: "ER",
      content: "Collaborating with Kalyan was effortless. He anticipates technical bottlenecks before they occur, communicates with clarity, and consistently delivers solutions that exceed performance benchmarks.",
      rating: 5,
    },
    {
      name: "Devon Clark",
      role: "Principal Solutions Architect",
      company: "CloudCore Dynamics",
      avatar: "DC",
      content: "Kalyan's code quality, architecture documentation, and adherence to clean code principles set the benchmark for our entire engineering department. A true 10x engineering contributor.",
      rating: 5,
    },
  ] as Testimonial[],
  certifications: [
    { title: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", year: "2024" },
    { title: "Meta Certified Senior Front-End Developer", issuer: "Meta / Coursera", year: "2023" },
    { title: "DeepLearning.AI Generative AI for Software Engineers", issuer: "DeepLearning.AI", year: "2024" },
  ],
};
