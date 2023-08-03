import { Enemy } from './enemy.js';
import { EnemyTypes } from './enemyTypes.js';
import { RandomGenerator } from './randomGenerator.js';
import { Platforms } from './platforms.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { Mover } from './mover.js';
import { Emitter } from './emitter.js';
import { Chaser } from './chaser.js';
import { GameState } from './gameState.js';
import { AudioManager } from './audioManager.js';

export class Boss3 extends Enemy {
    static SPEED = 3.25;
    static STATES = {
        PACING: 0,
        SPAWN_MINION_1: 1,
        SPAWN_MINION_2: 2,
        SPAWN_MINION_3: 3,
        SPAWN_MINION_4: 4,
    };

    constructor(game, x, y, spriteIdle) {
        super(
            game,
            x,
            y,
            SpriteLibrary.SIZES.BOSS_3.width,
            SpriteLibrary.SIZES.BOSS_3.height,
            EnemyTypes.BOSS,
            spriteIdle,
            true,
            3
        );

        this.state = Boss3.STATES.PACING;

        this.spriteIdle = spriteIdle;
        this.spriteShoot = SpriteLibrary.boss3Shoot();
        this.sprites = [this.spriteIdle, this.spriteShoot];

        this.mover = new Mover(game, this);
        this.mover.pace(Boss3.SPEED);
        this.mover.setCollideWith({
            platforms: true,
            walls: true,
            ceiling: true,
        });

        this.emitter = new Emitter(game, {
            emit: () => {
                this.toggleState();

                if (this.state === Boss3.STATES.PACING) {
                    this.currentSprite = this.spriteIdle;
                    if (this.y + this.height > game.player.y + game.player.height) {
                        this.mover.jump();
                    } else {
                        this.mover.drop();
                    }
                } else if (
                    this.state === Boss3.STATES.SPAWN_MINION_1 ||
                    this.state === Boss3.STATES.SPAWN_MINION_2 ||
                    this.state === Boss3.STATES.SPAWN_MINION_3 ||
                    this.state === Boss3.STATES.SPAWN_MINION_4
                ) {
                    if (this.state === Boss3.STATES.SPAWN_MINION_1) {
                        this.currentSprite = this.spriteShoot;
                    }
                    this.currentSprite.reset();
                    this.spriteShoot.setOnReachedEnd(() => {
                        if (this.game.state === GameState.PLAYING) {
                            const minion = Chaser.spawn(
                                game,
                                this.x,
                                this.y + this.height - SpriteLibrary.SIZES.CHASER.height
                            );
                            game.enemies.push(minion);
                            this.spriteShoot.setOnReachedEnd(null);
                        }
                    });
                }
            },
            randomDelays: { min: 600, max: 1000 },
        });
    }

    update() {
        super.update();
        if (this.isDead || this.game.state !== GameState.PLAYING) {
            return;
        }

        this.mover.update();
        this.emitter.update();
    }

    handleShot() {
        const wasShot = super.handleShot();
        if (wasShot && !this.isDead) {
            this.game.audioManager.play(AudioManager.SOUNDS[`BOSS_3_SHOT_${this.health}`]);
        }
    }

    toggleState() {
        this.state = (this.state + 1) % Object.keys(Boss3.STATES).length;
    }

    static spawn(game) {
        const x = RandomGenerator.randomIntBetween(
            1,
            game.canvas.width - SpriteLibrary.SIZES.BOSS_3.width - 1
        );
        const y = Platforms.getPlatformYs()[0] - SpriteLibrary.SIZES.BOSS_3.height;
        return new Boss3(game, x, y, SpriteLibrary.boss3Idle());
    }
}
