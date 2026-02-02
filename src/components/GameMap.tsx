'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { locations } from '@/data/locations';
import { companions } from '@/data/companions';

const LOCATION_ICONS: Record<string, string> = {
  start: '🏖️',
  wetlands: '🌿',
  forest: '🌲',
  river: '🌊',
  mountains: '⛰️',
};

const LOCATION_COLORS: Record<string, { bg: string; border: string }> = {
  start: { bg: 'bg-amber-100', border: 'border-amber-400' },
  wetlands: { bg: 'bg-teal-100', border: 'border-teal-400' },
  forest: { bg: 'bg-green-100', border: 'border-green-500' },
  river: { bg: 'bg-blue-100', border: 'border-blue-400' },
  mountains: { bg: 'bg-slate-100', border: 'border-slate-400' },
};

const COMPANION_EMOJI: Record<string, string> = {
  crab: '🦀',
  otter: '🦦',
  seal: '🦭',
  pelican: '🐦',
};

interface GameMapProps {
  onLocationClick?: (locationId: string) => void;
}

export function GameMap({ onLocationClick }: GameMapProps) {
  const { currentLocationIndex, companion, reducedMotion } = useGameStore();
  const [companionPosition, setCompanionPosition] = useState({ x: 0, y: 0 });

  // Update companion position when location changes
  useEffect(() => {
    const currentLocation = locations[currentLocationIndex];
    if (currentLocation) {
      // Positions are percentages for responsive layout
      const positions: Record<string, { x: number; y: number }> = {
        start: { x: 10, y: 70 },
        wetlands: { x: 28, y: 50 },
        forest: { x: 48, y: 35 },
        river: { x: 68, y: 50 },
        mountains: { x: 85, y: 25 },
      };
      setCompanionPosition(positions[currentLocation.id] || { x: 10, y: 70 });
    }
  }, [currentLocationIndex]);

  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-xl"
      style={{
        background: 'linear-gradient(180deg, #87CEEB 0%, #B0E0E6 40%, #90EE90 40%, #228B22 100%)',
      }}
      role="img"
      aria-label="Game map showing your journey through different ecosystems"
    >
      {/* Sky decorations */}
      <div className="absolute top-4 right-8 text-6xl opacity-80" aria-hidden="true">☀️</div>
      <div className="absolute top-12 left-1/4 text-4xl opacity-60" aria-hidden="true">☁️</div>
      <div className="absolute top-8 left-1/2 text-3xl opacity-50" aria-hidden="true">☁️</div>

      {/* Path connecting locations */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M 10,70 Q 20,60 28,50 Q 38,42 48,35 Q 58,42 68,50 Q 78,38 85,25"
          fill="none"
          stroke="#8B4513"
          strokeWidth="4"
          strokeDasharray="8,8"
          strokeLinecap="round"
          opacity="0.5"
          style={{
            transform: 'scale(1)',
            transformOrigin: 'center',
          }}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Location nodes */}
      {locations.map((location, index) => {
        const isCompleted = index < currentLocationIndex;
        const isCurrent = index === currentLocationIndex;
        const isLocked = index > currentLocationIndex;
        const colors = LOCATION_COLORS[location.id];

        // Position percentages
        const positions: Record<string, { left: string; top: string }> = {
          start: { left: '10%', top: '70%' },
          wetlands: { left: '28%', top: '50%' },
          forest: { left: '48%', top: '35%' },
          river: { left: '68%', top: '50%' },
          mountains: { left: '85%', top: '25%' },
        };

        const pos = positions[location.id];

        return (
          <motion.button
            key={location.id}
            initial={reducedMotion ? {} : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
            onClick={() => !isLocked && onLocationClick?.(location.id)}
            disabled={isLocked}
            className={`
              absolute transform -translate-x-1/2 -translate-y-1/2
              w-16 h-16 rounded-full border-4 flex items-center justify-center
              text-3xl shadow-lg transition-all duration-200
              focus:outline-none focus:ring-4 focus:ring-yellow-400
              ${colors.bg} ${colors.border}
              ${isLocked ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer hover:scale-110'}
              ${isCurrent ? 'ring-4 ring-yellow-400 ring-offset-2' : ''}
              ${isCompleted ? 'bg-green-200 border-green-500' : ''}
            `}
            style={{ left: pos.left, top: pos.top }}
            aria-label={`${location.name}${isCompleted ? ' (completed)' : isCurrent ? ' (current)' : isLocked ? ' (locked)' : ''}`}
            aria-current={isCurrent ? 'location' : undefined}
          >
            {isCompleted ? '✓' : LOCATION_ICONS[location.id]}
          </motion.button>
        );
      })}

      {/* Location labels */}
      {locations.map((location, index) => {
        const positions: Record<string, { left: string; top: string }> = {
          start: { left: '10%', top: '82%' },
          wetlands: { left: '28%', top: '62%' },
          forest: { left: '48%', top: '47%' },
          river: { left: '68%', top: '62%' },
          mountains: { left: '85%', top: '37%' },
        };
        const pos = positions[location.id];

        return (
          <div
            key={`label-${location.id}`}
            className="absolute transform -translate-x-1/2 bg-white/90 px-2 py-1 rounded-lg text-sm font-medium text-gray-700 shadow"
            style={{ left: pos.left, top: pos.top }}
            aria-hidden="true"
          >
            {location.name}
          </div>
        );
      })}

      {/* Companion character */}
      {companion && (
        <motion.div
          className="absolute text-5xl transform -translate-x-1/2 drop-shadow-lg"
          style={{ top: `${companionPosition.y - 12}%` }}
          animate={{
            left: `${companionPosition.x}%`,
            y: reducedMotion ? 0 : [0, -5, 0],
          }}
          transition={{
            left: { duration: 0.8, ease: 'easeInOut' },
            y: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
          }}
          aria-label={`${companions[companion].name} the ${companions[companion].species}`}
        >
          {COMPANION_EMOJI[companion]}
        </motion.div>
      )}

      {/* Progress indicator */}
      <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg px-3 py-2 shadow">
        <p className="text-sm font-medium text-gray-700">
          Location {currentLocationIndex + 1} of {locations.length}
        </p>
      </div>
    </div>
  );
}
