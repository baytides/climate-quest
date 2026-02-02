export interface Location {
  id: string;
  name: string;
  description: string;
  ecosystem: string;
  x: number;
  y: number;
}

export interface Question {
  id: string;
  locationId: string;
  question: string;
  answers: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  // Educational standards alignment
  standards: {
    ngss?: string[];      // Next Generation Science Standards
    epc?: string[];       // California EP&C Principles
  };
}

export const locations: Location[] = [
  {
    id: 'start',
    name: 'Coastal Beach',
    description: 'Sandy shores where land meets ocean. Home to shorebirds, crabs, and sea life.',
    ecosystem: 'coastal',
    x: 100,
    y: 450,
  },
  {
    id: 'wetlands',
    name: 'Wetlands',
    description: 'Marshes and tidal flats that filter water and provide habitat for countless species.',
    ecosystem: 'wetland',
    x: 250,
    y: 350,
  },
  {
    id: 'forest',
    name: 'Redwood Forest',
    description: 'Ancient trees that capture carbon and shelter diverse wildlife.',
    ecosystem: 'forest',
    x: 400,
    y: 280,
  },
  {
    id: 'river',
    name: 'River Delta',
    description: 'Where freshwater meets the sea, creating rich ecosystems for fish and birds.',
    ecosystem: 'river',
    x: 550,
    y: 350,
  },
  {
    id: 'mountains',
    name: 'Mountain Peak',
    description: 'High elevation habitat with unique plants and animals adapted to thin air.',
    ecosystem: 'mountain',
    x: 700,
    y: 200,
  },
];

