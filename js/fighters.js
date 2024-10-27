export const player = {
    position: {
        x: 100,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0, 
    },
    offset: {
        x: 215,
        y: 157
    },
    fileName: "Idle.png",
    framesMax: 8,
    scale: 2.5,
    sprites: {
        idle: {
            fileName: "Idle.png",
            framesMax: 8
        },
        run: {
            fileName: "Run.png",
            framesMax: 8
        },
        jump: {
            fileName: "Jump.png",
            framesMax: 2
        },
        fall: {
            fileName: "Fall.png",
            framesMax: 2
        },
        attack1: {
            fileName: "Attack1.png",
            framesMax: 6
        },
        takeHit: {
            fileName: "Take Hit - white silhouette.png",
            framesMax: 4
        },
        death: {
            fileName: "Death.png",
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 160,
        height: 50
    },
    healthBarId: "#playerHealth",
    attackEndFrame: 4
};

export const enemy = {
    position: {
        x: 400,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 215,
        y: 167
    },
    fileName: "Idle.png",
    framesMax: 4,
    scale: 2.5,
    sprites: {
        idle: {
            fileName: "Idle.png",
            framesMax: 4
        },
        run: {
            fileName: "Run.png",
            framesMax: 8
        },
        jump: {
            fileName: "Jump.png",
            framesMax: 2
        },
        fall: {
            fileName: "Fall.png",
            framesMax: 2
        },
        attack1: {
            fileName: "Attack1.png",
            framesMax: 4
        },
        takeHit: {
            fileName: "Take hit.png",
            framesMax: 3
        },
        death: {
            fileName: "Death.png",
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -172,
            y: 50
        },
        width: 172,
        height: 50
    },
    healthBarId: "#enemyHealth",
    attackEndFrame: 2
};