import { useGameStore } from '@/store/gameStore';

type SfxName = 'click' | 'confirm' | 'deny' | 'success';

const SFX_PATHS: Record<SfxName, string> = {
  click: '/audio/sfx/ui-click.wav',
  confirm: '/audio/sfx/ui-confirm.wav',
  deny: '/audio/sfx/ui-deny.wav',
  success: '/audio/sfx/ui-success.wav',
};

export function playSfx(name: SfxName, volume = 0.4) {
  const { soundEnabled } = useGameStore.getState();
  if (!soundEnabled) return;

  const audio = new Audio(SFX_PATHS[name]);
  audio.volume = volume;
  audio.play().catch(() => {});
}