export const questions: Question[] = [
  // Coastal Beach questions
  {
    id: 'beach-1',
    locationId: 'start',
    question: 'What do crabs use their claws for?',
    answers: ['Only for fighting', 'Catching food and defense', 'Swimming', 'Making sounds'],
    correctIndex: 1,
    explanation: 'Crabs use their claws for many things: catching food, defending themselves, and even attracting mates!',
    difficulty: 'easy',
    standards: {
      ngss: ['MS-LS1-4'], // Structure and function
      epc: ['Principle I'], // People depend on natural systems
    },
  },
  {
    id: 'beach-2',
    locationId: 'start',
    question: 'Why are tide pools important for marine life?',
    answers: [
      'They are just puddles',
      'They provide shelter when the tide goes out',
      'Fish prefer warm water',
      'They have no importance',
    ],
    correctIndex: 1,
    explanation: 'Tide pools provide crucial shelter for sea creatures when the ocean water retreats during low tide.',
    difficulty: 'medium',
    standards: {
      ngss: ['MS-LS2-1', 'MS-LS2-2'], // Ecosystems interactions
      epc: ['Principle II'], // People influence natural systems
    },
  },
  {
    id: 'beach-3',
    locationId: 'start',
    question: 'What human activity most threatens beach ecosystems?',
    answers: ['Walking on sand', 'Plastic pollution', 'Taking photographs', 'Bird watching'],
    correctIndex: 1,
    explanation: 'Plastic pollution is a major threat to beaches and ocean life. Animals can eat plastic or get tangled in it.',
    difficulty: 'medium',
    standards: {
      ngss: ['MS-ESS3-3', 'MS-ESS3-4'], // Human impacts on Earth systems
      epc: ['Principle III', 'Principle IV'], // Natural systems change, sustainability
    },
  },

  // Wetlands questions
  {
    id: 'wetland-1',
    locationId: 'wetlands',
    question: 'How do wetlands help prevent flooding?',
    answers: [
      'They block rain clouds',
      'They absorb and store excess water',
      'They have no effect on flooding',
      'They make water evaporate faster',
    ],
    correctIndex: 1,
    explanation: 'Wetlands act like giant sponges, absorbing floodwater and releasing it slowly over time.',
    difficulty: 'medium',
    standards: {
      ngss: ['MS-ESS2-4', 'MS-ESS3-2'], // Water cycle, natural hazards
      epc: ['Principle I', 'Principle II'], // Ecosystem services
    },
  },
  {
    id: 'wetland-2',
    locationId: 'wetlands',
    question: 'What makes wetlands good at cleaning water?',
    answers: [
      'Fish eat the pollution',
      'Plants and soil filter out pollutants',
      'The water is already clean',
      'Wetlands make water dirty',
    ],
    correctIndex: 1,
    explanation: 'Wetland plants and soil naturally filter pollutants, cleaning water before it reaches rivers and oceans.',
    difficulty: 'medium',
    standards: {
      ngss: ['MS-LS2-3'], // Cycling of matter in ecosystems
      epc: ['Principle I', 'Principle IV'], // Natural systems, sustainability
    },
  },
  {
    id: 'wetland-3',
    locationId: 'wetlands',
    question: 'Why are wetlands called "nurseries" for fish?',
    answers: [
      'Baby fish go to school there',
      'Young fish find food and shelter there',
      'Adult fish build nests there',
      'Fish are born in hospitals',
    ],
    correctIndex: 1,
    explanation: 'Many fish species use wetlands as nurseries because young fish find plenty of food and places to hide from predators.',
    difficulty: 'easy',
    standards: {
      ngss: ['MS-LS2-1', 'MS-LS2-2'], // Ecosystems, resources
      epc: ['Principle I'], // People depend on natural systems
    },
  },

  // Forest questions
  {
    id: 'forest-1',
    locationId: 'forest',
    question: 'How do forests help fight climate change?',
    answers: [
      'They produce oxygen only',
      'Trees absorb carbon dioxide from the air',
      'Forests have no effect on climate',
      'They make it rain more',
    ],
    correctIndex: 1,
    explanation: 'Trees absorb carbon dioxide (a greenhouse gas) and store carbon in their wood, leaves, and roots.',
    difficulty: 'medium',
    standards: {
      ngss: ['MS-LS2-3', 'MS-ESS3-5'], // Carbon cycle, climate change
      epc: ['Principle III', 'Principle IV'], // Natural systems, sustainability
    },
  },
  {
    id: 'forest-2',
    locationId: 'forest',
    question: 'What is the forest floor covered with?',
    answers: [
      'Only dirt',
      'Decomposing leaves, fungi, and small organisms',
      'Concrete',
      'Nothing grows there',
    ],
    correctIndex: 1,
    explanation: 'The forest floor is a busy ecosystem with decomposing leaves, fungi, insects, and other organisms recycling nutrients.',
    difficulty: 'easy',
    standards: {
      ngss: ['MS-LS2-3'], // Cycling of matter
      epc: ['Principle I'], // Natural systems
    },
  },
  {
    id: 'forest-3',
    locationId: 'forest',
    question: 'Why is biodiversity important in forests?',
    answers: [
      'It makes forests look pretty',
      'Different species depend on each other to survive',
      'Biodiversity does not matter',
      'It helps humans only',
    ],
    correctIndex: 1,
    explanation: 'Biodiversity creates a web of life where different species provide food, shelter, and services to each other.',
    difficulty: 'hard',
    standards: {
      ngss: ['MS-LS2-4', 'MS-LS2-5'], // Ecosystem dynamics
      epc: ['Principle II', 'Principle V'], // Interdependence, decisions
    },
  },

  // River questions
  {
    id: 'river-1',
    locationId: 'river',
    question: 'Why do salmon swim upstream to spawn?',
    answers: [
      'They like swimming against the current',
      'They return to where they were born to lay eggs',
      'The water is warmer upstream',
      'They are lost',
    ],
    correctIndex: 1,
    explanation: 'Salmon have an amazing ability to return to the exact stream where they hatched to lay their own eggs.',
    difficulty: 'medium',
    standards: {
      ngss: ['MS-LS1-4', 'MS-LS1-5'], // Animal behavior, reproduction
      epc: ['Principle I'], // Natural systems
    },
  },
  {
    id: 'river-2',
    locationId: 'river',
    question: 'What happens when rivers are dammed?',
    answers: [
      'Nothing changes',
      'Fish migration can be blocked and ecosystems disrupted',
      'More fish appear',
      'The water becomes cleaner',
    ],
    correctIndex: 1,
    explanation: 'Dams can block fish from reaching their spawning grounds and change water flow that ecosystems depend on.',
    difficulty: 'hard',
    standards: {
      ngss: ['MS-ESS3-3', 'MS-LS2-4'], // Human impacts, ecosystem changes
      epc: ['Principle II', 'Principle III'], // Human influence, system changes
    },
  },
  {
    id: 'river-3',
    locationId: 'river',
    question: 'What is a river delta?',
    answers: [
      'A type of fish',
      'Where a river meets the ocean and deposits sediment',
      'A fast-moving part of a river',
      'A waterfall',
    ],
    correctIndex: 1,
    explanation: 'A delta forms where rivers slow down at the ocean, depositing sediment and creating rich wetland habitats.',
    difficulty: 'easy',
    standards: {
      ngss: ['MS-ESS2-2'], // Earth's systems
      epc: ['Principle I'], // Natural systems
    },
  },

  // Mountain questions
  {
    id: 'mountain-1',
    locationId: 'mountains',
    question: 'Why is there less oxygen at mountain peaks?',
    answers: [
      'Trees use it all',
      'Air pressure is lower, so air molecules are spread out',
      'Animals breathe it all',
      'The sun burns it away',
    ],
    correctIndex: 1,
    explanation: 'At high altitudes, lower air pressure means oxygen molecules are more spread out, making it harder to breathe.',
    difficulty: 'hard',
    standards: {
      ngss: ['MS-ESS2-5', 'MS-ESS2-6'], // Atmosphere, weather
      epc: ['Principle I'], // Natural systems
    },
  },
  {
    id: 'mountain-2',
    locationId: 'mountains',
    question: 'How do mountain glaciers affect water supply?',
    answers: [
      'They have no effect',
      'They store water and release it slowly during dry seasons',
      'They only create floods',
      'They make water salty',
    ],
    correctIndex: 1,
    explanation: 'Glaciers act as natural water storage, melting slowly in summer to provide water when rainfall is low.',
    difficulty: 'hard',
    standards: {
      ngss: ['MS-ESS2-4', 'MS-ESS3-1'], // Water cycle, natural resources
      epc: ['Principle I', 'Principle IV'], // Natural systems, sustainability
    },
  },
  {
    id: 'mountain-3',
    locationId: 'mountains',
    question: 'What is happening to mountain ecosystems due to climate change?',
    answers: [
      'Nothing is changing',
      'Species are moving to higher elevations as temperatures rise',
      'Mountains are getting taller',
      'More snow is falling',
    ],
    correctIndex: 1,
    explanation: 'As temperatures rise, plants and animals are moving uphill to find cooler conditions, but they may run out of mountain.',
    difficulty: 'medium',
    standards: {
      ngss: ['MS-LS2-4', 'MS-ESS3-5'], // Ecosystem changes, climate
      epc: ['Principle III', 'Principle V'], // System changes, decisions
    },
  },
];

// Get questions for a specific location
export function getQuestionsForLocation(locationId: string, difficulty?: 'easy' | 'medium' | 'hard'): Question[] {
  let filtered = questions.filter((q) => q.locationId === locationId);
  if (difficulty) {
    filtered = filtered.filter((q) => q.difficulty === difficulty);
  }
  return filtered;
}

// Get random questions for a location
export function getRandomQuestions(locationId: string, count: number): Question[] {
  const locationQuestions = getQuestionsForLocation(locationId);
  const shuffled = [...locationQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
