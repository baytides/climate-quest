'use client';

import { motion } from 'framer-motion';
import { useGameStore, type AgeGroup } from '@/store/gameStore';

const ageOptions: { id: AgeGroup; label: string; grades: string; description: string }[] = [
  {
    id: 'young',
    label: 'Ages 5-7',
    grades: 'Grades K-2',
    description: 'Gentle learning with lots of help',
  },
  {
    id: 'middle',
    label: 'Ages 8-10',
    grades: 'Grades 3-5',
    description: 'Fun challenges with some guidance',
  },
  {
    id: 'older',
    label: 'Ages 11-14',
    grades: 'Grades 6-8',
    description: 'Real stakes and deeper questions',
  },
];

export function OnboardingAge() {
  const { setAgeGroup, reducedMotion } = useGameStore();

  const handleSelect = (age: AgeGroup) => {
    setAgeGroup(age);
  };

  const handleKeyDown = (e: React.KeyboardEvent, age: AgeGroup) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(age);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-emerald-400 flex flex-col items-center justify-center p-8">
      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-4">
          Climate Quest
        </h1>
        <p className="text-xl text-white/90 drop-shadow">
          An adventure to save our ecosystems
        </p>
      </motion.div>

      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/95 rounded-2xl shadow-2xl p-8 max-w-2xl w-full"
        role="region"
        aria-labelledby="age-heading"
      >
        <h2
          id="age-heading"
          className="text-2xl font-bold text-gray-800 text-center mb-6"
        >
          How old are you?
        </h2>
        <p className="text-gray-600 text-center mb-8">
          This helps us adjust the difficulty for you.
        </p>

        <div
          className="grid gap-4"
          role="radiogroup"
          aria-labelledby="age-heading"
        >
          {ageOptions.map((option, index) => (
            <motion.button
              key={option.id}
              initial={reducedMotion ? {} : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              onClick={() => handleSelect(option.id)}
              onKeyDown={(e) => handleKeyDown(e, option.id)}
              className="w-full p-6 rounded-xl border-3 border-gray-200 hover:border-emerald-500
                         focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200
                         bg-white hover:bg-emerald-50 transition-all duration-200
                         text-left group"
              role="radio"
              aria-checked="false"
              tabIndex={0}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-gray-800 group-hover:text-emerald-700">
                    {option.label}
                  </span>
                  <span className="ml-3 text-gray-500">
                    ({option.grades})
                  </span>
                </div>
                <span
                  className="text-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-hidden="true"
                >
                  →
                </span>
              </div>
              <p className="text-gray-600 mt-2">
                {option.description}
              </p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
                   bg-white px-4 py-2 rounded-lg shadow-lg text-emerald-700 font-medium"
      >
        Skip to main content
      </a>
    </div>
  );
}
