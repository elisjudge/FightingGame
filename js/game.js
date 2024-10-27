import * as config from './config.js';
import * as physics from './physics.js'
import { Sprite, Fighter } from './classes.js';
import { background, shop } from './background-assets.js';
import { player, enemy } from './fighters.js';
import { addKeyListeners } from './input-handlers.js'

export class Game {
    constructor () {
        this.window = new Window();
        this.physics = new Physics();
        this.timer = new Timer();
        this.backgroundObjects = {
            background: this.loadBackground(),
            shop: this.loadShop(),
        };
        this.fighters = {
            player: this.loadFighter(config.IMG_PATH_PLAYER, player),
            enemy: this.loadFighter(config.IMG_PATH_ENEMY, enemy)
        };
        this.keyListener = addKeyListeners(this.fighters);
        this.lastFrameTime = performance.now(); 
        this.fps = 0;
    }

    start() {
        this.startTimer();
        this.animate();
    }

    checkFPS() {
        const now = performance.now(); 
        const delta = now - this.lastFrameTime; 
        this.lastFrameTime = now;
        this.fps = 1000 / delta;
        document.querySelector("#fps").innerText = `FPS: ${Math.round(this.fps)}`;
    }

    addBackgroundShading() {
        this.window.context.fillStyle = "rgba(255, 255, 255, 0.15)";
        this.window.context.fillRect(0, 0, this.window.canvas.width, this.window.canvas.height);
    }

    clearWindow() {
        this.window.context.clearRect(0, 0, this.window.canvas.width, this.window.canvas.height);
    }

    getFrame() {
        window.requestAnimationFrame(() => this.animate());
    }

    refreshBackground() {
        Object.values(this.backgroundObjects).forEach(obj => obj.update());
    }

    refreshFighters() {
        Object.values(this.fighters).forEach(fighter => {
            fighter.update();
            this.moveFighter(fighter);
        });
        this.checkAttacksBetweenFighters();
    }

    checkAttacksBetweenFighters() {
        this.checkAttack(this.fighters.player, this.fighters.enemy);
        this.checkAttack(this.fighters.enemy, this.fighters.player);
    }

    checkAttack(fighter1, fighter2) {
        if (this.physics.attackCollison({
            rectangle1: fighter1,
            rectangle2: fighter2
        }) && 
                fighter1.isAttacking && fighter1.framesCurrent === fighter1.attackEndFrame
        ) {
            fighter2.takeHit();
            fighter1.isAttacking = false;
            console.log(fighter1.attackEndFrame);
            gsap.to(`${fighter2.healthBarId}`, {
                width: `${fighter2.health}%`
            })
        }
        // catch missed attacked
        if (fighter1.isAttacking && fighter1.framesCurrent === fighter1.attackEndFrame) {
            fighter1.isAttacking = false;
        }
    }

    checkWinner() {
        if (this.fighters.enemy.health <= 0 || this.fighters.player.health <= 0) {
            this.determineWinner();
        }
    }

    moveFighter(fighter) {
        fighter.velocity.x = 0;
        if (
            fighter.movements.moveLeft.pressed && 
            ["moveLeft", "jump"].includes(fighter.lastKey) &&
            fighter.position.x > 0
        ) {
            fighter.velocity.x = -this.physics.velocities.move;
            fighter.switchSprite("run");
        } else if (
            fighter.movements.moveRight.pressed && 
            ["moveRight", "jump"].includes(fighter.lastKey) &&
            fighter.position.x < this.window.canvas.width - fighter.width
        ) {
            fighter.velocity.x = this.physics.velocities.move;
            fighter.switchSprite("run");
        } else {
            fighter.switchSprite("idle");
        }
        if (fighter.movements.jump.pressed &&
            ["moveLeft", "moveRight", "jump"].includes(fighter.lastKey) && 
            fighter.position.y + fighter.height === this.window.canvas.height - this.window.floorOffset) {
            fighter.velocity.y = -this.physics.velocities.jump;
        }
        if (fighter.velocity.y < 0) {
            fighter.switchSprite("jump");
        } else if (fighter.velocity.y > 0) {
            fighter.switchSprite("fall");
        }
    }

    animate() {
        this.checkFPS();
        this.clearWindow();
        this.refreshBackground();
        this.addBackgroundShading();
        this.refreshFighters();
        this.checkWinner();
        this.getFrame();
    }

