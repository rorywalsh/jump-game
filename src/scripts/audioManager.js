import { SoundHandler } from './soundHandler.js';

export class AudioManager {
    static SOUNDS = {
        BACKGROUND_SONG: {
            url: 'sounds/background.wav',
            volume: 0.07,
            loop: true,
        },
        BOSS_SONG: {
            url: 'sounds/2.ogg',
            volume: 0.35,
            loop: true,
        },
        FINALE_SONG: {
            url: 'sounds/3.ogg',
            volume: 0.2,
            loop: true,
        },
        BOSS_CELEBRATION_SONG: {
            url: 'sounds/4.ogg',
            volume: 0.3,
        },
        SHIELD_SONG: {
            url: 'sounds/5.ogg',
            volume: 0.4,
        },
        GEM_COLLECTED: {
            url: 'sounds/6.ogg',
            volume: 0.1 ,
            preloadCount: 10,
        },
        BIG_BOMB: {
            url: 'sounds/7.ogg',
            volume: 0.025,
        },
        HEALTH_UP: {
            url: 'sounds/8.ogg',
            volume: 0.2,
        },
        PLAYER_JUMP: {
            url: 'sounds/9.ogg',
            volume: 0.08,
            preloadCount: 5,
        },
        PLAYER_DROP: {
            url: 'sounds/2.ogg',
            volume: 0.08,
            preloadCount: 5,
        },
        PLAYER_SHOOT: {
            url: 'sounds/10.ogg',
            volume: 0.16,
            preloadCount: 10,
        },
        LASER_COLLECTED: {
            url: 'sounds/11.ogg',
            volume: 0.08,
        },
        LASER_GUN: {
            url: 'sounds/12.ogg',
            volume: 0.25,
        },
        BOMB: {
            url: 'sounds/13.ogg',
            volume: 0.04,
            preloadCount: 20,
        },
        PLAYER_HIT: {
            url: 'sounds/14.ogg',
            volume: 0.25,
        },
        ENEMY_HIT: {
            url: 'sounds/15.ogg',
            volume: 0.2,
            preloadCount: 20,
        },
        START_BOSS_LEVEL: {
            url: 'sounds/16.ogg',
            volume: 0.18,
        },
        ROBOTIC_DEATH: {
            // Unused, but neat, use for final boss!!
            url: 'sounds/17.ogg',
            volume: 0.2,
        },
        BOSS_SHOT_1: {
            url: 'sounds/18.ogg',
            volume: 0.3,
        },
        BOSS_SHOT_2: {
            url: 'sounds/19.ogg',
            volume: 0.3,
        },
        BOSS_SHOT_4: {
            url: 'sounds/20.ogg',
            volume: 0.3,
        },
        BOSS_4_SHOT_1: {
            url: 'sounds/21.ogg',
            volume: 0.2,
        },
        BOSS_4_SHOT_2: {
            url: 'sounds/22.ogg',
            volume: 0.2,
        },
        BOSS_5_SHOT: {
            url: 'sounds/23.ogg',
            volume: 0.6,
        },
        BOSS_DEAD: {
            url: 'sounds/17.ogg',
            volume: 0.25,
        },
    };

    constructor() {
        this.isMuted = false;
        this.soundHandlers = new Map();
        this.oneShotOnEnded = null;
        Object.keys(AudioManager.SOUNDS).forEach((sound) => {
            this.preloadHandlers(AudioManager.SOUNDS[sound]);
        });
    }

    preloadHandlers(sound) {
        const handlerCount = sound.preloadCount ?? 1;
        const handlers = [];
        for (let i = 0; i < handlerCount; i++) {
            handlers.push(new SoundHandler(sound));
        }
        this.soundHandlers.set(sound.url, handlers);
    }

    play(sound, onEnded = null) {
        const handlers = this.soundHandlers.get(sound.url);
        const availableHandler = handlers && handlers.length ? handlers.find((x) => x.isLoaded && !x.isPlaying) : null;
        if (!availableHandler) {
            const newHandler = new SoundHandler(sound, this.isMuted, true, onEnded);
            this.soundHandlers.set(sound.url, [newHandler]);
            return newHandler;
        }

        availableHandler.play(onEnded);
        return availableHandler;
    }

    mute() {
        this.soundHandlers.forEach((handlers) => {
            handlers.forEach((x) => x.mute());
        });
        this.isMuted = true;
    }

    unmute() {
        this.soundHandlers.forEach((handlers) => {
            handlers.forEach((x) => x.unmute());
        });
        this.isMuted = false;
    }
}
