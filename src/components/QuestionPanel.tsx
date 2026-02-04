'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { companions, getRandomMessage } from '@/data/companions';
import type { QuestionLike } from '@/types/questions';
import { playSfx } from '@/utils/sfx';

const COMPANION_EMOJI: Record<string, string> = {
  crab: '🦀',
  otter: '🦦',
  seal: '🦭',
  pelican: '🐦',
};

interface QuestionPanelProps {
  question: QuestionLike;
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
  const { companion, reducedMotion } = useGameStore();
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
    playSfx(isCorrect ? 'success' : 'deny');

    // Get companion reaction
    if (companionData) {
      const messageType = isCorrect ? 'correctResponses' : 'incorrectResponses';
      setCompanionMessage(getRandomMessage(companionData, messageType));
    }

    setShowResult(true);
    onAnswer(isCorrect);
  };

  const handleContinue = () => {
    playSfx('confirm');
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
    <div className="ui-card p-6">
      {/* Question header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-[color:var(--ink-soft)]">
          {questionsRemaining} question{questionsRemaining !== 1 ? 's' : ''} remaining
        </span>
        <span
          className={`
            ui-chip
            ${question.difficulty === 'easy' ? 'bg-[color:var(--sand)] text-[color:var(--forest)]' : ''}
            ${question.difficulty === 'medium' ? 'bg-[color:var(--sun)]/30 text-[color:var(--ink)]' : ''}
            ${question.difficulty === 'hard' ? 'bg-[color:var(--rose)]/20 text-[color:var(--clay)]' : ''}
          `}
        >
          {question.difficulty}
        </span>
      </div>

      {/* Question text */}
      <h2
        className="ui-title text-xl font-bold text-[color:var(--ink)] mb-6"
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

          let buttonClass = 'border-transparent bg-white hover:border-[color:var(--ocean)] hover:bg-[color:var(--sand)]';
          if (showCorrectness) {
            if (isCorrect) {
              buttonClass = 'border-[color:var(--forest)] bg-[color:var(--sand)]';
            } else if (isSelected && !isCorrect) {
              buttonClass = 'border-[color:var(--rose)] bg-[color:var(--rose)]/10';
            } else {
              buttonClass = 'border-transparent bg-[color:var(--cream)] opacity-60';
            }
          } else if (isSelected) {
            buttonClass = 'border-[color:var(--sun)] bg-[color:var(--sand)]';
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
                w-full p-4 rounded-2xl border-2 text-left transition-all duration-200
                focus:outline-none
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
                    ${showCorrectness && isCorrect ? 'bg-[color:var(--forest)] text-white' : ''}
                    ${showCorrectness && isSelected && !isCorrect ? 'bg-[color:var(--rose)] text-white' : ''}
                    ${!showCorrectness ? 'bg-[color:var(--sand)] text-[color:var(--ink)]' : ''}
                    ${showCorrectness && !isSelected && !isCorrect ? 'bg-[color:var(--sand)] text-[color:var(--ink-soft)]' : ''}
                  `}
                  aria-hidden="true"
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span
                  className={`
                    flex-1
                    ${showCorrectness && isCorrect ? 'text-[color:var(--forest)] font-medium' : ''}
                    ${showCorrectness && isSelected && !isCorrect ? 'text-[color:var(--clay)]' : ''}
                    ${!showCorrectness || (!isSelected && !isCorrect) ? 'text-[color:var(--ink)]' : ''}
                  `}
                >
                  {answer}
                </span>
                {showCorrectness && isCorrect && (
                  <img
                    src="/assets/kenney/ui-pack/Green/icon_checkmark.svg"
                    alt=""
                    aria-hidden="true"
                    className="w-5 h-5"
                  />
                )}
                {showCorrectness && isSelected && !isCorrect && (
                  <img
                    src="/assets/kenney/ui-pack/Red/icon_cross.svg"
                    alt=""
                    aria-hidden="true"
                    className="w-5 h-5"
                  />
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
                ? 'bg-[color:var(--sand)] border-[color:var(--forest)]/30'
                : 'bg-[color:var(--sun)]/15 border-[color:var(--clay)]/40'
              }
            `}
          >
            <p
              className={`
                font-medium mb-2
                ${selectedAnswer === question.correctIndex ? 'text-[color:var(--forest)]' : 'text-[color:var(--clay)]'}
              `}
            >
              {selectedAnswer === question.correctIndex ? '✓ Correct!' : '✗ Not quite right'}
            </p>
            <p className="text-[color:var(--ink)]">
              {question.explanation}
            </p>
          </div>

          {/* Companion reaction */}
          {companionData && companionMessage && companion && (
            <div className="flex items-start gap-3 p-4 bg-[color:var(--cream)] rounded-xl">
              <span className="text-3xl flex-shrink-0" aria-hidden="true">
                {COMPANION_EMOJI[companion]}
              </span>
              <div>
                <p className="font-medium text-[color:var(--ink)]">{companionData.name}:</p>
                <p className="text-[color:var(--ink-soft)]">{companionMessage}</p>
              </div>
            </div>
          )}

          {/* Continue button */}
          <button
            onClick={handleContinue}
            className="ui-button w-full py-4 bg-[color:var(--forest)] text-white transition-colors duration-200"
          >
            {questionsRemaining <= 1 ? 'Complete Location' : 'Next Question'}
          </button>
        </motion.div>
      )}
    </div>
  );
}
