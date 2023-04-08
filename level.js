import { Collectable } from "./collectable.js";
import { Game } from "./game.js";
import { Enemy } from "./enemy.js";
import { randomIntBetween } from "./utils.js";

export class Level {
    static ENEMY_SPAWN_DELAY_MS = 2000;

	constructor(canvas, player, collectableCount, collectableProbabilities, platformSprite) {
		this.canvas = canvas;
		this.player = player;
		this.collectableCount = collectableCount;
		this.collectableProbabilities = collectableProbabilities;
        this.platformSprite = platformSprite;
        this.enemySpawnTime = null;
	}

	spawnEnemies(currentEnemies) {
		// Based upon some rules (eg. rolling dice, player's position), spawn 0 or more enemies
        const noEnemyBuffer = 200;
		if (
			currentEnemies.length === 0 &&
			this.player.y < this.canvas.height - noEnemyBuffer &&
            this.player.y > noEnemyBuffer
		) {
            const now = Date.now();
            if (!this.enemySpawnTime || now - this.enemySpawnTime >= Level.ENEMY_SPAWN_DELAY_MS) {
                this.enemySpawnTime = now;
			    currentEnemies.push(Enemy.spawn(this.canvas.width, Game.GRAVITY));
            }
		}
	}

	spawnInitialEnemies() {
        return []; // TODO: spawn platform walkers
	}

	spawnCollectables() {
		// return an array of collectables for the level
		// need things like canvas, player
		let collectables = [];
		for (let i = 0; i < this.collectableCount; i++) {
			let collectable = Collectable.spawn(
				[...collectables, this.player], // Prevent overlapping collectables
				this.canvas,
				this.collectableProbabilities
			);
			collectables.push(collectable);
		}
        return collectables;
	}
}
