import { Box } from './box.js';
import { Game } from './game.js';
import { GameState } from './gameState.js';

export class Entity extends Box {
    constructor(game, x, y, width, height) {
        super(x, y, width, height);
        this.game = game;
        this.isOffScreen = false;
    }

    update() {
        if (this.game.state === GameState.LEVEL_TRANSITION) {
            this.y += Game.LEVEL_SCROLL_SPEED;
        }
    }

    onFloor() {
        return this.y + this.height === this.game.canvas.height;
    }
}
