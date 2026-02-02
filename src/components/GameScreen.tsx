'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { HealthMeter } from './HealthMeter';
import { QuestionPanel } from './QuestionPanel';
import { GameMap } from './GameMap';
import { locations, getRandomQuestions, type Question } from '@/data/locations';
import { companions, getRandomMessage } from '@/data/companions';

const COMPANION_EMOJI: Record<string, string> = {
  crab: '🦀',
  otter: '🦦',
  seal: '🦭',
  pelican: '🐦',
};

export function GameScreen() {
  const {
    companion,
    currentLocationIndex,
    answerQuestion,
    advanceLocation,
    healHealth,
    reducedMotion,
    gameLength,
  } = useGameStore();

  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [locationComplete, setLocationComplete] = useState(false);
  const [perfectLocation, setPerfectLocation] = useState(true);
  const [showHealing, setShowHealing] = useState(false);

  const currentLocation = locations[currentLocationIndex];
  const companionData = companion ? companions[companion] : null;

  // Load questions when location changes
  useEffect(() => {
    if (currentLocation) {
      const questions = getRandomQuestions(currentLocation.id, 3);
      setCurrentQuestions(questions);
      setCurrentQuestionIndex(0);
      setLocationComplete(false);
      setPerfectLocation(true);
      setShowHealing(false);
    }
  }, [currentLocation]);

  const handleAnswer = (correct: boolean) => {
    answerQuestion(correct);
    if (!correct) {
      setPerfectLocation(false);
    }
  };

  const handleQuestionComplete = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // All questions answered
      setLocationComplete(true);

      // Heal if perfect
      if (perfectLocation && companionData) {
        const healAmount = 15;
        healHealth(healAmount);
        setShowHealing(true);
      }
    }
  };

  const handleAdvanceLocation = () => {
    advanceLocation();
  };

  const currentQuestion = currentQuestions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left side: Game map (70%) */}
      <div className="w-[70%] h-screen p-4">
        <GameMap />
      </div>

      {/* Right side: UI panel (30%) */}
      <div
        className="w-[30%] h-screen overflow-y-auto p-6 bg-gray-50"
        role="main"
        id="main-content"
      >
        {/* Health meter */}
        <div className="mb-6">
          <HealthMeter />
        </div>

        {/* Location info */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            {companion && (
              <span className="text-3xl" aria-hidden="true">
                {COMPANION_EMOJI[companion]}
              </span>
            )}
            <div>
              <h2 className="font-bold text-gray-800">{currentLocation?.name}</h2>
              <p className="text-sm text-gray-500">{currentLocation?.ecosystem} ecosystem</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm">{currentLocation?.description}</p>
        </div>

        {/* Question or completion state */}
        {!locationComplete && currentQuestion ? (
          <QuestionPanel
            question={currentQuestion}
            onAnswer={handleAnswer}
            onComplete={handleQuestionComplete}
            questionsRemaining={currentQuestions.length - currentQuestionIndex}
          />
        ) : locationComplete ? (
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Location Complete!
            </h3>

            {/* Perfect location healing */}
            {showHealing && companionData && (
              <motion.div
                initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-50 rounded-xl p-4 mb-4 border-2 border-emerald-200"
                role="status"
                aria-live="polite"
              >
                <div className="flex items-start gap-3">
                  <span className="text-4xl" aria-hidden="true">
                    {companion && COMPANION_EMOJI[companion]}
                  </span>
                  <div>
                    <p className="font-bold text-emerald-700">
                      Perfect! Ecosystem healed!
                    </p>
                    <p className="text-emerald-600">
                      {getRandomMessage(companionData, 'healingMessages')}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Progress indicator */}
            <div className="mb-6">
              <p className="text-center text-gray-600 mb-2">
                Progress: {currentLocationIndex + 1} / {gameLength}
              </p>
              <div className="w-full h-3 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${((currentLocationIndex + 1) / gameLength) * 100}%` }}
                />
              </div>
            </div>

            {/* Next location button */}
            <button
              onClick={handleAdvanceLocation}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold
                         rounded-xl transition-colors duration-200
                         focus:ring-4 focus:ring-emerald-300 focus:outline-none"
            >
              {currentLocationIndex < gameLength - 1
                ? 'Travel to Next Location'
                : 'Complete Journey'}
            </button>
          </motion.div>
        ) : (
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-gray-500">Loading questions...</p>
          </div>
        )}

        {/* Accessibility controls */}
        <div className="mt-6 p-4 bg-white rounded-xl shadow">
          <h3 className="font-medium text-gray-700 mb-3">Accessibility</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => useGameStore.getState().setReducedMotion(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
              />
              <span className="text-gray-600">Reduce motion</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
