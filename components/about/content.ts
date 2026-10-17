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

// Editable first-person draft copy. Origin uses the supplied story; other entries
// draw on the existing portfolio and should be personalized before publication.
export const pieces: readonly Piece[] = [
  { id: 'origin', label: 'Origin', shortLabel: ['Origin'], icon: 'M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12Z M9 9a3 3 0 1 0 6 0a3 3 0 1 0-6 0', question: 'How it all started', answer: 'Vietnam → California. Picked up English through watching YouTube videos. Becoming 1% better every single day.', color: '#ead9d7' },
  { id: 'engineering', label: 'Why Engineering', shortLabel: ['Why', 'Engineering'], icon: 'M9 18h6M10 21h4M8 14a6 6 0 1 1 8 0l-1 2H9Z', question: 'Between an idea and reality', answer: 'I like projects that make me think across disciplines: the code, the signal, and the person on the other end. Electrical engineering brings those pieces together.', color: '#efded5' },
  { id: 'building', label: 'Building', shortLabel: ['Building'], icon: 'm12 3 9 5-9 5-9-5 9-5Zm-9 5v9l9 5 9-5V8M12 13v9', question: 'Ideas belong in the real world', answer: 'From a LiDAR board to iGauchoBack, I enjoy turning an idea into something people can use, understand, and be part of.', color: '#ece5c9' },
  { id: 'curiosity', label: 'Curiosity', shortLabel: ['Curiosity'], icon: 'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm5 12 6 6M7 10h6M10 7v6', question: 'One question leads to another', answer: 'What happens between the hardware and the software? How does a signal become something useful? Those are the kinds of questions I like following.', color: '#dfe7d6' },
  { id: 'learning', label: 'How I Learn', shortLabel: ['How I', 'Learn'], icon: 'M12 5C8 2 4 3 2 4v15c4-2 7-1 10 1 3-2 6-3 10-1V4c-2-1-6-2-10 1Zm0 0v15', question: 'Make it. Break it. Understand it.', answer: 'Learning English through YouTube taught me to stay resourceful. I bring that same approach to engineering: explore, try things, and keep improving.', color: '#d7e6de' },
  { id: 'problems', label: 'Favorite Problems', shortLabel: ['Favorite', 'Problems'], icon: 'm8 5-6 7 6 7M16 5l6 7-6 7M14 3l-4 18', question: 'Where disciplines meet', answer: 'I’m drawn to problems that connect embedded software, signals, and physical systems. The interesting part is getting all the pieces to work together.', color: '#dbe8e9' },
  { id: 'community', label: 'Community & People', shortLabel: ['Community', '& People'], icon: 'M8 3a3 3 0 1 0 0 6 3 3 0 1 0 0-6ZM2 21v-4a6 6 0 0 1 12 0v4M16 3a3 3 0 0 1 0 6M17 12a5 5 0 0 1 5 5v4', question: 'Good things are built together', answer: 'At UCSB, community is part of the experience—from Sigma Eta Pi to being an Autodesk Design & Make Ambassador. I value the people I get to learn and build with.', color: '#dce5ef' },
  { id: 'outside', label: 'Outside of Engineering', shortLabel: ['Outside', 'Engineering'], icon: 'M3 7h4l2-3h6l2 3h4v14H3ZM8 13a4 4 0 1 0 8 0 4 4 0 1 0-8 0', question: 'Away from the workbench', answer: 'You’ll find me speed cubing, rock crawling, or behind a camera shooting sports. Different ways to slow down, pay attention, and see things differently.', color: '#e0e2ef', image: { src: '/huy-nguyen.jpg', alt: 'Huy at the beach in Santa Barbara', width: 2844, height: 3793 } },
  { id: 'fact', label: 'Random Fact', shortLabel: ['Random', 'Fact'], icon: 'm12 3 9 5-9 5-9-5 9-5ZM3 8v9l9 5 9-5V8M12 13v9M7 6l10 5M7 10l10-5', question: 'A little puzzle on the side', answer: 'I’m into speed cubing. There’s something satisfying about taking a scrambled problem and finding a path through it.', color: '#e7e0ee' },
  { id: 'values', label: 'My Values', shortLabel: ['My Values'], icon: 'm12 3 8 4v6c0 5-8 9-8 9s-8-4-8-9V7Zm-4 9 3 3 5-6', question: 'A little better, every day', answer: 'Stay curious. Be useful. Keep learning. I care about making things that serve people, and becoming 1% better every single day.', color: '#e7dce8' },
  { id: 'next', label: 'What’s Next', shortLabel: ['What’s', 'Next'], icon: 'M4 20 20 4M6 4h14v14', question: 'Still just getting started', answer: 'I’m studying Electrical Engineering at UC Santa Barbara, graduating in June 2028. Next up: going deeper into embedded systems, RFIC, and IC design.', color: '#efdee5' },
  { id: 'ask', label: 'Ask Me About', shortLabel: ['Ask Me', 'About'], icon: 'M21 11a9 9 0 0 1-9 9H3l1-5a9 9 0 1 1 17-4ZM7 10h10M7 14h6', question: 'Let’s start a conversation', answer: 'Ask me about building iGauchoBack, working with LiDAR, speed cubing, or sports photography. I’m always happy to swap ideas.', color: '#eee0d2' },
];
