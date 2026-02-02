'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { locations, ecosystemThemes } from '@/data/locations';
import { companions } from '@/data/companions';

const COMPANION_EMOJI: Record<string, string> = {
  crab: '🦀',
  otter: '🦦',
  seal: '🦭',
  pelican: '🐦',
};

// Background gradients for each ecosystem region
const REGION_BACKGROUNDS: Record<string, string> = {
  coastal: 'linear-gradient(180deg, #87CEEB 0%, #F4D03F 30%, #FFE4B5 60%, #4169E1 100%)',
  wetland: 'linear-gradient(180deg, #87CEEB 0%, #90EE90 40%, #228B22 70%, #4682B4 100%)',
  forest: 'linear-gradient(180deg, #87CEEB 0%, #228B22 30%, #006400 70%, #2F4F4F 100%)',
  river: 'linear-gradient(180deg, #87CEEB 0%, #4682B4 40%, #1E90FF 70%, #228B22 100%)',
  mountain: 'linear-gradient(180deg, #87CEEB 0%, #708090 30%, #FFFFFF 60%, #2F4F4F 100%)',
  grassland: 'linear-gradient(180deg, #87CEEB 0%, #F4D03F 30%, #9ACD32 60%, #6B8E23 100%)',
  desert: 'linear-gradient(180deg, #FFD700 0%, #F4A460 40%, #CD853F 70%, #8B4513 100%)',
  tundra: 'linear-gradient(180deg, #E0FFFF 0%, #B0C4DE 40%, #FFFFFF 70%, #87CEEB 100%)',
  coral: 'linear-gradient(180deg, #00CED1 0%, #20B2AA 40%, #48D1CC 70%, #008B8B 100%)',
  urban: 'linear-gradient(180deg, #87CEEB 0%, #708090 40%, #A9A9A9 70%, #228B22 100%)',
};

interface GameMapProps {
  onLocationClick?: (locationId: string) => void;
}

export function GameMap({ onLocationClick }: GameMapProps) {
  const { currentLocationIndex, companion, reducedMotion, gameLength } = useGameStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Get visible locations based on game length
  const visibleLocations = locations.slice(0, gameLength);
  const currentLocation = visibleLocations[currentLocationIndex];
  const currentEcosystem = currentLocation?.ecosystem || 'coastal';

  // Auto-scroll to keep current location visible
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const locationWidth = 120; // Approximate width of each location node
      const scrollTarget = currentLocationIndex * locationWidth - container.clientWidth / 2 + locationWidth / 2;
      container.scrollTo({ left: Math.max(0, scrollTarget), behavior: 'smooth' });
    }
  }, [currentLocationIndex]);

  // Group locations by ecosystem for visual regions
  const getEcosystemRegion = (index: number): string => {
    return visibleLocations[index]?.ecosystem || 'coastal';
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-xl"
      style={{ background: REGION_BACKGROUNDS[currentEcosystem] }}
      role="img"
      aria-label="Game map showing your journey through different ecosystems"
    >
      {/* Sky decorations */}
      <div className="absolute top-4 right-8 text-6xl opacity-80" aria-hidden="true">
        {currentEcosystem === 'desert' ? '🌵' : currentEcosystem === 'tundra' ? '❄️' : '☀️'}
      </div>
      <div className="absolute top-12 left-1/4 text-4xl opacity-60" aria-hidden="true">☁️</div>
      <div className="absolute top-8 left-1/2 text-3xl opacity-50" aria-hidden="true">☁️</div>

      {/* Scrollable path container */}
      <div
        ref={scrollContainerRef}
        className="absolute bottom-0 left-0 right-0 h-[70%] overflow-x-auto overflow-y-hidden scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div
          className="relative h-full flex items-center"
          style={{ width: `${Math.max(visibleLocations.length * 120, 800)}px`, paddingLeft: '60px', paddingRight: '60px' }}
        >
          {/* Path line */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d={`M 60,50% ${visibleLocations.map((_, i) => `L ${60 + i * 120},${50 + Math.sin(i * 0.5) * 15}%`).join(' ')}`}
              fill="none"
              stroke="#8B4513"
              strokeWidth="4"
              strokeDasharray="8,8"
              strokeLinecap="round"
              opacity="0.5"
            />
          </svg>

          {/* Location nodes */}
          {visibleLocations.map((location, index) => {
            const isCompleted = index < currentLocationIndex;
            const isCurrent = index === currentLocationIndex;
            const isLocked = index > currentLocationIndex;
            const theme = ecosystemThemes[location.ecosystem];
            const yOffset = Math.sin(index * 0.5) * 15; // Wavy path

            return (
              <div
                key={location.id}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${60 + index * 120}px`,
                  top: `${50 + yOffset}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <motion.button
                  initial={reducedMotion ? {} : { scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: Math.min(index * 0.02, 0.5), type: 'spring', stiffness: 200 }}
                  onClick={() => !isLocked && onLocationClick?.(location.id)}
                  disabled={isLocked}
                  className={`
                    w-14 h-14 rounded-full border-4 flex items-center justify-center
                    text-2xl shadow-lg transition-all duration-200
                    focus:outline-none focus:ring-4 focus:ring-yellow-400
                    ${theme.bgColor}
                    ${isLocked ? 'opacity-40 cursor-not-allowed grayscale border-gray-400' : 'cursor-pointer hover:scale-110'}
                    ${isCurrent ? 'ring-4 ring-yellow-400 ring-offset-2 border-yellow-500 scale-110' : 'border-gray-300'}
                    ${isCompleted ? 'bg-green-200 border-green-500' : ''}
                  `}
                  aria-label={`${location.name}${isCompleted ? ' (completed)' : isCurrent ? ' (current)' : isLocked ? ' (locked)' : ''}`}
                  aria-current={isCurrent ? 'location' : undefined}
                >
                  {isCompleted ? '✓' : location.icon}
                </motion.button>

                {/* Location label */}
                <div
                  className={`
                    mt-2 px-2 py-1 rounded-lg text-xs font-medium shadow
                    max-w-[100px] text-center truncate
                    ${isCurrent ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' : 'bg-white/90 text-gray-700'}
                    ${isLocked ? 'opacity-50' : ''}
                  `}
                  aria-hidden="true"
                >
                  {location.name}
                </div>
              </div>
            );
          })}

          {/* Companion character */}
          {companion && currentLocation && (
            <motion.div
              className="absolute text-4xl drop-shadow-lg z-10"
              style={{
                top: `${50 + Math.sin(currentLocationIndex * 0.5) * 15 - 12}%`,
              }}
              animate={{
                left: `${60 + currentLocationIndex * 120}px`,
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
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg px-3 py-2 shadow">
        <p className="text-sm font-medium text-gray-700">
          Location {currentLocationIndex + 1} of {gameLength}
        </p>
        <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${((currentLocationIndex + 1) / gameLength) * 100}%` }}
          />
        </div>
      </div>

      {/* Ecosystem indicator */}
      <div className="absolute bottom-4 right-4 bg-white/90 rounded-lg px-3 py-2 shadow">
        <p className="text-xs text-gray-500">Current Region</p>
        <p className="text-sm font-bold flex items-center gap-1">
          <span>{ecosystemThemes[currentEcosystem]?.icon}</span>
          <span className="capitalize">{currentEcosystem}</span>
        </p>
      </div>
    </div>
  );
}
