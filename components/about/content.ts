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

// Personal copy approved by Huy; keep content separate from presentation.
export const pieces: readonly Piece[] = [
  {"id": "origin", "label": "Origin", "shortLabel": ["Origin"], "icon": "M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12Z M9 9a3 3 0 1 0 6 0a3 3 0 1 0-6 0", "question": "Vietnam → California", "answer": "I moved from Vietnam to California and picked up English watching YouTube. A lot of MKBHD, Mark Rober, tech-company day-in-the-life videos, and prank channels.", "color": "#ead9d7"},
  {"id": "engineering", "label": "Why EE", "shortLabel": ["Why EE"], "icon": "M9 18h6M10 21h4M8 14a6 6 0 1 1 8 0l-1 2H9Z", "question": "Why I chose electrical engineering", "answer": "EE is hard to learn on your own. I wanted access to professors, lab equipment, and the resources to understand how hardware and software work together.", "color": "#efded5"},
  {"id": "building", "label": "What I build", "shortLabel": ["What I", "build"], "icon": "m12 3 9 5-9 5-9-5 9-5Zm-9 5v9l9 5 9-5V8M12 13v9", "question": "Software, hardware, and a bit of both", "answer": "My projects include iGauchoBack and a LiDAR board. I want to spend more time building embedded systems and hardware.", "color": "#ece5c9"},
  {"id": "curiosity", "label": "What I’m learning", "shortLabel": ["What I’m", "learning"], "icon": "M12 21V11M8 21h8M10 9a2 2 0 1 0 4 0 2 2 0 1 0-4 0M7 4a7 7 0 0 0 0 10M17 4a7 7 0 0 1 0 10M4 1a11 11 0 0 0 0 16M20 1a11 11 0 0 1 0 16", "question": "RF and antenna design", "answer": "I’m digging into RF and antenna design through a research group. It’s an area I want to understand in more depth.", "color": "#dfe7d6"},
  {"id": "learning", "label": "How I learn", "shortLabel": ["How I", "learn"], "icon": "M12 5C8 2 4 3 2 4v15c4-2 7-1 10 1 3-2 6-3 10-1V4c-2-1-6-2-10 1Zm0 0v15", "question": "Making time to read", "answer": "Lately, I’m focusing more on reading and going deeper into what I’m learning.", "color": "#d7e6de"},
  {"id": "problems", "label": "At UCSB", "shortLabel": ["At UCSB"], "icon": "m2 8 10-5 10 5-10 5-10-5ZM6 10v7c4 3 8 3 12 0v-7M22 8v9", "question": "Electrical engineering, class of 2028", "answer": "I’m studying Electrical Engineering at UC Santa Barbara and expect to graduate in June 2028.", "color": "#dbe8e9"},
  {"id": "community", "label": "Community", "shortLabel": ["Community"], "icon": "M8 3a3 3 0 1 0 0 6 3 3 0 1 0 0-6ZM2 21v-4a6 6 0 0 1 12 0v4M16 3a3 3 0 0 1 0 6M17 12a5 5 0 0 1 5 5v4", "question": "Outside class", "answer": "I’ve been involved with Sigma Eta Pi as vice president and with Autodesk as a Design & Make Ambassador.", "color": "#dce5ef"},
  {"id": "outside", "label": "Photography", "shortLabel": ["Photography"], "icon": "M3 7h4l2-3h6l2 3h4v14H3ZM8 13a4 4 0 1 0 8 0 4 4 0 1 0-8 0", "question": "Sports, streets, and long exposures", "answer": "I love sports and street photography because no two pictures are ever the same. I’m also a big fan of long exposures.", "color": "#e0e2ef"},
  {"id": "fact", "label": "Cars", "shortLabel": ["Cars"], "icon": "M3 17v-6l3-6h12l3 6v6H3ZM3 11h18M6 14h2M16 14h2M5 17v3h3v-3M16 17v3h3v-3", "question": "No dream car. A whole garage.", "answer": "I’m obsessed with JDM and American muscle. I don’t have one dream car, but I do want a 30-car garage someday.", "color": "#e7e0ee"},
  {"id": "values", "label": "Other hobbies", "shortLabel": ["Other", "hobbies"], "icon": "m12 3 9 5-9 5-9-5 9-5ZM3 8v9l9 5 9-5V8M12 13v9M7 6l10 5M7 10l10-5", "question": "Cubing and rock crawling", "answer": "I’m also into speed cubing and rock crawling.", "color": "#e7dce8"},
  {"id": "next", "label": "Less is more", "shortLabel": ["Less is", "more"], "icon": "M5 12h14", "question": "Something I’m learning", "answer": "Sometimes less is more. I’m still figuring out what that means for the things I build.", "color": "#efdee5"},
  {"id": "ask", "label": "Ask me about", "shortLabel": ["Ask me", "about"], "icon": "M21 11a9 9 0 0 1-9 9H3l1-5a9 9 0 1 1 17-4ZM7 10h10M7 14h6", "question": "An easy place to start", "answer": "Cars, photography, or what I’m building lately.", "color": "#eee0d2"},
];
