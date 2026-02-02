'use client';

import { motion } from 'framer-motion';
import { useGameStore, type GameLength } from '@/store/gameStore';

const GAME_LENGTH_OPTIONS: {
  length: GameLength;
  label: string;
  description: string;
  duration: string;
  ecosystems: string;
  icon: string;
}[] = [
  {
    length: 15,
    label: 'Quick Quest',
    description: 'A shorter journey through 3 ecosystems',
    duration: '15-20 minutes',
    ecosystems: 'Coastal, Wetland, Forest',
    icon: '⚡',
  },
  {
    length: 25,
    label: 'Standard Journey',
    description: 'Explore 5 different ecosystems',
    duration: '30-40 minutes',
    ecosystems: 'Coastal, Wetland, Forest, River, Mountain',
    icon: '🌍',
  },
  {
    length: 50,
    label: 'Epic Expedition',
    description: 'The complete adventure through all 10 ecosystems',
    duration: '50-60 minutes',
    ecosystems: 'All ecosystems including Desert, Tundra, Coral, Urban',
    icon: '🏆',
  },
];

export function OnboardingLength() {
  const { setGameLength, reducedMotion } = useGameStore();

  const handleSelectLength = (length: GameLength) => {
    setGameLength(length);
  };

  const handleKeyDown = (e: React.KeyboardEvent, length: GameLength) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelectLength(length);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-400 to-sky-400 flex flex-col items-center justify-center p-8">
      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/95 rounded-2xl shadow-2xl p-8 max-w-3xl w-full"
        role="region"
        aria-labelledby="length-heading"
      >
        {/* Title with globe animation */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <motion.span
            initial={reducedMotion ? {} : { rotate: 0 }}
            animate={reducedMotion ? {} : { rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="text-5xl"
            aria-hidden="true"
          >
            🌍
          </motion.span>
          <div>
            <h1
              id="length-heading"
              className="text-3xl font-bold text-gray-800"
            >
              Climate Quest
            </h1>
            <p className="text-emerald-600 font-medium">An Ecosystem Adventure</p>
          </div>
        </div>

        <p className="text-gray-600 text-center mb-8">
          How long would you like your journey to be?
        </p>

        <div
          className="space-y-4"
          role="radiogroup"
          aria-labelledby="length-heading"
        >
          {GAME_LENGTH_OPTIONS.map((option, index) => (
            <motion.button
              key={option.length}
              initial={reducedMotion ? {} : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => handleSelectLength(option.length)}
              onKeyDown={(e) => handleKeyDown(e, option.length)}
              className={`
                w-full p-6 rounded-xl border-2 text-left transition-all duration-200
                focus:ring-4 focus:ring-emerald-200 focus:outline-none
                border-gray-200 hover:border-emerald-400 bg-white hover:bg-emerald-50
                hover:shadow-lg cursor-pointer
              `}
              role="radio"
              aria-checked={false}
              aria-label={`${option.label}: ${option.description}. Takes about ${option.duration}`}
              tabIndex={0}
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl flex-shrink-0" aria-hidden="true">
                  {option.icon}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 text-lg">
                      {option.label}
                    </h3>
                    <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      {option.length} locations
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">
                    {option.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-1 text-gray-500">
                      <span aria-hidden="true">⏱️</span>
                      {option.duration}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500">
                      <span aria-hidden="true">🗺️</span>
                      {option.ecosystems}
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Educational info */}
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 bg-sky-50 rounded-xl border border-sky-200"
        >
          <p className="text-sm text-sky-700 text-center">
            <span className="font-medium">Learn about ecosystems</span> as you travel through different habitats,
            answer questions, and help your companion protect the environment!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