    startTimer() {
        this.decreaseTimer = this.decreaseTimer.bind(this);
        this.decreaseTimer();
        this.timer.timerId = setInterval(this.decreaseTimer, 1000);
    }

    loadBackground() { 
        return (
            new Sprite({
                window: this.window,
                position: background.position,
                imageSrc: `${config.IMAGE_FOLDER}/${background.fileName}` 
            })
        );
    }

    loadFighter(imagePath, model) {
        return (
            new Fighter({
                window: this.window,
                physics: this.physics,
                position: model.position,
                velocity: model.velocity,
                offset: model.offset,
                imageSrc: `${imagePath}/${model.fileName}`,
                framesMax: model.framesMax,
                scale: model.scale,
                sprites: {
                    idle: {
                        imageSrc: `${imagePath}/${model.sprites.idle.fileName}`,
                        framesMax: model.sprites.idle.framesMax
                    },
                    run: {
                        imageSrc: `${imagePath}/${model.sprites.run.fileName}`,
                        framesMax: model.sprites.run.framesMax
                    },
                    jump: {
                        imageSrc: `${imagePath}/${model.sprites.jump.fileName}`,
                        framesMax: model.sprites.jump.framesMax
                    },
                    fall: {
                        imageSrc: `${imagePath}/${model.sprites.fall.fileName}`,
                        framesMax: model.sprites.fall.framesMax
                    },
                    attack1: {
                        imageSrc: `${imagePath}/${model.sprites.attack1.fileName}`,
                        framesMax: model.sprites.attack1.framesMax
                    },
                    takeHit: {
                        imageSrc: `${imagePath}/${model.sprites.takeHit.fileName}`,
                        framesMax: model.sprites.takeHit.framesMax
                    },
                    death: {
                        imageSrc: `${imagePath}/${model.sprites.death.fileName}`,
                        framesMax: model.sprites.death.framesMax
                    }
                },
                attackBox: model.attackBox,
                healthBarId: model.healthBarId,
                attackEndFrame: model.attackEndFrame
            })
        );
    }
    
    loadShop() {
        return (
            new Sprite({
                window: this.window,
                position: shop.position,
                imageSrc: `${config.IMAGE_FOLDER}/${shop.fileName}`, 
                scale: shop.scale,
                framesMax: shop.framesMax
            })
        );
    }

    determineWinner() {
        clearTimeout(this.timer.timerId);
        document.querySelector("#displayText").style.display = "Flex";
    
        if (this.fighters.player.health === this.fighters.enemy.health) {
            document.querySelector("#displayText").innerHTML = "Tie";
        } else if (this.fighters.player.health >= this.fighters.enemy.health) {
            document.querySelector("#displayText").innerHTML = "Player 1 Wins";
        } else if (this.fighters.player.health <= this.fighters.enemy.health) {
            document.querySelector("#displayText").innerHTML = "Enemy Wins";
        }
    }

    decreaseTimer() {
        if (this.timer.timer > 0) {
            document.querySelector("#timer").innerHTML = this.timer.timer; 
            this.timer.timer--; 
        } else {
            clearInterval(this.timer.timerId); 
            this.determineWinner();
        }
    }
}

class Window {
    constructor ({
        canvasWidth = config.CANVASWIDTH,
        canvasHeight = config.CANVASHEIGHT,
    } = {}) {
        this.canvas = document.querySelector("canvas");
        this.context = this.canvas.getContext("2d");
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.floorOffset = config.FLOOROFFSET;
        this.init()
    }
    
    init () {
        this.drawCanvas();
    }

    drawCanvas() {
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

class Physics {
    constructor ({
        gravity = physics.GRAVITY,
        velocities = {
            move: physics.MOVEVELOCITY,
            jump: physics.JUMPVELOCITY
        }
    } = {}) {
        this.gravity = gravity;
        this.velocities = velocities;
    }

    attackCollison({ rectangle1, rectangle2 }) {
        return (
            rectangle1.attackBox.position.x + rectangle1.attackBox.width >= 
            rectangle2.position.x + (rectangle2.width / 10) &&
            rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
            rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
            rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
        );
    }
}

class Timer {
    constructor () {
        this.timer = 60;
        this.timerId = undefined; 
    }
}