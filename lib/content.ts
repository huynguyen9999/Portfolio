export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  summary: string;
  summaryLink?: { text: string; href: string };
  cardSummary: string;
  categoryTags: string[];
  tags: string[];
  metric: string;
  metricLabel: string;
  supportingMetrics?: { value: string; label: string }[];
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
  imageWidth?: number;
  imageHeight?: number;
  featureShot?: {
    image: string;
    alt: string;
    width: number;
    height: number;
    title: string;
    caption: string;
  };
  visual?: "unwrap" | "roadmap" | "lidar" | "orbit" | "tuner";
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "unwrapathon",
    image: "/work/echo.jpg",
    imageWidth: 1440,
    imageHeight: 900,
    featureShot: {
      image: "/work/echo-switching.jpg",
      alt: "Close-up of ECHO’s Capital One Mobile panel showing reported switches, reviews analyzed, a monthly switching chart, and switches to and from other finance apps",
      width: 375,
      height: 1024,
      title: "Explore switching signals",
      caption: "See reported switches at a glance, track them month by month, and explore which apps users mention moving to or from. Demo view—not a validated measure of customer churn.",
    },
    imageAlt:
      "ECHO live website showing app icons grouped into colored review clusters on a dark interactive map",
    featured: true,
    title: "ECHO",
    summaryLink: {
      text: "Unwrapathon",
      href: "https://www.unwrap.ai/?utm_term=unwrap%20ai&utm_campaign=Search-Brand-US|UK|CA|AU&utm_source=adwords&utm_medium=ppc&hsa_acc=1487518043&hsa_cam=23301306700&hsa_grp=188818953069&hsa_ad=785599820615&hsa_src=g&hsa_tgt=kwd-2263000801660&hsa_kw=unwrap%20ai&hsa_mt=e&hsa_net=adwords&hsa_ver=3&gad_source=1&gad_campaignid=23301306700&gbraid=0AAAAAqmvszxcuyxfb0zHLwvYlSSupzkVN&gclid=CjwKCAjw0fbWBhBkEiwAwJuQ8cmig68fmWMB-T9cCJxRc1PReXjV_dhuKtJeHJZ6d5R48dDDVvm67BoC2CEQAvD_BwE",
    },
    category: "Machine Learning",
    year: "2026",
    summary:
      "From messy data to actionable insights. Built for Unwrapathon 2026, ECHO combines a multi-stage NLP pipeline with an interactive explorer to uncover customer pain points in App Store and Google Play reviews, drawing on a dataset of 5.5M+ reviews across 60 apps and 12 categories.",
    cardSummary:
      "App-review intelligence for a 5.5M+ review corpus: semantic clustering, sampled LLM extraction, and review-traceable product topics.",
    categoryTags: ["Machine learning", "NLP", "Data engineering"],
    tags: ["Python", "Sentence Transformers", "NumPy", "HDBSCAN", "SvelteKit", "TypeScript"],
    metric: "5.5M+",
    metricLabel: "reviews in source corpus",
    supportingMetrics: [
      { value: "60", label: "apps" },
      { value: "12", label: "categories" },
    ],
    liveUrl: "https://unwrapathon.vercel.app/",
    sourceUrl: "https://github.com/kylevillepo2/Unwrapathon",
    problem:
      "Feedback is everywhere, but messy reviews hide recurring product issues and user needs. A source corpus of 5,529,110 reviews across 60 apps and 12 categories makes manual inspection impractical, while sending every review to an LLM would add unnecessary inference cost. The challenge is uncovering specific, actionable experiences without losing the original review evidence.",
    contribution:
      "Built a hierarchical NLP workflow: embed and cluster reviews, select centroid, random, and boundary samples, and extract atomic product aspects with structured LLM output. A second embedding and clustering stage regroups those aspects; LLM refinement merges equivalent issues, flags irrelevant clusters, organizes related topics, and assigns canonical labels. Review IDs and metadata stay linked through the pipeline. The project also includes resumable extraction, similarity-based topic tagging, and an interactive app map for exploring the feedback.",
    tradeoff:
      "I built ECHO to turn millions of app reviews into actionable product insights without the cost of having AI read every review. By grouping similar feedback and selecting a smaller set for deeper analysis, I prioritized uncovering recurring customer pain points over measuring exactly how widespread each issue was. The key lesson was distinguishing a promising product signal from a validated conclusion—and keeping findings linked to the customer feedback behind them. The source dataset contains 5.5M+ reviews, not all individually analyzed by AI; some demo data is simulated, while validated issue-frequency estimates, cross-app comparisons, and trend detection remain future work.",
    result:
      "Delivered an Unwrapathon 2026 review-intelligence prototype backed by a 60-app, 12-category demo, with 9,000 sampled reviews available in the interface. The implemented pipeline connects review clustering and sampling to aspect extraction, canonical topic refinement, and review-traceable exports. Its architecture targets customer voices, emerging trends, and switching signals without claiming measured cost savings, full-corpus LLM coverage, or validated population statistics.",
    evidence: [
      "Source corpus: 5,529,110 reviews across 60 apps and 12 categories",
      "9,000 sampled reviews available in the demo interface",
      "Review clustering → sampled aspect extraction → aspect clustering → LLM refinement",
      "Canonical topics retain mappings to original reviews and supporting evidence",
      "Resumable extraction and similarity-based tagging; weighted statistical estimates remain planned",
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
