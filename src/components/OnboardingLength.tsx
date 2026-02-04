'use client';

import { motion } from 'framer-motion';
import { useGameStore, type GameLength } from '@/store/gameStore';
import { playSfx } from '@/utils/sfx';

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
    playSfx('confirm');
    setGameLength(length);
  };

  const handleKeyDown = (e: React.KeyboardEvent, length: GameLength) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelectLength(length);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 md:p-10">
      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="ui-panel p-8 md:p-10 max-w-5xl w-full"
        role="region"
        aria-labelledby="length-heading"
      >
        <div className="md:grid md:grid-cols-[1.1fr_1.4fr] md:gap-10">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center gap-4 mb-6">
              <motion.span
                initial={reducedMotion ? {} : { rotate: 0 }}
                animate={reducedMotion ? {} : { rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                className="text-5xl"
                aria-hidden="true"
              >
                🌍
              </motion.span>
              <div>
                <h1
                  id="length-heading"
                  className="ui-title text-3xl md:text-4xl font-bold text-[color:var(--ink)]"
                >
                  Climate Quest
                </h1>
                <p className="text-[color:var(--ocean)] font-semibold">
                  An Ecosystem Adventure
                </p>
              </div>
            </div>

            <p className="text-[color:var(--ink-soft)] text-lg leading-relaxed">
              Chart your route like a field scientist. Each journey length explores different ecosystems,
              introduces new hazards, and unlocks deeper understanding.
            </p>

            <div className="mt-6 ui-card p-4">
              <p className="text-sm text-[color:var(--ink-soft)]">
                <span className="font-semibold text-[color:var(--ink)]">Learning focus:</span> ecosystems,
                resource limits, and human impact. Every choice shapes the landscape.
              </p>
            </div>
          </div>

          <div role="radiogroup" aria-labelledby="length-heading" className="ui-grid">
            {GAME_LENGTH_OPTIONS.map((option, index) => (
              <motion.button
                key={option.length}
                initial={reducedMotion ? {} : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => handleSelectLength(option.length)}
                onKeyDown={(e) => handleKeyDown(e, option.length)}
                className={`
                  ui-card w-full p-6 text-left transition-all duration-200
                  focus:outline-none hover:translate-y-[-2px]
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
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-bold text-[color:var(--ink)] text-lg">
                        {option.label}
                      </h3>
                      <span className="ui-chip">{option.length} locations</span>
                    </div>
                    <p className="text-[color:var(--ink-soft)] mt-1">
                      {option.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3 text-sm">
                      <span className="ui-chip">
                        <span aria-hidden="true">⏱️</span>
                        {option.duration}
                      </span>
                      <span className="ui-chip">
                        <span aria-hidden="true">🗺️</span>
                        {option.ecosystems}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
