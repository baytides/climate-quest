'use client';

import { useGameStore } from '@/store/gameStore';
import { OnboardingLength } from '@/components/OnboardingLength';
import { OnboardingCompanion } from '@/components/OnboardingCompanion';
import { GameScreen } from '@/components/GameScreen';
import { GameOver } from '@/components/GameOver';
import { Victory } from '@/components/Victory';

export default function Home() {
  const { phase } = useGameStore();

  return (
    <>
      {phase === 'onboarding-length' && <OnboardingLength />}
      {phase === 'onboarding-companion' && <OnboardingCompanion />}
      {phase === 'playing' && <GameScreen />}
      {phase === 'game-over' && <GameOver />}
      {phase === 'victory' && <Victory />}
    </>
  );
}
