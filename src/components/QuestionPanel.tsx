'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { companions, getRandomMessage } from '@/data/companions';
import type { Question } from '@/data/locations';

const COMPANION_EMOJI: Record<string, string> = {
  crab: '🦀',
  otter: '🦦',
  seal: '🦭',
  pelican: '🐦',
};

interface QuestionPanelProps {
  question: Question;
  onAnswer: (correct: boolean) => void;
  onComplete: () => void;
  questionsRemaining: number;
}

export function QuestionPanel({
  question,
  onAnswer,
  onComplete,
  questionsRemaining,
}: QuestionPanelProps) {
  const { companion, reducedMotion, ageGroup } = useGameStore();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [companionMessage, setCompanionMessage] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);

  const companionData = companion ? companions[companion] : null;

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setCompanionMessage('');
  }, [question.id]);

  // Focus result when shown for screen readers
  useEffect(() => {
    if (showResult && resultRef.current) {
      resultRef.current.focus();
    }
  }, [showResult]);

  const handleSelectAnswer = (index: number) => {
    if (showResult) return;

    setSelectedAnswer(index);
    const isCorrect = index === question.correctIndex;

    // Get companion reaction
    if (companionData) {
      const messageType = isCorrect ? 'correctResponses' : 'incorrectResponses';
      setCompanionMessage(getRandomMessage(companionData, messageType));
    }

    setShowResult(true);
    onAnswer(isCorrect);
  };

  const handleContinue = () => {
    if (questionsRemaining <= 1) {
      onComplete();
    } else {
      setSelectedAnswer(null);
      setShowResult(false);
      setCompanionMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelectAnswer(index);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Question header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-500">
          {questionsRemaining} question{questionsRemaining !== 1 ? 's' : ''} remaining
        </span>
        <span
          className={`
            px-3 py-1 rounded-full text-sm font-medium
            ${question.difficulty === 'easy' ? 'bg-green-100 text-green-700' : ''}
            ${question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : ''}
            ${question.difficulty === 'hard' ? 'bg-red-100 text-red-700' : ''}
          `}
        >
          {question.difficulty}
        </span>
      </div>

      {/* Question text */}
      <h2
        className="text-xl font-bold text-gray-800 mb-6"
        id="question-text"
      >
        {question.question}
      </h2>

      {/* Answer options */}
      <div
        className="space-y-3 mb-6"
        role="radiogroup"
        aria-labelledby="question-text"
      >
        {question.answers.map((answer, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.correctIndex;
          const showCorrectness = showResult;

          let buttonClass = 'border-gray-200 bg-white hover:border-emerald-400 hover:bg-emerald-50';
          if (showCorrectness) {
            if (isCorrect) {
              buttonClass = 'border-green-500 bg-green-50';
            } else if (isSelected && !isCorrect) {
              buttonClass = 'border-red-500 bg-red-50';
            } else {
              buttonClass = 'border-gray-200 bg-gray-50 opacity-60';
            }
          } else if (isSelected) {
            buttonClass = 'border-emerald-500 bg-emerald-50';
          }

          return (
            <motion.button
              key={index}
              initial={reducedMotion ? {} : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              onClick={() => handleSelectAnswer(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              disabled={showResult}
              className={`
                w-full p-4 rounded-xl border-2 text-left transition-all duration-200
                focus:ring-4 focus:ring-emerald-200 focus:outline-none
                ${buttonClass}
                ${showResult ? 'cursor-default' : 'cursor-pointer'}
              `}
              role="radio"
              aria-checked={isSelected}
              aria-disabled={showResult}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                    ${showCorrectness && isCorrect ? 'bg-green-500 text-white' : ''}
                    ${showCorrectness && isSelected && !isCorrect ? 'bg-red-500 text-white' : ''}
                    ${!showCorrectness ? 'bg-gray-200 text-gray-600' : ''}
                    ${showCorrectness && !isSelected && !isCorrect ? 'bg-gray-200 text-gray-400' : ''}
                  `}
                  aria-hidden="true"
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span
                  className={`
                    flex-1
                    ${showCorrectness && isCorrect ? 'text-green-800 font-medium' : ''}
                    ${showCorrectness && isSelected && !isCorrect ? 'text-red-800' : ''}
                    ${!showCorrectness || (!isSelected && !isCorrect) ? 'text-gray-700' : ''}
                  `}
                >
                  {answer}
                </span>
                {showCorrectness && isCorrect && (
                  <span className="text-green-600 text-xl" aria-hidden="true">✓</span>
                )}
                {showCorrectness && isSelected && !isCorrect && (
                  <span className="text-red-600 text-xl" aria-hidden="true">✗</span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Result section */}
      {showResult && (
        <motion.div
          ref={resultRef}
          tabIndex={-1}
          initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
          role="status"
          aria-live="polite"
        >
          {/* Explanation */}
          <div
            className={`
              p-4 rounded-xl border-2
              ${selectedAnswer === question.correctIndex
                ? 'bg-green-50 border-green-200'
                : 'bg-amber-50 border-amber-200'
              }
            `}
          >
            <p
              className={`
                font-medium mb-2
                ${selectedAnswer === question.correctIndex ? 'text-green-800' : 'text-amber-800'}
              `}
            >
              {selectedAnswer === question.correctIndex ? '✓ Correct!' : '✗ Not quite right'}
            </p>
            <p className="text-gray-700">
              {question.explanation}
            </p>
          </div>

          {/* Companion reaction */}
          {companionData && companionMessage && companion && (
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <span className="text-3xl flex-shrink-0" aria-hidden="true">
                {COMPANION_EMOJI[companion]}
              </span>
              <div>
                <p className="font-medium text-gray-800">{companionData.name}:</p>
                <p className="text-gray-600">{companionMessage}</p>
              </div>
            </div>
          )}

          {/* Continue button */}
          <button
            onClick={handleContinue}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold
                       rounded-xl transition-colors duration-200
                       focus:ring-4 focus:ring-emerald-300 focus:outline-none"
          >
            {questionsRemaining <= 1 ? 'Complete Location' : 'Next Question'}
          </button>
        </motion.div>
      )}
    </div>
  );
}
