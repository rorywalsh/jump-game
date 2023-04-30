import { Velocity } from './velocity.js';
import { Enemy } from './enemy.js';
import { EnemyTypes } from './enemyTypes.js';
import { Mover } from './mover.js';
import { SpriteLibrary } from './spriteLibrary.js';

export class Bomb extends Enemy {
    static SPAWN_SPEED_X = 3;
    static SPAWN_SPEED_Y = 8;

    constructor(x, y, velocity, sprite) {
        super(
            x,
            y,
            SpriteLibrary.SIZES.BULLET.width,
            SpriteLibrary.SIZES.BULLET.height,
            EnemyTypes.BOMB,
            false
        );
        this.sprite = sprite;
        this.mover = new Mover(this);
        this.mover.setVelocity(velocity);
    }

    render(renderContext) {
        if (this.isOffScreen) {
            return;
        }
        this.sprite.render(renderContext, this.x, this.y);
    }

    update() {
        if (this.isOffScreen) {
            return;
        }
        this.mover.update();
        this.isOffScreen = this.y > 800; // TODO: reference this.game.height
    }

    /*
        verticalDirection = 1 => left to right
        verticalDirection = -1 => right to left
    */
    static spawnFrom(x, y, verticalDirection, sprite) {
        const velocity = new Velocity(verticalDirection * Bomb.SPAWN_SPEED_X, -Bomb.SPAWN_SPEED_Y);
        return new Bomb(x, y, velocity, sprite);
    }
}
