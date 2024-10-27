function handleKeyDown (event, player, enemy) {
    if (!player.dead) {
        switch (event.key) {
            case 'a':
                player.movements.moveLeft.pressed = true;
                player.lastKey = 'moveLeft';
                break;
            case 'd':
                player.movements.moveRight.pressed = true;
                player.lastKey = 'moveRight';
                break;
            case 'w':
                player.movements.jump.pressed = true;
                player.lastKey = 'jump';
                break;
            case ' ':
                player.attack();
                break;    
        }
    }
    if (!enemy.dead) {
        switch (event.key) {
            case 'ArrowLeft':
                enemy.movements.moveLeft.pressed = true;
                enemy.lastKey = 'moveLeft';
                break;
            case 'ArrowRight':
                enemy.movements.moveRight.pressed = true;
                enemy.lastKey = 'moveRight';
                break;
            case 'ArrowUp':
                enemy.movements.jump.pressed = true;
                enemy.lastKey = 'jump';
                break;    
            case '+':
                enemy.attack();
                break;     
        }
    }
}

function handleKeyUp (event, player, enemy) {
    if (!player.dead) {
        switch (event.key) {
            case 'a':
                player.movements.moveLeft.pressed = false;
                break;
            case 'd':
                player.movements.moveRight.pressed = false;
                break;
            case 'w':
                player.movements.jump.pressed = false;
                break;
        }
    }
    if (!enemy.dead) {
        switch (event.key) {
            case 'ArrowLeft':
                enemy.movements.moveLeft.pressed = false;
                break;
            case 'ArrowRight':
                enemy.movements.moveRight.pressed = false;
                break;
            case 'ArrowUp':
                enemy.movements.jump.pressed = false;
                break;
                
        }
    }
}

export function addKeyListeners(fighters) {
    let player = fighters.player;
    let enemy = fighters.enemy;
    window.addEventListener("keydown", (event) => handleKeyDown(event, player, enemy));
    window.addEventListener("keyup", (event) => handleKeyUp(event, player, enemy));
}