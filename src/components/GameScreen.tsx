'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { HealthMeter } from './HealthMeter';
import { QuestionPanel } from './QuestionPanel';
import { GameMap } from './GameMap';
import { locations, getRandomQuestions as getLegacyRandomQuestions } from '@/data/locations';
import { companions, getRandomMessage } from '@/data/companions';
import { getRandomQuestionsForLocation } from '@/content';
import type { QuestionLike } from '@/types/questions';
import { playSfx } from '@/utils/sfx';
import { BookOpenIcon } from '@heroicons/react/24/outline';

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
    soundEnabled,
  } = useGameStore();

  const [currentQuestions, setCurrentQuestions] = useState<QuestionLike[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [locationComplete, setLocationComplete] = useState(false);
  const [perfectLocation, setPerfectLocation] = useState(true);
  const [showHealing, setShowHealing] = useState(false);

  const currentLocation = locations[currentLocationIndex];
  const companionData = companion ? companions[companion] : null;

  // Load questions when location changes
  useEffect(() => {
    if (currentLocation) {
      const contentQuestions = getRandomQuestionsForLocation(currentLocation.id, 3);
      const legacyQuestions = getLegacyRandomQuestions(currentLocation.id, 3);
      const merged = [
        ...contentQuestions,
        ...legacyQuestions.filter(
          (legacy) => !contentQuestions.some((q) => q.id === legacy.id),
        ),
      ].slice(0, 3);
      setCurrentQuestions(merged);
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
    playSfx('confirm');
    advanceLocation();
  };

  const currentQuestion = currentQuestions[currentQuestionIndex];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row gap-4 p-4 md:p-6">
      {/* Left side: Game map */}
      <div className="lg:w-[68%] h-[55vh] lg:h-[calc(100vh-3rem)]">
        <GameMap />
      </div>

      {/* Right side: UI panel */}
      <div
        className="lg:w-[32%] lg:h-[calc(100vh-3rem)] overflow-y-auto ui-panel kenney-panel p-6"
        role="main"
        id="main-content"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-soft)]">
              Field Journal
            </p>
            <h2 className="ui-title text-2xl font-bold text-[color:var(--ink)] flex items-center gap-2">
              <BookOpenIcon className="h-6 w-6 text-[color:var(--ocean)]" aria-hidden="true" />
              Journey Log
            </h2>
          </div>
          <span className="ui-chip">Day {currentLocationIndex + 1}</span>
        </div>

        {/* Health meter */}
        <div className="mb-6">
          <HealthMeter />
        </div>

        <div className="kenney-divider mb-6" aria-hidden="true" />

        {/* Location info */}
        <div className="ui-card kenney-card p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            {companion && (
              <span className="text-3xl" aria-hidden="true">
                {COMPANION_EMOJI[companion]}
              </span>
            )}
            <div>
              <h2 className="font-bold text-[color:var(--ink)]">{currentLocation?.name}</h2>
              <p className="text-sm text-[color:var(--ink-soft)] capitalize">
                {currentLocation?.ecosystem} ecosystem
              </p>
            </div>
          </div>
          <p className="text-[color:var(--ink-soft)] text-sm">{currentLocation?.description}</p>
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
            className="ui-card kenney-card p-6"
          >
            <h3 className="text-xl font-bold text-[color:var(--ink)] mb-4 text-center">
              Location Complete!
            </h3>

            {/* Perfect location healing */}
            {showHealing && companionData && (
              <motion.div
                initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="ui-card kenney-card p-4 mb-4"
                role="status"
                aria-live="polite"
              >
                <div className="flex items-start gap-3">
                  <span className="text-4xl" aria-hidden="true">
                    {companion && COMPANION_EMOJI[companion]}
                  </span>
                  <div>
                    <p className="font-bold text-[color:var(--forest)]">
                      Perfect! Ecosystem healed!
                    </p>
                    <p className="text-[color:var(--ink-soft)]">
                      {getRandomMessage(companionData, 'healingMessages')}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Progress indicator */}
            <div className="mb-6">
              <p className="text-center text-[color:var(--ink-soft)] mb-2">
                Progress: {currentLocationIndex + 1} / {gameLength}
              </p>
              <div className="w-full h-3 bg-[color:var(--sand)] rounded-full">
                <div
                  className="h-full bg-[color:var(--ocean)] rounded-full transition-all duration-500"
                  style={{ width: `${((currentLocationIndex + 1) / gameLength) * 100}%` }}
                />
              </div>
            </div>

            {/* Next location button */}
            <button
              onClick={handleAdvanceLocation}
              className="ui-button kenney-button w-full py-4 transition-colors duration-200"
            >
              <span className="inline-flex items-center justify-center gap-2">
                {currentLocationIndex < gameLength - 1
                  ? 'Travel to Next Location'
                  : 'Complete Journey'}
                <img
                  src="/assets/kenney/ui-pack/Green/arrow_decorative_e_small.svg"
                  alt=""
                  aria-hidden="true"
                  className="w-4 h-4"
                />
              </span>
            </button>
          </motion.div>
        ) : (
          <div className="ui-card kenney-card p-6 text-center">
            <p className="text-[color:var(--ink-soft)]">Loading questions...</p>
          </div>
        )}

        {/* Accessibility controls */}
        <div className="mt-6 p-4 ui-card kenney-card">
          <h3 className="font-medium text-[color:var(--ink)] mb-3">Accessibility</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => useGameStore.getState().setReducedMotion(e.target.checked)}
                className="w-5 h-5 rounded border-[color:var(--ink-soft)] text-[color:var(--ocean)]"
              />
              <span className="text-[color:var(--ink-soft)]">Reduce motion</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => useGameStore.getState().setSoundEnabled(e.target.checked)}
                className="w-5 h-5 rounded border-[color:var(--ink-soft)] text-[color:var(--ocean)]"
              />
              <span className="text-[color:var(--ink-soft)]">Sound effects</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
