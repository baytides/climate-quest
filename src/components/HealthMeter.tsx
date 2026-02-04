'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export function HealthMeter() {
  const { health, maxHealth, reducedMotion } = useGameStore();
  const percentage = (health / maxHealth) * 100;

  // Determine color based on health level (WCAG AAA contrast ratios)
  let barColor = 'bg-emerald-500';
  let textColor = 'text-emerald-700';
  let bgColor = 'bg-emerald-100';
  let label = 'Healthy';

  if (percentage <= 20) {
    barColor = 'bg-red-600';
    textColor = 'text-red-700';
    bgColor = 'bg-red-100';
    label = 'Critical';
  } else if (percentage <= 40) {
    barColor = 'bg-orange-500';
    textColor = 'text-orange-700';
    bgColor = 'bg-orange-100';
    label = 'Struggling';
  } else if (percentage <= 60) {
    barColor = 'bg-yellow-500';
    textColor = 'text-yellow-700';
    bgColor = 'bg-yellow-100';
    label = 'At Risk';
  } else if (percentage <= 80) {
    barColor = 'bg-lime-500';
    textColor = 'text-lime-700';
    bgColor = 'bg-lime-100';
    label = 'Good';
  }

  return (
    <div
      className="ui-card kenney-card p-4"
      role="region"
      aria-labelledby="health-label"
    >
      <div className="flex items-center justify-between mb-2">
        <span
          id="health-label"
          className={`font-bold ${textColor}`}
        >
          Ecosystem Health
        </span>
        <span
          className={`font-bold ${textColor}`}
          aria-live="polite"
        >
          {Math.round(percentage)}%
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="h-6 bg-[color:var(--sand)] rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Ecosystem health: ${Math.round(percentage)}% - ${label}`}
      >
        <motion.div
          className={`h-full ${barColor} rounded-full`}
          initial={{ width: '100%' }}
          animate={{ width: `${percentage}%` }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Status label */}
      <div className="mt-2 flex items-center gap-2">
        <span
          className={`inline-block w-3 h-3 rounded-full ${barColor}`}
          aria-hidden="true"
        />
        <span className={`text-sm font-medium ${textColor}`}>
          {label}
        </span>
      </div>

      {/* Warning for low health */}
      {percentage <= 20 && (
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 p-3 bg-[color:var(--rose)]/15 rounded-lg border border-[color:var(--rose)]/40"
          role="alert"
          aria-live="assertive"
        >
          <p className="text-[color:var(--clay)] text-sm font-medium">
            ⚠️ Ecosystem in danger! Answer correctly to save it!
          </p>
        </motion.div>
      )}
    </div>
  );
}
