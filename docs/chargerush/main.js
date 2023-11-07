// The title of the game to be displayed on the title screen
title = "Apple Catcher";

// The description, which is also displayed on the title screen
description = `
Collect all \n the Apples
`;

// The array of custom sprites
characters = [
`
c    
c    
c    
cccccc
`,`
  Rgg
RRRRRR
RRRrrR
RRRRrR
RRRRRR
 RRRR
`,`
     c
     c
     c
cccccc
`
];

// Game design variable container
const G = {
	WIDTH: 100,
	HEIGHT: 150,

    STAR_SPEED_MIN: 0.5,
	STAR_SPEED_MAX: 1.0,
    
    PLAYER_FIRE_RATE: 4,
    PLAYER_GUN_OFFSET: 3,

    FBULLET_SPEED: 5,

    ENEMY_MIN_BASE_SPEED: 1.0,
    ENEMY_MAX_BASE_SPEED: 1.5,
    ENEMY_FIRE_RATE: 45,

    EBULLET_SPEED: 1.0,
    EBULLET_ROTATION_SPD: 0.1
};

// Game runtime options
// Refer to the official documentation for all available options
options = {
	viewSize: {x: G.WIDTH, y: G.HEIGHT},
    isCapturing: true,
    isCapturingGameCanvasOnly: true,
    captureCanvasScale: 2,
    seed: 1,
    isPlayingBgm: true,
    isReplayEnabled: true,
    theme: "pixel"
};

// JSDoc comments for typing
/**
 * @typedef {{
 * pos: Vector,
 * speed: number
 * }} Star
 */

/**
 * @type { Star [] }
 */
let stars;

/**
 * @typedef {{
 * pos: Vector,
 * firingCooldown: number,
 * isFiringLeft: boolean
 * }} Player
 */

/**
 * @type { Player }
 */
let player;

/**
* @type { Player }
*/
let player2;

/**
 * @typedef {{
 * pos: Vector
 * }} FBullet
 */

/**
 * @type { FBullet [] }
 */
let fBullets;

/**
 * @typedef {{
 * pos: Vector,
 * firingCooldown: number
 * }} Enemy
 */

/**
 * @type { Enemy [] }
 */
let enemies;

/**
 * @typedef {{
 * pos: Vector,
 * angle: number,
 * rotation: number
 * }} EBullet
 */

/**
 * @type { EBullet [] }
 */
let eBullets;

/**
 * @type { number }
 */
let currentEnemySpeed;

/**
 * @type { number }
 */
let waveCount;

/**
 * @type { number }
 */
let waveFormation;

/**
 * @type { number }
 */
let lives;
/**
 * 
 */

// The game loop function
function update() {
    // The init function running at startup
	if (!ticks) {
		stars = times(20, () => {
            const posX = rnd(0, G.WIDTH);
            const posY = rnd(0, G.HEIGHT);
            return {
                pos: vec(posX, posY),
                speed: rnd(G.STAR_SPEED_MIN, G.STAR_SPEED_MAX)
            };
        });

        player = {
            pos: vec(G.WIDTH * 0.25, G.HEIGHT * 0.5),
            firingCooldown: G.PLAYER_FIRE_RATE,
            isFiringLeft: true
        };
        player2 = {
            pos: vec(G.WIDTH * 0.75, G.HEIGHT * 0.5),
            firingCooldown: G.PLAYER_FIRE_RATE,
            isFiringLeft: true
        };

        fBullets = [];
        enemies = [];
        eBullets = [];

        waveCount = 0;
        lives = 3;
	}

    // Spawning enemies
    if (enemies.length === 0) {
        currentEnemySpeed =
            rnd(G.ENEMY_MIN_BASE_SPEED, G.ENEMY_MAX_BASE_SPEED) * difficulty;
        waveFormation = Math.floor(rnd(0,4));   
        console.log("waveFormation:", waveFormation);
        switch (waveFormation){
            case 1:
                for (let i = 0; i < 9; i++) {
                    const posX = 10 + i*10;
                    const posY = -10 - i*35;
                    enemies.push({
                        pos: vec(posX, posY),
                        firingCooldown: G.ENEMY_FIRE_RATE 
                    });
                }
                break;
            case 2:
                for (let i = 0; i < 9; i++) {
                    const posX = G.WIDTH-10 - i*10;
                    const posY = -10 - i*25;
                    enemies.push({
                        pos: vec(posX, posY),
                        firingCooldown: G.ENEMY_FIRE_RATE 
                    });
                }
                break;

            case 3:
                let temp = 0;
                for (let i = 0; i < 10; i++) {
                    for (let k = 0; k < 2; k++){
                        if (i%2 == 0){
                            const posX = G.WIDTH*0.5 + 20;
                            const posY = -10 - temp*30;
                            enemies.push({
                                pos: vec(posX, posY),
                                firingCooldown: G.ENEMY_FIRE_RATE 
                            });
                        }else{
                            const posX = G.WIDTH*0.5 - 20;
                            const posY = -10 - temp*30;
                            enemies.push({
                                pos: vec(posX, posY),
                                firingCooldown: G.ENEMY_FIRE_RATE 
                            });
                        }
                        temp++;
                    }
                }
                break;

            default:
                for (let i = 0; i < 6; i++) {
                    let posX = 0;
                    if (i %2 == 0){
                        posX = G.WIDTH*0.5 + 20;
                    }else{
                        posX = G.WIDTH*0.5 - 20;
                    }
                    const posY = -10 - i*30;
                    enemies.push({
                        pos: vec(posX, posY),
                        firingCooldown: G.ENEMY_FIRE_RATE 
                    });
                }
        }
        

        waveCount++; // Increase the tracking variable by one
    }

    // Update for Star
    stars.forEach((s) => {
        s.pos.y += s.speed;
        if (s.pos.y > G.HEIGHT) s.pos.y = 0;
        color("light_black");
        box(s.pos, 1);
    });

    // Updating and drawing the player
    player.pos = vec(input.pos.x, G.HEIGHT-20);
    player.pos.clamp(0, G.WIDTH, 0, G.HEIGHT);
    color ("black");
    char("a", player.pos);

    player2.pos = vec(input.pos.x+6, G.HEIGHT-20);
    player2.pos.clamp(0, G.WIDTH, 0, G.HEIGHT);
    color ("black");
    char("c", player2.pos);


    remove(enemies, (e) => {
        e.pos.y += currentEnemySpeed;
        if (e.pos.y >= G.HEIGHT){
            play("explosion");
            lives --;
            play("explosion");
        }
        if (lives <= 0){
            end();
        }


        color("black");
        const isCollidingWithPlayer = char("b", e.pos).isColliding.char.a;
        const isCollidingWithPlayer2 = char("b", e.pos).isColliding.char.c;
        if (isCollidingWithPlayer || isCollidingWithPlayer2) {
            play("select");
            addScore(1, e.pos);
        }
        
        
        return (isCollidingWithPlayer || isCollidingWithPlayer2 ||e.pos.y > G.HEIGHT );
    });
}