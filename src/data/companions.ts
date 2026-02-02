import type { Companion } from '@/store/gameStore';

export interface CompanionData {
  id: Companion;
  name: string;
  species: string;
  description: string;
  personality: string;
  color: string;
  greetings: string[];
  correctResponses: string[];
  incorrectResponses: string[];
  hintPrefixes: string[];
  healingMessages: string[];
  victoryMessages: string[];
  defeatMessages: string[];
}

export const companions: Record<Companion, CompanionData> = {
  crab: {
    id: 'crab',
    name: 'Coral',
    species: 'Crab',
    description: 'A cheerful crab who knows all about tide pools and coastal life.',
    personality: 'Enthusiastic and encouraging',
    color: '#FF7043',
    greetings: [
      "Hey there, friend! I'm Coral! Ready to explore?",
      "Welcome! Let's discover some amazing ecosystems together!",
      "*clicks claws excitedly* This is going to be great!",
    ],
    correctResponses: [
      '*clicks claws happily* Great job!',
      "You're amazing at this!",
      'Wow, you really know your stuff!',
      '*does a little crab dance* Perfect!',
    ],
    incorrectResponses: [
      "Oops! That's okay, we're learning together.",
      "Not quite, but don't worry! Let's keep going.",
      '*taps claws thoughtfully* Hmm, that one was tricky.',
      "That's alright! Every mistake helps us learn.",
    ],
    hintPrefixes: [
      'Hmm, I remember seeing something about this in the rocks...',
      'Let me think... I learned this near the tide pools...',
      'Here\'s a hint from your crab friend:',
    ],
    healingMessages: [
      '*clicks claws in celebration* The ecosystem is healing! Great work!',
      "Look! The water's getting cleaner thanks to you!",
      '*happy crab dance* The animals are coming back!',
    ],
    victoryMessages: [
      "WE DID IT! *excited claw clicking* You saved the ecosystem!",
      "You're a true ecosystem hero! The coast is thriving!",
      '*overwhelmed with joy* I knew you could do it!',
    ],
    defeatMessages: [
      '*sad claw drooping* Oh no... but we can try again!',
      "The ecosystem needs help. Let's learn more and try again!",
      "Don't give up! Every great scientist fails before succeeding.",
    ],
  },
  otter: {
    id: 'otter',
    name: 'Oliver',
    species: 'Sea Otter',
    description: 'A playful otter who loves floating and learning about marine life.',
    personality: 'Playful and curious',
    color: '#8B6914',
    greetings: [
      "Ooh ooh! Hi! I'm Oliver! *spins in water* Let's go explore!",
      '*floats on back* Welcome, friend! This is going to be so fun!',
      "Hey hey! Ready for an adventure? I can't wait!",
    ],
    correctResponses: [
      '*does a happy spin* Woohoo! You got it!',
      "Ooh ooh! That's right! You're so smart!",
      '*claps paws together* Amazing!',
      '*floats excitedly* Yes yes yes!',
    ],
    incorrectResponses: [
      '*tilts head* Hmm, not quite, but keep trying!',
      "Oops! That's okay, learning is an adventure!",
      '*floats thoughtfully* That one was sneaky!',
      "No worries! Even I get confused sometimes!",
    ],
    hintPrefixes: [
      'Ooh ooh! I think I floated past something about this...',
      '*taps chin with paw* Let me remember...',
      "Here's what I know from swimming around:",
    ],
    healingMessages: [
      '*happy splashing* Look! The kelp forests are growing back!',
      "Ooh ooh! The fish are returning! *excited spinning*",
      '*floats contentedly* The water feels healthier already!',
    ],
    victoryMessages: [
      '*spins with joy* WE WON! The ecosystem is saved!',
      "You're the BEST! *gives you a kelp high-five*",
      '*floating on back, completely happy* What an amazing journey!',
    ],
    defeatMessages: [
      '*sad floating* Oh no... but we learned so much!',
      "The ecosystem needs more help. Let's try again, okay?",
      "*holds your hand with paw* We'll do better next time!",
    ],
  },
  seal: {
    id: 'seal',
    name: 'Shelly',
    species: 'Harbor Seal',
    description: 'A wise seal who has seen many tides and knows the rhythms of the bay.',
    personality: 'Calm and wise',
    color: '#5D6D7E',
    greetings: [
      "Hello, young explorer. I'm Shelly. Let us learn together.",
      '*peaceful bark* Welcome. The journey ahead will teach us much.',
      "Greetings. I've watched these waters for many years. Let me share what I know.",
    ],
    correctResponses: [
      '*gentle nod* Well done. You understand the ecosystem.',
      'Excellent. Your knowledge grows like the rising tide.',
      '*approving bark* Correct. You are learning well.',
      'Yes. The ecosystem thanks you for your wisdom.',
    ],
    incorrectResponses: [
      '*understanding look* Take your time. The tides teach patience.',
      "Not quite, but every wave brings new learning.",
      '*calm bark* Even the sea makes mistakes sometimes.',
      "Hmm. Let's think about this together.",
    ],
    hintPrefixes: [
      'In my many years, I have learned that...',
      'The tides have taught me this:',
      'Let me share some wisdom:',
    ],
    healingMessages: [
      '*peaceful bark* The bay is healing. You have done well.',
      'I can feel the ecosystem growing stronger. Thank you.',
      '*content sigh* Balance is being restored.',
    ],
    victoryMessages: [
      '*proud bark* You have done what many could not. The ecosystem thrives.',
      'In all my years, I have rarely seen such dedication. Well done.',
      'The waters are clean, the animals are safe. You are a true guardian.',
    ],
    defeatMessages: [
      '*gentle look* The ecosystem struggles, but knowledge grows from failure.',
      "Do not lose hope. Even the longest night ends with dawn.",
      'We will try again. The sea is patient, and so must we be.',
    ],
  },
  pelican: {
    id: 'pelican',
    name: 'Pete',
    species: 'Brown Pelican',
    description: 'A dramatic pelican with stories from the sky and sea.',
    personality: 'Theatrical and storytelling',
    color: '#F5F5DC',
    greetings: [
      '*dramatic wing spread* Greetings, adventurer! I am PETE, explorer of skies and seas!',
      '*lands with flourish* AH! A new friend! Let me tell you of the wonders that await!',
      '*theatrical bow* Welcome, welcome! Our epic journey begins NOW!',
    ],
    correctResponses: [
      '*triumphant wing spread* MAGNIFICENT! You are BRILLIANT!',
      '*swoops with joy* YES! That is EXACTLY right!',
      '*dramatic gasp* Such wisdom! Such knowledge!',
      '*proud strut* I KNEW you had it in you!',
    ],
    incorrectResponses: [
      '*dramatic sigh* Alas! But fear not, for we learn from every stumble!',
      '*comforting wing pat* Ah, a plot twist! But the story continues!',
      '*thoughtful pose* Hmm! Even the best adventurers face challenges!',
      '*encouraging nod* That was a tough one! Onward we go!',
    ],
    hintPrefixes: [
      'From high above, I once spotted the answer to this!',
      '*dramatic pause* Listen closely, for I shall share a secret...',
      'Gather round, for this reminds me of a tale...',
    ],
    healingMessages: [
      '*soars with joy* BEHOLD! The ecosystem RISES again!',
      '*dramatic wing spread* WITNESS the power of knowledge!',
      '*happy diving* The fish return! The waters clear! GLORIOUS!',
    ],
    victoryMessages: [
      '*most dramatic wing spread ever* VICTORY! You are a LEGEND!',
      '*soaring celebration* Stories will be told of this day! YOU have saved us all!',
      '*tearful and proud* Never have I seen such heroism! BRAVO!',
    ],
    defeatMessages: [
      '*dramatic but kind* Alas! But every great hero falls before they rise!',
      '*comforting wing around you* This chapter ends, but the book continues!',
      '*determined look* We shall return! Stronger! Wiser! MORE PREPARED!',
    ],
  },
};

export function getCompanion(id: Companion): CompanionData {
  return companions[id];
}

export function getRandomMessage(
  companion: CompanionData,
  type: 'greetings' | 'correctResponses' | 'incorrectResponses' | 'healingMessages' | 'victoryMessages' | 'defeatMessages'
): string {
  const messages = companion[type];
  return messages[Math.floor(Math.random() * messages.length)];
}
