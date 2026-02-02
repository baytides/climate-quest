import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

interface LocationNode {
  id: string;
  name: string;
  x: number;
  y: number;
  connections: string[];
}

// Simple linear path of locations
const LOCATIONS: LocationNode[] = [
  { id: 'start', name: 'Coastal Beach', x: 100, y: 450, connections: ['wetlands'] },
  { id: 'wetlands', name: 'Wetlands', x: 250, y: 350, connections: ['start', 'forest'] },
  { id: 'forest', name: 'Redwood Forest', x: 400, y: 280, connections: ['wetlands', 'river'] },
  { id: 'river', name: 'River Delta', x: 550, y: 350, connections: ['forest', 'mountains'] },
  { id: 'mountains', name: 'Mountain Peak', x: 700, y: 200, connections: ['river'] },
];

export class MapScene extends Scene {
  private companion?: Phaser.GameObjects.Sprite;
  private currentLocationIndex = 0;
  private locationMarkers: Map<string, Phaser.GameObjects.Container> = new Map();

  constructor() {
    super('MapScene');
  }

  create() {
    // Background
    this.add.image(400, 300, 'game-map');

    // Draw paths between locations
    this.drawPaths();

    // Create location markers
    this.createLocationMarkers();

    // Create companion at start
    this.createCompanion();

    // Emit ready event
    EventBus.emit('map-ready');

    // Listen for location selection
    EventBus.on('select-location', this.handleLocationSelect.bind(this));
    EventBus.on('set-companion', this.handleSetCompanion.bind(this));
  }

  private drawPaths() {
    const graphics = this.add.graphics();
    graphics.lineStyle(4, 0x8b7355, 0.8);

    LOCATIONS.forEach((location) => {
      location.connections.forEach((connId) => {
        const target = LOCATIONS.find((l) => l.id === connId);
        if (target && location.id < connId) {
          // Draw dotted path
          this.drawDottedLine(graphics, location.x, location.y, target.x, target.y);
        }
      });
    });
  }

  private drawDottedLine(
    graphics: Phaser.GameObjects.Graphics,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) {
    const distance = Phaser.Math.Distance.Between(x1, y1, x2, y2);
    const dots = Math.floor(distance / 20);
    const dx = (x2 - x1) / dots;
    const dy = (y2 - y1) / dots;

    for (let i = 0; i <= dots; i++) {
      graphics.fillStyle(0x8b7355, 0.6);
      graphics.fillCircle(x1 + dx * i, y1 + dy * i, 3);
    }
  }

  private createLocationMarkers() {
    LOCATIONS.forEach((location, index) => {
      const container = this.add.container(location.x, location.y);

      // Marker circle
      const marker = this.add.graphics();
      const isCompleted = index < this.currentLocationIndex;
      const isCurrent = index === this.currentLocationIndex;
      const isAvailable = index <= this.currentLocationIndex;

      // Colors for accessibility (high contrast)
      let fillColor = 0x6b7280; // Gray - locked
      let strokeColor = 0x374151;
      if (isCompleted) {
        fillColor = 0x22c55e; // Green - completed
        strokeColor = 0x15803d;
      } else if (isCurrent) {
        fillColor = 0xfbbf24; // Yellow - current
        strokeColor = 0xd97706;
      }

      marker.fillStyle(fillColor, 1);
      marker.fillCircle(0, 0, 20);
      marker.lineStyle(3, strokeColor, 1);
      marker.strokeCircle(0, 0, 20);

      container.add(marker);

      // Location number for accessibility
      const numberText = this.add.text(0, 0, String(index + 1), {
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        color: '#ffffff',
        fontStyle: 'bold',
      });
      numberText.setOrigin(0.5);
      container.add(numberText);

      // Location name label
      const label = this.add.text(0, 35, location.name, {
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        color: '#1f2937',
        backgroundColor: '#ffffff',
        padding: { x: 8, y: 4 },
      });
      label.setOrigin(0.5, 0);
      container.add(label);

      // Make interactive if available
      if (isAvailable) {
        const hitArea = this.add.circle(0, 0, 25, 0xffffff, 0);
        hitArea.setInteractive({ useHandCursor: true });
        container.add(hitArea);

        hitArea.on('pointerover', () => {
          container.setScale(1.1);
        });

        hitArea.on('pointerout', () => {
          container.setScale(1);
        });

        hitArea.on('pointerdown', () => {
          EventBus.emit('location-clicked', location);
        });
      }

      this.locationMarkers.set(location.id, container);
    });
  }

  private createCompanion() {
    const startLocation = LOCATIONS[this.currentLocationIndex];
    this.companion = this.add.sprite(
      startLocation.x,
      startLocation.y - 40,
      'companion-crab'
    );
    this.companion.setScale(0.8);

    // Gentle bobbing animation
    this.tweens.add({
      targets: this.companion,
      y: startLocation.y - 45,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private handleLocationSelect(locationId: string) {
    const locationIndex = LOCATIONS.findIndex((l) => l.id === locationId);
    if (locationIndex === -1 || locationIndex > this.currentLocationIndex) return;

    const location = LOCATIONS[locationIndex];
    if (this.companion) {
      this.tweens.add({
        targets: this.companion,
        x: location.x,
        y: location.y - 40,
        duration: 500,
        ease: 'Power2',
      });
    }
  }

  private handleSetCompanion(companionType: string) {
    if (this.companion) {
      this.companion.setTexture(`companion-${companionType}`);
    }
  }

  // Called when player completes a location
  public advanceToNextLocation() {
    if (this.currentLocationIndex < LOCATIONS.length - 1) {
      this.currentLocationIndex++;
      const nextLocation = LOCATIONS[this.currentLocationIndex];

      // Move companion
      if (this.companion) {
        this.tweens.add({
          targets: this.companion,
          x: nextLocation.x,
          y: nextLocation.y - 40,
          duration: 1000,
          ease: 'Power2',
        });
      }

      // Rebuild markers to show new state
      this.locationMarkers.forEach((container) => container.destroy());
      this.locationMarkers.clear();
      this.createLocationMarkers();

      EventBus.emit('location-changed', nextLocation);
    } else {
      EventBus.emit('journey-complete');
    }
  }
}
