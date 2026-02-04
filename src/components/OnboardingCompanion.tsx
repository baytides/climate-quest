'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore, type Companion } from '@/store/gameStore';
import { companions, getRandomMessage } from '@/data/companions';
import { playSfx } from '@/utils/sfx';

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
    playSfx('click');
    setSelectedCompanion(id);
    const companion = companions[id];
    setGreeting(getRandomMessage(companion, 'greetings'));
  };

  const handleConfirm = () => {
    if (selectedCompanion) {
      playSfx('confirm');
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-10">
      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="ui-panel p-8 md:p-10 max-w-5xl w-full"
        role="region"
        aria-labelledby="companion-heading"
      >
        <h1
          id="companion-heading"
          className="ui-title text-3xl md:text-4xl font-bold text-[color:var(--ink)] text-center mb-2"
        >
          Choose Your Companion
        </h1>
        <p className="text-[color:var(--ink-soft)] text-center mb-8">
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
                ui-card p-4 border-2 transition-all duration-200
                focus:outline-none
                ${
                  selectedCompanion === companion.id
                    ? 'border-[color:var(--sun)] bg-[color:var(--sand)] scale-105'
                    : 'border-transparent hover:border-[color:var(--ocean)]'
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
              <h3 className="font-bold text-[color:var(--ink)] text-lg">
                {companion.name}
              </h3>
              <p className="text-sm text-[color:var(--ink-soft)]">
                {companion.species}
              </p>
              <p className="text-xs text-[color:var(--ink-soft)]/80 mt-1">
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
            className="ui-card p-6 mb-8"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-4">
              <span className="text-5xl flex-shrink-0" aria-hidden="true">
                {COMPANION_EMOJI[selectedCompanion]}
              </span>
              <div>
                <p className="font-medium text-[color:var(--ocean)]">
                  {companions[selectedCompanion].name} says:
                </p>
                <p className="text-[color:var(--ink)] text-lg mt-1">
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
              ui-button px-8 py-4 text-xl transition-all duration-200
              focus:outline-none
              ${
                selectedCompanion
                  ? 'bg-[color:var(--forest)] text-white'
                  : 'bg-[color:var(--sand)] text-[color:var(--ink-soft)] cursor-not-allowed'
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
