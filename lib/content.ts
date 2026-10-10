export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  summary: string;
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
};

export const projects: Project[] = [
  {
    slug: "igauchoback",
    liveUrl: "https://igauchoback.vercel.app/",
    title: "iGauchoBack",
    category: "Software",
    year: "2026",
    summary:
      "An interactive degree planner that turns UC course catalogs into prerequisite maps, helping students see how their classes connect.",
    tags: ["Next.js", "TypeScript", "Supabase", "React Flow"],
    metric: "70+",
    metricLabel: "degree roadmaps",
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
    posterUrl: "/lidar-poster.pdf",
    title: "LiDAR Security System",
    category: "Embedded",
    year: "2024",
    summary:
      "A scanning Arduino system that turns noisy distance readings into movement detection, with adaptive baselines and recovery from failed readings.",
    tags: ["Arduino Uno R3", "C++", "I2C", "LiDAR"],
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
    liveUrl: "https://orbitafe.vercel.app/",
    title: "Orbit AFE",
    category: "Software",
    year: "2026",
    summary:
      "A community platform for interns, combining opt-in presence maps, real-time conversations, and profile-based connection matching.",
    tags: ["JavaScript", "Supabase", "Leaflet", "Globe.gl"],
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
    title: "Chromatic Guitar Tuner",
    category: "Signal Processing",
    year: "2026",
    summary:
      "A real-time guitar tuner that listens through a microphone, identifies a note, and shows whether the pitch is sharp, flat, or in tune.",
    tags: ["Python", "NumPy", "SoundDevice", "FFT"],
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
];

export const experience: {
  company: string;
  role: string;
  period: string;
  summary: string;
}[] = [
  {
    company: "Amazon · Alexa",
    role: "Software Development Engineer Intern",
    period: "Jun – Sep 2026",
    summary:
      "Built a WebRTC character-calling system for Alexa+ with live interruption handling and lip-synced avatars. Resolved audio backpressure to keep conversational latency under 1.5 seconds and shipped the system to pre-production infrastructure.",
  },
  {
    company: "Polymarket",
    role: "Software Engineer Intern · Mobile & Product",
    period: "Apr – Jun 2026",
    summary:
      "Synthesized more than 300 user interviews to identify mobile onboarding barriers. Developed a real-time trading heat map and distinct Analyst and Casual experiences for users with different levels of trading expertise.",
  },
  {
    company: "Amazon · Alexa",
    role: "Software Development Engineer Intern",
    period: "Jun – Sep 2025",
    summary:
      "Unified three backend services for voice access to call history. Built an LLM evaluation framework with more than 50 test scenarios and deployed an end-to-end AWS proof of concept.",
  },
];
