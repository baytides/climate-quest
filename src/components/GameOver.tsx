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

export function GameOver() {
  const {
    companion,
    questionsAnswered,
    correctAnswers,
    resetGame,
    reducedMotion,
  } = useGameStore();

  const companionData = companion ? companions[companion] : null;
  const accuracy = questionsAnswered > 0
    ? Math.round((correctAnswers / questionsAnswered) * 100)
    : 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 md:p-10">
      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="ui-panel p-8 max-w-lg w-full text-center"
        role="alertdialog"
        aria-labelledby="gameover-title"
        aria-describedby="gameover-desc"
      >
        {/* Sad ecosystem visual */}
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-[color:var(--rose)]/20 rounded-full flex items-center justify-center">
            <span className="text-5xl" aria-hidden="true">🌍💔</span>
          </div>
        </div>

        <h1
          id="gameover-title"
          className="ui-title text-3xl font-bold text-[color:var(--ink)] mb-2"
        >
          Ecosystem Collapsed
        </h1>
        <p
          id="gameover-desc"
          className="text-[color:var(--ink-soft)] mb-6"
        >
          The ecosystem couldn&apos;t survive, but we can learn and try again!
        </p>

        {/* Stats */}
        <div className="ui-card p-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-[color:var(--ink)]">{questionsAnswered}</p>
              <p className="text-sm text-[color:var(--ink-soft)]">Questions Answered</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[color:var(--forest)]">{accuracy}%</p>
              <p className="text-sm text-[color:var(--ink-soft)]">Accuracy</p>
            </div>
          </div>
        </div>

        {/* Companion message */}
        {companionData && companion && (
          <div className="ui-card p-4 mb-6">
            <div className="flex items-start gap-3 text-left">
              <span className="text-4xl flex-shrink-0" aria-hidden="true">
                {COMPANION_EMOJI[companion]}
              </span>
              <div>
                <p className="font-medium text-[color:var(--ocean)]">{companionData.name}:</p>
                <p className="text-[color:var(--ink)]">
                  {getRandomMessage(companionData, 'defeatMessages')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Try again button */}
        <button
          onClick={resetGame}
          className="ui-button w-full py-4 bg-[color:var(--forest)] text-white transition-colors duration-200"
          autoFocus
        >
          Try Again
        </button>
      </motion.div>
    </div>
  );
}
