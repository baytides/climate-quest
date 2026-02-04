'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { companions, getRandomMessage } from '@/data/companions';

const COMPANION_EMOJI: Record<string, string> = {
  crab: '🦀',
  otter: '🦦',
  seal: '🦭',
  pelican: '🐦',
};

export function Victory() {
  const {
    companion,
    questionsAnswered,
    correctAnswers,
    health,
    maxHealth,
    resetGame,
    reducedMotion,
  } = useGameStore();

  const companionData = companion ? companions[companion] : null;
  const accuracy = questionsAnswered > 0
    ? Math.round((correctAnswers / questionsAnswered) * 100)
    : 0;
  const healthPercent = Math.round((health / maxHealth) * 100);

  // Calculate rating
  let rating = '⭐';
  let ratingText = 'Good Job!';
  if (accuracy >= 90 && healthPercent >= 80) {
    rating = '⭐⭐⭐';
    ratingText = 'Ecosystem Master!';
  } else if (accuracy >= 70 && healthPercent >= 50) {
    rating = '⭐⭐';
    ratingText = 'Great Work!';
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 md:p-10">
      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="ui-panel p-8 max-w-lg w-full text-center"
        role="alertdialog"
        aria-labelledby="victory-title"
        aria-describedby="victory-desc"
      >
        {/* Victory visual */}
        <motion.div
          initial={reducedMotion ? {} : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-6"
        >
          <div className="w-24 h-24 mx-auto bg-[color:var(--sand)] rounded-full flex items-center justify-center">
            <span className="text-5xl" aria-hidden="true">🌍✨</span>
          </div>
        </motion.div>

        <h1
          id="victory-title"
          className="ui-title text-3xl font-bold text-[color:var(--ink)] mb-2"
        >
          Journey Complete!
        </h1>
        <p
          id="victory-desc"
          className="text-[color:var(--ink-soft)] mb-2"
        >
          You saved the ecosystem!
        </p>

        {/* Rating */}
        <div className="mb-6">
          <p className="text-4xl mb-1" aria-label={`Rating: ${rating.length} stars`}>
            {rating}
          </p>
          <p className="text-lg font-medium text-[color:var(--forest)]">{ratingText}</p>
        </div>

        {/* Stats */}
        <div className="ui-card p-4 mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-2xl font-bold text-[color:var(--ink)]">{questionsAnswered}</p>
              <p className="text-xs text-[color:var(--ink-soft)]">Questions</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[color:var(--forest)]">{accuracy}%</p>
              <p className="text-xs text-[color:var(--ink-soft)]">Accuracy</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[color:var(--ocean)]">{healthPercent}%</p>
              <p className="text-xs text-[color:var(--ink-soft)]">Final Health</p>
            </div>
          </div>
        </div>

        {/* Companion celebration */}
        {companionData && companion && (
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="ui-card p-4 mb-6"
          >
            <div className="flex items-start gap-3 text-left">
              <span className="text-4xl flex-shrink-0" aria-hidden="true">
                {COMPANION_EMOJI[companion]}
              </span>
              <div>
                <p className="font-medium text-[color:var(--ocean)]">{companionData.name}:</p>
                <p className="text-[color:var(--ink)]">
                  {getRandomMessage(companionData, 'victoryMessages')}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Play again button */}
        <button
          onClick={resetGame}
          className="ui-button w-full py-4 bg-[color:var(--forest)] text-white transition-colors duration-200"
          autoFocus
        >
          Play Again
        </button>
      </motion.div>
    </div>
  );
}
