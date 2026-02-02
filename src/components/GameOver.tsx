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
    <div className="min-h-screen bg-gradient-to-b from-gray-700 to-gray-900 flex items-center justify-center p-8">
      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center"
        role="alertdialog"
        aria-labelledby="gameover-title"
        aria-describedby="gameover-desc"
      >
        {/* Sad ecosystem visual */}
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-5xl" aria-hidden="true">🌍💔</span>
          </div>
        </div>

        <h1
          id="gameover-title"
          className="text-3xl font-bold text-gray-800 mb-2"
        >
          Ecosystem Collapsed
        </h1>
        <p
          id="gameover-desc"
          className="text-gray-600 mb-6"
        >
          The ecosystem couldn&apos;t survive, but we can learn and try again!
        </p>

        {/* Stats */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-gray-800">{questionsAnswered}</p>
              <p className="text-sm text-gray-500">Questions Answered</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{accuracy}%</p>
              <p className="text-sm text-gray-500">Accuracy</p>
            </div>
          </div>
        </div>

        {/* Companion message */}
        {companionData && companion && (
          <div className="bg-amber-50 rounded-xl p-4 mb-6 border border-amber-200">
            <div className="flex items-start gap-3 text-left">
              <span className="text-4xl flex-shrink-0" aria-hidden="true">
                {COMPANION_EMOJI[companion]}
              </span>
              <div>
                <p className="font-medium text-amber-800">{companionData.name}:</p>
                <p className="text-amber-700">
                  {getRandomMessage(companionData, 'defeatMessages')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Try again button */}
        <button
          onClick={resetGame}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold
                     rounded-xl transition-colors duration-200
                     focus:ring-4 focus:ring-emerald-300 focus:outline-none"
          autoFocus
        >
          Try Again
        </button>
      </motion.div>
    </div>
  );
}
