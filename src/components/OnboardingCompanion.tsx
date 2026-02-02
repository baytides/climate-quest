'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore, type Companion } from '@/store/gameStore';
import { companions, getRandomMessage } from '@/data/companions';

const companionList = Object.values(companions);

const COMPANION_EMOJI: Record<string, string> = {
  crab: '🦀',
  otter: '🦦',
  seal: '🦭',
  pelican: '🐦',
};

export function OnboardingCompanion() {
  const { setCompanion, startGame, reducedMotion } = useGameStore();
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null);
  const [greeting, setGreeting] = useState<string>('');

  const handleSelect = (id: Companion) => {
    setSelectedCompanion(id);
    const companion = companions[id];
    setGreeting(getRandomMessage(companion, 'greetings'));
  };

  const handleConfirm = () => {
    if (selectedCompanion) {
      setCompanion(selectedCompanion);
      startGame();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: Companion) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-emerald-400 flex flex-col items-center justify-center p-8">
      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/95 rounded-2xl shadow-2xl p-8 max-w-4xl w-full"
        role="region"
        aria-labelledby="companion-heading"
      >
        <h1
          id="companion-heading"
          className="text-3xl font-bold text-gray-800 text-center mb-2"
        >
          Choose Your Companion
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Your companion will guide you through the journey and help when things get tough.
        </p>

        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          role="radiogroup"
          aria-labelledby="companion-heading"
        >
          {companionList.map((companion, index) => (
            <motion.button
              key={companion.id}
              initial={reducedMotion ? {} : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => handleSelect(companion.id)}
              onKeyDown={(e) => handleKeyDown(e, companion.id)}
              className={`
                p-4 rounded-xl border-3 transition-all duration-200
                focus:ring-4 focus:ring-emerald-200 focus:outline-none
                ${
                  selectedCompanion === companion.id
                    ? 'border-emerald-500 bg-emerald-50 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-emerald-300 bg-white hover:bg-gray-50'
                }
              `}
              role="radio"
              aria-checked={selectedCompanion === companion.id}
              aria-label={`${companion.name} the ${companion.species}: ${companion.description}`}
              tabIndex={0}
            >
              <div className="aspect-square relative mb-3 flex items-center justify-center">
                <span className="text-6xl" aria-hidden="true">
                  {COMPANION_EMOJI[companion.id]}
                </span>
              </div>
              <h3 className="font-bold text-gray-800 text-lg">
                {companion.name}
              </h3>
              <p className="text-sm text-gray-500">
                {companion.species}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {companion.personality}
              </p>
            </motion.button>
          ))}
        </div>

        {/* Companion greeting */}
        {selectedCompanion && greeting && (
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-50 rounded-xl p-6 mb-8 border-2 border-emerald-200"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-4">
              <span className="text-5xl flex-shrink-0" aria-hidden="true">
                {COMPANION_EMOJI[selectedCompanion]}
              </span>
              <div>
                <p className="font-medium text-emerald-800">
                  {companions[selectedCompanion].name} says:
                </p>
                <p className="text-emerald-700 text-lg mt-1">
                  {greeting}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Confirm button */}
        <div className="flex justify-center">
          <button
            onClick={handleConfirm}
            disabled={!selectedCompanion}
            className={`
              px-8 py-4 rounded-xl font-bold text-xl transition-all duration-200
              focus:ring-4 focus:ring-emerald-300 focus:outline-none
              ${
                selectedCompanion
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
            aria-disabled={!selectedCompanion}
          >
            {selectedCompanion ? 'Start Adventure!' : 'Select a Companion'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
