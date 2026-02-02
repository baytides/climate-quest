import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class BootScene extends Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    const { width, height } = this.scale;

    // Loading bar
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    // Loading text
    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      fontSize: '20px',
      color: '#ffffff',
    });
    loadingText.setOrigin(0.5);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x4ade80, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    // Load game assets
    this.load.svg('game-map', '/assets/game/game-map.svg', { width: 800, height: 600 });
    this.load.svg('location-marker', '/assets/game/location-marker.svg', { width: 48, height: 48 });
    this.load.svg('companion-crab', '/assets/game/companion-crab.svg', { width: 64, height: 64 });
    this.load.svg('companion-otter', '/assets/game/companion-otter.svg', { width: 64, height: 64 });
    this.load.svg('companion-seal', '/assets/game/companion-seal.svg', { width: 64, height: 64 });
    this.load.svg('companion-pelican', '/assets/game/companion-pelican.svg', { width: 64, height: 64 });
  }

  create() {
    EventBus.emit('boot-complete');
    this.scene.start('MapScene');
  }
}
