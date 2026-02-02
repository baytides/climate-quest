'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { companions, getRandomMessage } from '@/data/companions';

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
    <div className="min-h-screen bg-gradient-to-b from-emerald-400 to-sky-400 flex items-center justify-center p-8">
      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center"
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
          <div className="w-24 h-24 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
            <span className="text-5xl" aria-hidden="true">🌍✨</span>
          </div>
        </motion.div>

        <h1
          id="victory-title"
          className="text-3xl font-bold text-gray-800 mb-2"
        >
          Journey Complete!
        </h1>
        <p
          id="victory-desc"
          className="text-gray-600 mb-2"
        >
          You saved the ecosystem!
        </p>

        {/* Rating */}
        <div className="mb-6">
          <p className="text-4xl mb-1" aria-label={`Rating: ${rating.length} stars`}>
            {rating}
          </p>
          <p className="text-lg font-medium text-emerald-600">{ratingText}</p>
        </div>

        {/* Stats */}
        <div className="bg-emerald-50 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-2xl font-bold text-gray-800">{questionsAnswered}</p>
              <p className="text-xs text-gray-500">Questions</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{accuracy}%</p>
              <p className="text-xs text-gray-500">Accuracy</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-sky-600">{healthPercent}%</p>
              <p className="text-xs text-gray-500">Final Health</p>
            </div>
          </div>
        </div>

        {/* Companion celebration */}
        {companionData && (
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-yellow-50 rounded-xl p-4 mb-6 border border-yellow-200"
          >
            <div className="flex items-start gap-3 text-left">
              <Image
                src={`/assets/game/companion-${companion}.svg`}
                alt={companionData.name}
                width={48}
                height={48}
                className="flex-shrink-0"
              />
              <div>
                <p className="font-medium text-yellow-800">{companionData.name}:</p>
                <p className="text-yellow-700">
                  {getRandomMessage(companionData, 'victoryMessages')}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Play again button */}
        <button
          onClick={resetGame}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold
                     rounded-xl transition-colors duration-200
                     focus:ring-4 focus:ring-emerald-300 focus:outline-none"
          autoFocus
        >
          Play Again
        </button>
      </motion.div>
    </div>
  );
}
