export type Piece = {
  id: string;
  label: string;
  shortLabel: string[];
  icon: string;
  question: string;
  answer: string;
  color: string;
  image?: { src: string; alt: string; width: number; height: number };
};

// Personal stories and optional authentic photos; keep content separate from rendering.
export const pieces: readonly Piece[] = [
  {
    id: "roots",
    label: "My Roots",
    shortLabel: ["My Roots"],
    icon: "M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12Z M9 9a3 3 0 1 0 6 0a3 3 0 1 0-6 0",
    question: "From Vietnam to California",
    answer:
      "I moved from Vietnam to California and learned a lot of my English through YouTube. I watched MKBHD, Mark Rober, tech-company day-in-the-life videos, and prank channels. Looking back, it’s funny how much of my early curiosity about technology came from watching people explain and build things online. The prank videos were just for fun.",
    color: "#ead9d7",
  },
  {
    id: "engineer",
    label: "The Engineer",
    shortLabel: ["The", "Engineer"],
    icon: "M8 3v3M16 3v3M8 18v3M16 18v3M3 8h3M3 16h3M18 8h3M18 16h3M6 6h12v12H6ZM9 9h6v6H9Z",
    question: "Why I chose electrical engineering",
    answer:
      "I chose electrical engineering because I wanted to understand hardware and software together. A lot of hardware is difficult to explore without labs, equipment, and professors to learn from. I’ve enjoyed building iGauchoBack and working on my LiDAR project, and I want to spend more time with embedded systems. Right now, I’m also exploring RF and antenna design through a research group. There’s a lot I’m still learning.",
    color: "#ece5cf",
  },
  {
    id: "community",
    label: "People & Community",
    shortLabel: ["Community"],
    icon: "M8 3a3 3 0 1 0 0 6 3 3 0 1 0 0-6ZM2 21v-4a6 6 0 0 1 12 0v4M16 3a3 3 0 0 1 0 6M17 12a5 5 0 0 1 5 5v4",
    question: "The people make the experience",
    answer:
      "At UCSB, I’ve been involved with Sigma Eta Pi as vice president and with the Autodesk Design & Make Ambassador program. I want college to be about more than courses and internships. Getting to know people outside class, working on things together, and having conversations along the way are parts of the experience I want to make time for, too.",
    color: "#dce5ef",
  },
  {
    id: "photography",
    label: "Behind the Lens",
    shortLabel: ["Photography"],
    icon: "M3 7h4l2-3h6l2 3h4v14H3ZM8 13a4 4 0 1 0 8 0 4 4 0 1 0-8 0",
    question: "Sports, streets, and long exposures",
    answer:
      "I love sports and street photography because you can’t completely predict what will happen next. No two pictures are ever the same, and that’s part of the appeal. I’m also a big fan of long exposures: something ordinary can look completely different just by changing how you capture it. Both give me a reason to stop and look a little longer.",
    color: "#dbe6de",
  },
  {
    id: "hobbies",
    label: "Off the Clock",
    shortLabel: ["Off the", "Clock"],
    icon: "M3 17v-6l3-6h12l3 6v6H3ZM3 11h18M6 14h2M16 14h2M5 17v3h3v-3M16 17v3h3v-3",
    question: "No dream car. A whole garage.",
    answer:
      "I’m a big fan of JDM cars and American muscle. I can’t settle on one dream car, so my completely reasonable plan is to have a 30-car garage someday. I also enjoy rock crawling and speedcubing. They’re pretty different hobbies, but they’re all things I can easily lose track of time doing.",
    color: "#eadfd3",
  },
  {
    id: "learning",
    label: "Still Figuring It Out",
    shortLabel: ["Still", "Learning"],
    icon: "M12 5C8 2 4 3 2 4v15c4-2 7-1 10 1 3-2 6-3 10-1V4c-2-1-6-2-10 1Zm0 0v15",
    question: "Learning when less is more",
    answer:
      "I’ve been trying to make more time for reading and going deeper into the things I’m interested in. I’m also learning that building something better doesn’t always mean adding more to it. Sometimes the difficult part is figuring out what matters enough to keep. I’m still working on that, both in what I build and what I choose to spend time learning.",
    color: "#e5deeb",
  },
];
