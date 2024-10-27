export class Sprite {
    constructor({ 
        window,
        position, 
        imageSrc, 
        scale = 1, 
        framesMax = 1,
        framesCurrent = 0,
        framesElapsed = 0,
        framesHold = 5,
        offset = { x: 0, y: 0 }
    }) {
        this.window = window;
        this.c = this.window.context;
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = framesCurrent;
        this.framesElapsed = framesElapsed;
        this.framesHold = framesHold;
        this.offset = offset;
    }

    draw() {
        this.c.drawImage(
            this.image, 
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,

            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width / this.framesMax) * this.scale, 
            this.image.height * this.scale
        );
    }

    animateFrames() {
        this.framesElapsed ++;
    
        if (this.framesElapsed % this.framesHold == 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0;
            }
        }
    }

    update() {
        this.draw();
        this.animateFrames();
    }
}

export class Fighter extends Sprite {
    constructor({ 
        window,
        physics,
        position, 
        offset = { x: 0, y: 0 }, 
        velocity, 
        imageSrc, 
        scale = 1, 
        framesMax = 1,
        framesCurrent = 0,  
        framesElapsed = 0, 
        framesHold = 5,
        sprites,
        attackBox = {
            offset: {},
            width: undefined,
            height: undefined
        },
        healthBarId,
        attackEndFrame  
    }) {
        super({
            window,
            position,
            imageSrc, 
            scale, 
            framesMax, 
            framesCurrent, 
            framesElapsed, 
            framesHold,
            offset
        })
        this.window = window;
        this.physics = physics;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.movements = {
            moveLeft: {
                pressed: false
            },
            moveRight: {
                pressed: false
            },
            jump: {
                pressed: false
            }
        }
        this.lastkey;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.isAttacking;
        this.health = 100;
        this.sprites = sprites;
        this.dead = false;
        this.healthBarId = healthBarId;
        this.attackEndFrame = attackEndFrame;

        for (let sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
    }

    update() {
        this.draw();
        if (!this.dead) {
            this.animateFrames();
        }
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        // draw attackbox
        // this.c.fillRect(
        //     this.attackBox.position.x, 
        //     this.attackBox.position.y, 
        //     this.attackBox.width, 
        //     this.attackBox.height
        // );

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height >= this.window.canvas.height - this.window.floorOffset) {
            this.velocity.y = 0;
            this.position.y = this.window.canvas.height - this.window.floorOffset - this.height;  
        } else this.velocity.y += this.physics.gravity;
    }

    attack() {
        this.switchSprite("attack1");
        this.isAttacking = true;
    }

    takeHit() {
        this.health -= 20;

        if (this.health <= 0) {
            this.switchSprite('death');
        } else {
            this.switchSprite("takeHit");
        }
    }

    switchSprite(sprite) {
        // give priority to death animation over all others
        if (this.image === this.sprites.death.image) {
            if (this.framesCurrent === this.sprites.death.framesMax - 1) this.dead = true;
            return;
        }
        
        // give priority to attack animation over all others
        if (
            this.image === this.sprites.attack1.image && 
            this.framesCurrent < this.sprites.attack1.framesMax - 1
        ) return;
        
        // give priority to hit animation when take hit
        if (
            this.image == this.sprites.takeHit.image &&
            this.framesCurrent < this.sprites.takeHit.framesMax - 1
        ) return;

        switch (sprite) {
            case "idle":
                if (this.image !== this.sprites.idle.image) {
                    this.framesMax = this.sprites.idle.framesMax;
                    this.image = this.sprites.idle.image;
                    this.framesCurrent = 0;
                }
                break;
            case "run":
                if (this.image !== this.sprites.run.image) {
                    this.framesMax = this.sprites.run.framesMax;
                    this.image = this.sprites.run.image;
                    this.framesCurrent = 0;
                }
                break;
            case "jump":
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.framesMax = this.sprites.jump.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case "fall":
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.framesMax = this.sprites.fall.framesMax;
                    this.framesCurrent = 0;
                }
                break;                
            case "attack1":
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image;
                    this.framesMax = this.sprites.attack1.framesMax;
                    this.framesCurrent = 0;
                }
                break;      
            case "takeHit":
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image;
                    this.framesMax = this.sprites.takeHit.framesMax;
                    this.framesCurrent = 0;
                }
                break;                   
            case "death":
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image;
                    this.framesMax = this.sprites.death.framesMax;
                    this.framesCurrent = 0;
                }
                break;         
        }
    }
}