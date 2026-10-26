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
    label: "My Story",
    shortLabel: ["My Story"],
    icon: "M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12Z M9 9a3 3 0 1 0 6 0a3 3 0 1 0-6 0",
    question: "🇻🇳 → 🇺🇸",
    answer:
      "Believe it or not, a lot of my English came from watching YouTube. After moving from Vietnam to California, I’d spend endless hours watching MKBHD talk about the newest gadgets, Mark Rober build things I could barely wrap my head around, and lots of random modified car videos with big turbo noises. As a kid, I was already jailbreaking my iPad, messing around with iOS games, and figuring out glitch money. I didn’t really know what I was doing half the time, but that was part of the fun. I loved experimenting, breaking things, and seeing what I could get away with.",
    color: "#ead9d7",
  },
  {
    id: "engineer",
    label: "The Engineer",
    shortLabel: ["The", "Engineer"],
    icon: "M8 3v3M16 3v3M8 18v3M16 18v3M3 8h3M3 16h3M18 8h3M18 16h3M6 6h12v12H6ZM9 9h6v6H9Z",
    question: "Why electrical engineering?",
    answer:
      "I’ve always been the type to mess around with something just to see how it works. Sometimes that meant figuring out how to hack iOS games like Clash of Clans and Real Racing, and other times it meant going down a rabbit hole trying to understand something I probably could’ve left alone. Electrical engineering felt like a natural way to keep exploring that curiosity because I liked the idea of understanding both the software and the physical hardware behind it, instead of choosing just one. These days, that curiosity has taken me from building software projects to experimenting with sensors, embedded systems, and RF design. There’s still a lot I don’t understand, which is honestly part of what makes it so interesting to me.",
    color: "#ece5cf",
  },
  {
    id: "community",
    label: "People & Community",
    shortLabel: ["Community"],
    icon: "M8 3a3 3 0 1 0 0 6 3 3 0 1 0 0-6ZM2 21v-4a6 6 0 0 1 12 0v4M16 3a3 3 0 0 1 0 6M17 12a5 5 0 0 1 5 5v4",
    question: "It’s 120% the people",
    answer:
      "Some of my favorite parts of college have had nothing to do with sitting in a classroom. I’ve gotten involved with Sigma Eta Pi and the Autodesk Design & Make Ambassador program, and both have given me incredible opportunities to meet people I probably wouldn’t have crossed paths with otherwise. I enjoy the technical side of what I do, but I don’t want my college experience to revolve entirely around assignments, projects, and internships. There’s so much to learn from just talking and being kind to the people around you.",
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
      "Whenever someone asks what my dream car is, I never have a good answer. I’m into JDM cars, American muscle, and honestly way too many cars to narrow it down to just one. So naturally, the only reasonable solution is to have a 30-car garage someday. When I’m not thinking about cars, I also enjoy poker, 4x4 rock crawling, speedcubing, and making social media content. I’m also constantly tinkering around and diving into areas where I have zero knowledge.",
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
