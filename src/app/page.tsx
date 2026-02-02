'use client';

import { useGameStore } from '@/store/gameStore';
import { OnboardingAge } from '@/components/OnboardingAge';
import { OnboardingCompanion } from '@/components/OnboardingCompanion';
import { GameScreen } from '@/components/GameScreen';
import { GameOver } from '@/components/GameOver';
import { Victory } from '@/components/Victory';

export default function Home() {
  const { phase } = useGameStore();

  return (
    <>
      {phase === 'onboarding-age' && <OnboardingAge />}
      {phase === 'onboarding-companion' && <OnboardingCompanion />}
      {phase === 'playing' && <GameScreen />}
      {phase === 'game-over' && <GameOver />}
      {phase === 'victory' && <Victory />}
    </>
  );
}
