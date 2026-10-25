export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  summary: string;
  cardSummary: string;
  categoryTags: string[];
  tags: string[];
  metric: string;
  metricLabel: string;
  problem: string;
  contribution: string;
  tradeoff: string;
  result: string;
  evidence: string[];
  liveUrl?: string;
  posterUrl?: string;
  sourceUrl?: string;
  image?: string;
  imageAlt?: string;
  visual?: "unwrap" | "roadmap" | "lidar" | "orbit" | "tuner";
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "unwrapathon",
    visual: "unwrap",
    featured: true,
    title: "Unwrap",
    category: "Software",
    year: "2026",
    summary:
      "An app-store review intelligence tool that turns review corpora into semantic maps, searchable feedback, and review-traceable product topics.",
    cardSummary:
      "Semantic app maps and an NLP pipeline that turn app-store reviews into explorable product insights.",
    categoryTags: ["Software", "NLP", "Data visualization"],
    tags: ["SvelteKit", "TypeScript", "Python", "Embeddings", "HDBSCAN"],
    metric: "60 apps",
    metricLabel: "in the offline demo",
    sourceUrl: "https://github.com/kylevillepo2/Unwrapathon",
    problem:
      "App-store reviews contain useful product feedback, but individual comments are difficult to connect across apps and recurring topics. Teams need a way to explore that feedback while keeping insights traceable to the original reviews.",
    contribution:
      "Built a review-exploration interface with a custom force-directed map, category clusters, app inspection, and semantic search. The project also includes a Python pipeline for review embeddings, representative sampling, LLM aspect extraction, topic refinement, and similarity-based tagging.",
    tradeoff:
      "The interface separates an offline demo from a live API through a shared data contract. Demo ratings, trends, and similarity links are generated metadata, not validated findings. The NLP pipeline preserves review provenance and distinguishes topic discovery from population estimates; similarity scores are not probabilities or verified complaint rates.",
    result:
      "Created a hackathon demo spanning 60 apps in 12 semantic category clusters, with 9,000 sampled reviews available in the interface. Custom SVG charts and a local force simulation support exploration without external chart or UI libraries, while the processing pipeline exports review-traceable topic insights.",
    evidence: [
      "Offline demo: 60 apps, 12 category clusters, and 9,000 sampled reviews",
      "Custom force layout, SVG charts, and semantic search interface",
      "Review-traceable NLP pipeline with resumable extraction and topic tagging",
    ],
  },
  {
    slug: "igauchoback",
    visual: "roadmap",
    liveUrl: "https://igauchoback.vercel.app/",
    title: "iGauchoBack",
    category: "Software",
    year: "2026",
    summary:
      "An interactive degree planner that turns UC course catalogs into prerequisite maps, helping students see how their classes connect.",
    cardSummary:
      "Interactive prerequisite graph and personalized roadmaps for 70+ degree programs.",
    categoryTags: ["Software", "Graphs", "Education"],
    tags: ["Next.js", "TypeScript", "Supabase", "React Flow"],
    metric: "70+",
    metricLabel: "degree roadmaps",
    sourceUrl: "https://github.com/huynguyen9999/iGauchoBack",
    image: "/work/igauchoback-graph.jpg",
    imageAlt:
      "iGauchoBack prerequisite graph for the UCSB Electrical Engineering roadmap",
    problem:
      "Planning a degree means connecting requirements spread across course catalogs. Inconsistent catalog formats make it difficult to translate those requirements into a clear, navigable prerequisite map.",
    contribution:
      "I built a TypeScript ingestion pipeline that converts UC catalog data into validated prerequisite graphs, then brought those graphs into an interactive planning interface. I also added API rate limiting, edge caching, and Sentry observability.",
    tradeoff:
      "The engineering challenge is preserving the meaning of course requirements while normalizing inconsistent source data. Graph validation and backend safeguards support a planning experience that is both understandable and reliable.",
    result:
      "Launched a platform with more than 70 interactive degree roadmaps across multiple UC campuses. The result connects catalog ingestion, prerequisite modeling, and a visual interface in one product.",
    evidence: [
      "70+ interactive roadmaps across multiple UC campuses",
      "TypeScript pipeline for validated prerequisite graphs",
      "Rate limiting, edge caching, and Sentry observability",
    ],
  },
  {
    slug: "lidar",
    visual: "lidar",
    posterUrl: "/lidar-poster.pdf",
    title: "LiDAR Security System",
    category: "Embedded",
    year: "2024",
    summary:
      "A scanning Arduino system that turns noisy distance readings into movement detection, with adaptive baselines and recovery from failed readings.",
    cardSummary:
      "An Arduino scan that turns noisy distance readings into movement detection.",
    categoryTags: ["Embedded", "Sensors", "Real-time"],
    tags: ["Arduino Uno R3", "C++", "I2C", "LiDAR"],
    image: "/work/lidar-board.jpg",
    imageAlt: "Arduino Uno wired to a LiDAR sensor on a breadboard",
    metric: "Top 5",
    metricLabel: "Northrop Grumman expo",
    problem:
      "A movement detector must distinguish real changes in its surroundings from sensor noise and failed readings. A scanning system also needs to interpret distance measurements across multiple angles.",
    contribution:
      "I built an Arduino-based LiDAR system that scans 180 degrees in one-degree increments and detects movement at distances up to 170 cm. I implemented a 100 cm proximity filter, adaptive baselines, and automatic retries to handle noisy or failed readings.",
    tradeoff:
      "The core challenge is turning individual sensor readings into dependable movement detection. The scanning range, proximity filter, and baseline logic each shape how the system interprets changes in its surroundings.",
    result:
      "Built a working scanning detection system and placed in the top five at a Northrop Grumman expo. The project brought together hardware integration, I2C communication, and C++ detection logic.",
    evidence: [
      "180-degree scan in one-degree increments",
      "Movement detection at distances up to 170 cm",
      "Top-five placement at a Northrop Grumman expo",
    ],
  },
  {
    slug: "orbit",
    visual: "orbit",
    liveUrl: "https://orbitafe.vercel.app/",
    title: "Orbit AFE",
    category: "Software",
    year: "2026",
    summary:
      "A community platform for interns, combining opt-in presence maps, real-time conversations, and profile-based connection matching.",
    cardSummary:
      "Opt-in presence maps and matching that help interns find each other, launched in 24 hours.",
    categoryTags: ["Software", "Real-time", "Product"],
    tags: ["JavaScript", "Supabase", "Leaflet", "Globe.gl"],
    sourceUrl: "https://github.com/huynguyen9999/AFE-2026-Hackathon",
    image: "/work/orbit.jpg",
    imageAlt: "Orbit homepage inviting interns to find nearby people",
    metric: "24h",
    metricLabel: "from build to launch",
    problem:
      "Interns spread across different cities need a way to discover peers and start conversations. Location can help people connect, but sharing it should remain an explicit choice.",
    contribution:
      "I launched Orbit in 24 hours with real-time 2D and 3D presence maps and opt-in location sharing. I also architected direct messages, group chat, and a nine-signal matching system that ranks potential connections from profile data.",
    tradeoff:
      "The product brings together geographic discovery and profile-based matching. The engineering challenge is coordinating real-time presence and conversations while respecting each person's choice to share their location.",
    result:
      "Launched a platform spanning more than 25 North American intern hubs. Its map-based discovery and communication tools create multiple paths for interns to find and connect with peers.",
    evidence: [
      "Launched in 24 hours",
      "Coverage across 25+ North American hubs",
      "Opt-in location sharing and nine-signal matching",
    ],
  },
  {
    slug: "guitar-tuner",
    visual: "tuner",
    title: "Chromatic Guitar Tuner",
    category: "Signal Processing",
    year: "2026",
    summary:
      "A real-time guitar tuner that listens through a microphone, identifies a note, and shows whether the pitch is sharp, flat, or in tune.",
    cardSummary:
      "FFT pitch detection that identifies a note and shows whether it is sharp, flat, or in tune.",
    categoryTags: ["Signal processing", "Audio", "DSP"],
    tags: ["Python", "NumPy", "SoundDevice", "FFT"],
    sourceUrl: "https://github.com/huynguyen9999/Chromatic-guitar-tuner",
    metric: "FFT",
    metricLabel: "pitch detection",
    problem:
      "Useful tuning feedback depends on translating a continuous microphone signal into a recognizable note and pitch offset. Audio capture and signal analysis need to work together without blocking each other.",
    contribution:
      "I built a Python tuner that analyzes live microphone audio and identifies notes. Its FFT-based pitch-detection pipeline uses thread-safe buffering to separate microphone capture from signal analysis and produce responsive tuning feedback.",
    tradeoff:
      "The central challenge is coordinating continuous audio capture with frequency analysis. Thread-safe buffering separates those responsibilities while the detection pipeline turns the incoming signal into actionable pitch feedback.",
    result:
      "Built a real-time chromatic tuner that identifies notes and indicates whether they are sharp, flat, or in tune. The project connects a physical instrument to an audio-processing pipeline and a direct, understandable output.",
    evidence: [
      "Live microphone input with SoundDevice",
      "FFT-based note identification using NumPy",
      "Thread-safe buffering between capture and analysis",
    ],
  },
  {
    slug: "the-hobbiest",
    title: "The Hobbiest",
    category: "Software",
    year: "2026",
    summary:
      "A personal archive connecting stories, places, hobbies, and reading through interactive maps and a custom publishing workflow.",
    cardSummary:
      "A living personal archive with an interactive identity map, reading shelves, and an owner-only editor.",
    categoryTags: ["Software", "Interaction", "Publishing"],
    tags: ["Next.js", "TypeScript", "Supabase", "MapLibre"],
    metric: "Full stack",
    metricLabel: "personal publishing",
    liveUrl: "https://thehobbiest.vercel.app/",
    sourceUrl: "https://github.com/huynguyen9999/Personal-Website",
    image: "/work/the-hobbiest.jpg",
    imageAlt:
      "The Hobbiest homepage with Huy Nguyen’s name over a mountain photograph and links to his story and interests",
    problem:
      "A personal website needs room for changing interests, reading, photographs, and stories. Keeping that material current should not require editing source code for every update.",
    contribution:
      "I built a Next.js personal archive with an interactive identity map, geographic storytelling, and reading shelves. A custom owner-only editor supports drafting and publishing copy, uploading photographs, and placing them on specific pages with alt text and captions.",
    tradeoff:
      "Interactive storytelling adds client-side complexity, while a publishing system needs a clear boundary between drafts and public content. The identity map supports keyboard navigation, and published pages use fallback copy when content is unavailable. The editor separates drafts from published entries and stages uploads privately before placing them on the public site.",
    result:
      "Deployed a personal archive on Vercel with connected story, interests, reading, and current-activity pages. The repository includes unit, component, integration, and browser tests for the interface and publishing workflows.",
    evidence: [
      "Keyboard-accessible identity map with themed filters",
      "Owner-only draft, publish, and photo-placement workflows",
      "Published-content fallback and light, dark, and system themes",
    ],
  },
];

export const experience: {
  company: string;
  team?: string;
  logo: "amazon" | "polymarket";
  role: string;
  period: string;
  impact: string;
}[] = [
  {
    company: "Amazon",
    team: "Alexa",
    logo: "amazon",
    role: "Software Development Engineer Intern",
    period: "Jun – Sep 2026",
    impact:
      "Built a WebRTC character-calling system with interruption handling and lip-synced avatars, keeping conversational latency under 1.5 seconds.",
  },
  {
    company: "Polymarket",
    logo: "polymarket",
    role: "Software Engineer Intern · Mobile & Product",
    period: "Apr – Jun 2026",
    impact:
      "Synthesized 300+ user interviews and shipped a real-time trading heat map with distinct Analyst and Casual experiences.",
  },
  {
    company: "Amazon",
    team: "Alexa",
    logo: "amazon",
    role: "Software Development Engineer Intern",
    period: "Jun – Sep 2025",
    impact:
      "Unified three backend services for voice access to call history and deployed an AWS proof of concept with 50+ evaluation scenarios.",
  },
];
