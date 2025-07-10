// Canvas 
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
let gameRunning = false;
let gameOver = false;
let currentWave = 1;
let enemiesInWave = 3;
let enemiesLeft = 3;
let honorPoints = 0;
let totalKills = 0;
let frameCount = 0;
let gameStartTime = 0;
let comboCounter = 0;
let lastKillTime = 0;

let heroKilled = 0;
let irysCollected = 0;

window.heroKilled = heroKilled;
window.irysCollected = irysCollected;

let gameInitialized = false;
let audioEnabled = false;

// Game objects
let enemies = [];
let particles = [];
let slashEffects = [];
let projectiles = [];
let irysTexts = [];
let irysParticles = [];
let sakuraParticles = [];
let powerSpheres = [];
let foodDrops = [];
let floatingHealthTexts = [];

// Keys object
const keys = {
    left: false,
    right: false,
    a: false,
    d: false
};

// Player object
const player = {
    x: typeof CONFIG !== 'undefined' ? CONFIG.player.x : 400,
    y: typeof CONFIG !== 'undefined' ? CONFIG.player.y : 300,
    width: typeof CONFIG !== 'undefined' ? CONFIG.player.width : 50,
    height: typeof CONFIG !== 'undefined' ? CONFIG.player.height : 50,
    speed: typeof CONFIG !== 'undefined' ? CONFIG.player.speed : 3,
    health: typeof CONFIG !== 'undefined' ? CONFIG.player.health : 100,
    maxHealth: typeof CONFIG !== 'undefined' ? CONFIG.player.maxHealth : 100,
    attackCooldown: 0,
    facing: typeof CONFIG !== 'undefined' ? CONFIG.player.facing : 'right',
    isAttacking: false,
    invulnerable: 0,
    moving: false,
    lastAttackTime: 0,
    animationFrame: 0,
    animationTimer: 0,
    buffs: {
        shield: {
            active: false,
            timer: 0
        },
        attack: {
            active: false,
            timer: 0
        }
    },
    shieldAura: null,
    attackAura: null
};

let previousShieldState = false;
let previousAttackState = false;


function alignPlayerToGround() {
    if (typeof CONFIG !== 'undefined' && CONFIG.ground && CONFIG.player) {
        player.y = CONFIG.ground.y - player.height - CONFIG.player.groundOffset;
        console.log(`🎯 Player aligned: y=${player.y}`);
    }
}

// Audio 
function initGameAudio() {
    try {
        console.log('🎵 Initializing audio...');

        if (typeof ASSETS === 'undefined' || !ASSETS.audio) {
            console.log('⚠️ ASSETS not defined, skipping audio init');
            return;
        }

        if (!window.backgroundMusic) {
            window.backgroundMusic = new Audio();
            window.backgroundMusic.loop = false;
            window.backgroundMusic.volume = 0.3;
            window.backgroundMusic.src = ASSETS.audio.backgroundMusic;
            
            window.backgroundMusic.addEventListener('canplaythrough', () => {
                audioEnabled = true;
                if (typeof AUDIO !== 'undefined') AUDIO.enabled = true;
            });
        }

        if (!window.backgroundMusic2) {
            window.backgroundMusic2 = new Audio();
            window.backgroundMusic2.loop = false;
            window.backgroundMusic2.volume = 0.3;
            window.backgroundMusic2.src = ASSETS.audio.backgroundMusic2;
        }

        if (typeof AUDIO !== 'undefined') {
            AUDIO.musicTracks = [window.backgroundMusic, window.backgroundMusic2];
        }

    } catch (error) {
        console.log('❌ Audio init error:', error);
    }
}

function playBackgroundMusic() {
    if (typeof AUDIO === 'undefined') return;

    if (audioEnabled && AUDIO.enabled && AUDIO.musicTracks && AUDIO.musicTracks.length > 0) {
        const currentTrack = AUDIO.musicTracks[AUDIO.currentTrackIndex || 0];
        if (currentTrack) {
            currentTrack.play().catch(e => console.log('Auto-play blocked'));
            
            currentTrack.addEventListener('ended', () => {
                console.log('🎵 Track ended, switching to next...');
                AUDIO.currentTrackIndex = ((AUDIO.currentTrackIndex || 0) + 1) % AUDIO.musicTracks.length;
                setTimeout(() => {
                    playBackgroundMusic();
                }, 1000);
            });
        }
    }
}

function stopBackgroundMusic() {
    if (typeof AUDIO !== 'undefined' && AUDIO.musicTracks) {
        AUDIO.musicTracks.forEach(track => {
            if (track) track.pause();
        });
    }
}

// Sound function
function playSound(soundName) {
    if (typeof AUDIO === 'undefined' || !audioEnabled || !AUDIO.enabled) return;

    try {
        if (AUDIO[soundName] && typeof AUDIO[soundName].play === 'function') {
            AUDIO[soundName].currentTime = 0;
            AUDIO[soundName].play().catch((error) => {
                console.log(`⚠️ Could not play ${soundName}:`, error.message);
            });
            console.log(`🔊 Playing sound: ${soundName}`);
        } else {
            console.log(`❌ Sound ${soundName} not found or not loaded`);
        }
    } catch (error) {
        console.log(`❌ Error playing ${soundName}:`, error);
    }
}

// UI 
function updateUI() {
    const irysCountEl = document.getElementById('irysCount');
    if (irysCountEl) {
        irysCountEl.textContent = irysCollected;
    }

    const playerHealthEl = document.getElementById('playerHealth');
    const currentWaveEl = document.getElementById('currentWave');
    const heroKilledEl = document.getElementById('heroKilled');

    if (playerHealthEl && typeof player !== 'undefined') {
        playerHealthEl.textContent = player.health;
    }
    if (currentWaveEl && typeof currentWave !== 'undefined') {
        currentWaveEl.textContent = currentWave;
    }
    if (heroKilledEl && typeof heroKilled !== 'undefined') {
        heroKilledEl.textContent = heroKilled;
    }

    if (typeof window.enhancedGameFunctions !== 'undefined' && window.enhancedGameFunctions.updateHeroUI) {
        window.enhancedGameFunctions.updateHeroUI();
    }
}

// Player 
function updatePlayer() {
    player.moving = false;

    if ((keys.left || keys.a) && player.x > 0) {
        player.x -= player.speed;
        player.facing = 'left';
        player.moving = true;
    }

    if ((keys.right || keys.d) && player.x < canvas.width - player.width) {
        player.x += player.speed;
        player.facing = 'right';
        player.moving = true;
    }

    if (player.moving && typeof CONFIG !== 'undefined') {
        player.animationTimer++;
        if (player.animationTimer >= CONFIG.player.animation.frameSpeed) {
            player.animationTimer = 0;
            player.animationFrame = (player.animationFrame + 1) % 2;
        }
    } else {
        player.animationFrame = 0;
        player.animationTimer = 0;
    }

    if (player.attackCooldown > 0) {
        player.attackCooldown--;
    }

    if (player.invulnerable > 0) {
        player.invulnerable--;
    }

    if (typeof CONFIG !== 'undefined' && player.isAttacking && frameCount - player.lastAttackTime > CONFIG.combat.slashEffectDuration) {
        player.isAttacking = false;
    }

    // Shield buff 
    if (player.buffs.shield.active) {
        if (!previousShieldState) {
            console.log('🛡️ Shield aura activated - playing buff sound');
            playSound('buffActivate');
            previousShieldState = true;
            
            if (player.shieldAura && !player.shieldAura.isActive()) {
                player.shieldAura.activate();
                console.log('🛡️ Shield aura activated in updatePlayer');
            }
        }

        player.buffs.shield.timer--;
        if (player.buffs.shield.timer <= 0) {
            player.buffs.shield.active = false;
            previousShieldState = false;
            
            if (player.shieldAura && player.shieldAura.isActive()) {
                player.shieldAura.deactivate();
                console.log('🛡️ Shield aura deactivated - buff expired');
            }
        }
    } else {
        previousShieldState = false;
    }

    // Attack buff 
    if (player.buffs.attack.active) {
        if (!previousAttackState) {
            console.log('⚔️ Attack aura activated - playing buff sound');
            playSound('buffActivate');
            previousAttackState = true;
            
            if (player.attackAura && !player.attackAura.isActive()) {
                player.attackAura.activate();
                console.log('⚔️ Attack aura activated in updatePlayer');
            }
        }

        player.buffs.attack.timer--;
        if (player.buffs.attack.timer <= 0) {
            player.buffs.attack.active = false;
            previousAttackState = false;
            
            if (player.attackAura && player.attackAura.isActive()) {
                player.attackAura.deactivate();
                console.log('⚔️ Attack aura deactivated - buff expired');
            }
        }
    } else {
        previousAttackState = false;
    }

    if (typeof updateShieldAura === 'function') {
        updateShieldAura();
    }

    if (typeof updateAttackAura === 'function') {
        updateAttackAura();
    }
}

// Attack function
function performAttack() {
    if (player.attackCooldown > 0) return;

    player.isAttacking = true;
    player.attackCooldown = typeof CONFIG !== 'undefined' ? CONFIG.player.attackCooldown : 30;
    player.lastAttackTime = frameCount;

    const attackRange = typeof CONFIG !== 'undefined' ? CONFIG.player.attackRange : 80;
    const slashX = player.facing === 'right' ? 
        player.x + player.width : 
        player.x - attackRange;

    if (typeof AnimatedSlashEffect !== 'undefined') {
        slashEffects.push(new AnimatedSlashEffect(
            slashX,
            player.y + player.height / 2,
            player.facing,
            attackRange
        ));
        console.log('🗡️ AnimatedSlashEffect created');
    }

    playSound('swordSlash');

    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;
    const effectiveAttackRange = attackRange * 1.2;

    enemies.forEach(enemy => {
        const enemyCenterX = enemy.x + enemy.width / 2;
        const enemyCenterY = enemy.y + enemy.height / 2;

        const distance = Math.sqrt(
            Math.pow(enemyCenterX - playerCenterX, 2) + 
            Math.pow(enemyCenterY - playerCenterY, 2)
        );

        let inRange = distance <= effectiveAttackRange;

        if (player.facing === 'right') {
            inRange = inRange && (enemyCenterX >= playerCenterX - 50);
        } else {
            inRange = inRange && (enemyCenterX <= playerCenterX + 50);
        }

        if (inRange) {
            const criticalChance = typeof CONFIG !== 'undefined' ? CONFIG.combat.criticalChance : 0.15;
            const isCritical = Math.random() < criticalChance;
            let damage = typeof CONFIG !== 'undefined' ? CONFIG.combat.baseDamage : 50;
            
            if (player.buffs.attack.active && typeof CONFIG !== 'undefined') {
                damage *= CONFIG.player.buffs.attack.multiplier;
            }
            
            if (isCritical && typeof CONFIG !== 'undefined') {
                damage *= CONFIG.combat.criticalMultiplier;
            }
            
            console.log(`🎯 HIT! Distance: ${Math.round(distance)}, Range: ${Math.round(effectiveAttackRange)}, Damage: ${damage}`);
            
            if (enemy.takeDamage && enemy.takeDamage(damage)) {
                enemies.splice(enemies.indexOf(enemy), 1);
                handleEnemyKill(enemy, isCritical);
            }
        } else {
            console.log(`❌ MISS! Distance: ${Math.round(distance)}, Range: ${Math.round(effectiveAttackRange)}`);
        }
    });
}

function handleEnemyKill(enemy, isCritical) {
    totalKills++;

    const enemyCenterX = enemy.x + enemy.width / 2;
    const enemyCenterY = enemy.y + enemy.height / 2;
    const existingItems = [...irysTexts, ...foodDrops];

    if (enemy.type === 'hero') {
        heroKilled++;
        console.log(`🦸 Hero killed! Total: ${heroKilled}`);

        if (typeof window.enhancedGameFunctions !== 'undefined' && window.enhancedGameFunctions.playEnhancedFeedback) {
            window.enhancedGameFunctions.playEnhancedFeedback('heroKilled');
        }

        const bossKills = typeof CONFIG !== 'undefined' ? CONFIG.waves.bossSystem.heroKillsForBoss : 10;
        if (heroKilled % bossKills === 0) {
            console.log(`🚨 Boss condition met! Heroes: ${heroKilled}`);
        }
    }

    const currentTime = Date.now();
    const comboWindow = typeof CONFIG !== 'undefined' ? CONFIG.combat.comboWindow * 16.67 : 2000;
    if (currentTime - lastKillTime < comboWindow) {
        comboCounter++;
    } else {
        comboCounter = 1;
    }
    lastKillTime = currentTime;

    let points = enemy.reward || 10;
    if (comboCounter > 1) {
        points = Math.floor(points * (1 + (comboCounter - 1) * 0.5));
    }

    if (isCritical) {
        points *= 2;
    }

    if (enemy.type === 'hero') {
        points *= 1.5;
    } else if (enemy.type === 'martialHero') {
        points *= 2;
    }

    honorPoints += points;

    // Food 
    let foodDropped = false;

    if (enemy.type === 'hero') {
        const sushiDropChance = typeof CONFIG !== 'undefined' && CONFIG.food ? CONFIG.food.sushi.dropChance : 0.2;
        if (Math.random() < sushiDropChance) {
            if (typeof GameUtils !== 'undefined' && typeof GameUtils.getFoodDropPosition === 'function' && typeof FoodDrop !== 'undefined') {
                const foodPos = GameUtils.getFoodDropPosition(enemyCenterX, enemyCenterY, existingItems);
                foodDrops.push(new FoodDrop(foodPos.x, foodPos.y, 'sushi', enemyCenterX, enemyCenterY));
                foodDropped = true;
                const healAmount = typeof CONFIG !== 'undefined' && CONFIG.food ? CONFIG.food.sushi.healAmount : 25;
                console.log(`🍱 Sushi dropped from hero (+${healAmount} HP healing)`);
            }
        }
    } else if (enemy.type === 'martialHero') {
        const nigiriDropChance = typeof CONFIG !== 'undefined' && CONFIG.food ? CONFIG.food.nigiri.dropChance : 0.3;
        if (Math.random() < nigiriDropChance) {
            if (typeof GameUtils !== 'undefined' && typeof GameUtils.getFoodDropPosition === 'function' && typeof FoodDrop !== 'undefined') {
                const foodPos = GameUtils.getFoodDropPosition(enemyCenterX, enemyCenterY, existingItems);
                foodDrops.push(new FoodDrop(foodPos.x, foodPos.y, 'nigiri', enemyCenterX, enemyCenterY));
                foodDropped = true;
                const healAmount = typeof CONFIG !== 'undefined' && CONFIG.food ? CONFIG.food.nigiri.healAmount : 50;
                console.log(`🍱 Nigiri dropped from martial hero (+${healAmount} HP healing)`);
            }
        }
    }

    if (foodDropped) {
        existingItems.push(...foodDrops.slice(-1));
    }

    // irys
    let irysChance = 0.8;
    let baseIrysValue = 1;
    let bonusIrysValue = 0;
    let isRareIrys = false;

    if (enemy.type === 'hero') {
        irysChance = 0.9;
        baseIrysValue = 1;

        if (Math.random() < 0.4) {
            bonusIrysValue = 1;
        }

        if (Math.random() < 0.15) {
            bonusIrysValue = 2;
            isRareIrys = true;
        }
    } else if (enemy.type === 'martialHero') {
        irysChance = 1.0;
        baseIrysValue = 3;

        if (Math.random() < 0.6) {
            bonusIrysValue = 2;
        }

        if (Math.random() < 0.3) {
            bonusIrysValue = 4;
            isRareIrys = true;
        }
    }

    if (isCritical) {
        bonusIrysValue += 1;
        if (Math.random() < 0.3) {
            isRareIrys = true;
        }
    }

    const totalIrysValue = baseIrysValue + bonusIrysValue;

    if (Math.random() < irysChance) {
        let irysPos = { x: enemyCenterX, y: enemyCenterY };
        if (typeof GameUtils !== 'undefined' && typeof GameUtils.getFoodDropPosition === 'function') {
            irysPos = GameUtils.getFoodDropPosition(enemyCenterX, enemyCenterY, existingItems);
        }

        if (typeof IrysText !== 'undefined') {
            irysTexts.push(new IrysText(
                irysPos.x, 
                irysPos.y - 20, 
                totalIrysValue, 
                isRareIrys,
                irysPos.x,
                irysPos.y
            ));
        }

        const particleCount = Math.min(totalIrysValue + 3, 8);
        for (let i = 0; i < particleCount; i++) {
            if (typeof IrysParticle !== 'undefined') {
                irysParticles.push(new IrysParticle(enemyCenterX, enemyCenterY, isRareIrys));
            }
        }

        console.log(`💎 IRYS created: ${totalIrysValue} (base: ${baseIrysValue}, bonus: ${bonusIrysValue}, rare: ${isRareIrys})`);
    }

    // Sakura 
    let sakuraCount = 8;
    if (typeof CONFIG !== 'undefined' && CONFIG.particles && CONFIG.particles.sakura) {
        sakuraCount = enemy.type === 'martialHero' ? 
            CONFIG.particles.sakura.deathEffectCount : 
            Math.floor(CONFIG.particles.sakura.deathEffectCount * 0.6);
    }

    for (let i = 0; i < sakuraCount; i++) {
        if (typeof SakuraParticle !== 'undefined') {
            sakuraParticles.push(new SakuraParticle(enemyCenterX, enemyCenterY, true));
        }
    }

    const ambientSakuraCount = enemy.type === 'martialHero' ? 12 : 8;
    for (let i = 0; i < ambientSakuraCount; i++) {
        if (typeof SakuraParticle !== 'undefined') {
            sakuraParticles.push(new SakuraParticle(
                enemyCenterX + (Math.random() - 0.5) * 120, 
                enemyCenterY - Math.random() * 60,
                false
            ));
        }
    }

   
    let shieldChance = 0.1;
    let attackChance = 0.1;

    if (typeof CONFIG !== 'undefined' && CONFIG.spheres && CONFIG.spheres.dropChance) {
        shieldChance = CONFIG.spheres.dropChance.shield * 0.6;
        attackChance = CONFIG.spheres.dropChance.attack * 0.6;

        if (enemy.type === 'hero') {
            shieldChance *= 1.3;
            attackChance *= 1.3;
        } else if (enemy.type === 'martialHero') {
            shieldChance *= 1.8;
            attackChance *= 1.8;
        }
    }

    if (typeof EnhancedPowerSphere !== 'undefined') {
        if (Math.random() < shieldChance) {
            powerSpheres.push(new EnhancedPowerSphere(enemyCenterX - 15, enemyCenterY - 10, 'shield'));
        }

        if (Math.random() < attackChance) {
            powerSpheres.push(new EnhancedPowerSphere(enemyCenterX + 15, enemyCenterY - 10, 'attack'));
        }
    } else if (typeof PowerSphere !== 'undefined') {
        if (Math.random() < shieldChance) {
            powerSpheres.push(new PowerSphere(enemyCenterX - 15, enemyCenterY - 10, 'shield'));
        }

        if (Math.random() < attackChance) {
            powerSpheres.push(new PowerSphere(enemyCenterX + 15, enemyCenterY - 10, 'attack'));
        }
    }

    // particles
    if (typeof BloodParticle !== 'undefined') {
        let particleCount = 12;
        if (typeof CONFIG !== 'undefined' && CONFIG.particles && CONFIG.particles.bloodParticles) {
            particleCount = enemy.type === 'martialHero' ? 
                             CONFIG.particles.bloodParticles * 2 : 
                             CONFIG.particles.bloodParticles;
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new BloodParticle(enemyCenterX, enemyCenterY));
        }
    }

    playSound('enemyHit');
}

// Collision 
function checkCollisions() {
    enemies.forEach(enemy => {
        if (enemy.canDamagePlayer && player.invulnerable === 0) {
            
            if (player.buffs.shield.active) {
                console.log('🛡️ Attack blocked by shield!');
                enemy.canDamagePlayer = false;
                return;
            }
            
            player.health -= enemy.damage || 25;
            player.invulnerable = typeof CONFIG !== 'undefined' ? CONFIG.player.invulnerableTime : 60;
            enemy.canDamagePlayer = false;
            
            playSound('playerHit');
            
            console.log(` Player took ${enemy.damage || 25} damage`);
            
            if (typeof BloodParticle !== 'undefined') {
                for (let i = 0; i < 10; i++) {
                    particles.push(new BloodParticle(
                        player.x + player.width / 2,
                        player.y + player.height / 2
                    ));
                }
            }
            
            if (player.health <= 0) {
                endGame();
            }
        }
    });

    // irys
    irysTexts = irysTexts.filter(irysText => {
        if (irysText.checkCollision && irysText.checkCollision(player)) {
            irysCollected += irysText.value;
            window.irysCollected = irysCollected;
            
            console.log(` IRYS collected: +${irysText.value}, Total: ${irysCollected}`);
            
            const irysCountEl = document.getElementById('irysCount');
            if (irysCountEl) {
                irysCountEl.textContent = irysCollected;
            }
            
            updateUI();
            return false;
        }

        return irysText.life > 0;
    });

    // Food 
    foodDrops = foodDrops.filter(food => {
        if (food.checkCollision && food.checkCollision(player)) {
            const healAmount = food.healAmount;
            const oldHealth = player.health;
            player.health = Math.min(player.health + healAmount, player.maxHealth);
            const actualHealing = player.health - oldHealth;
            
            if (typeof FloatingHealthText !== 'undefined') {
                floatingHealthTexts.push(new FloatingHealthText(
                    food.x + food.width/2,
                    food.y,
                    actualHealing
                ));
            }
            
            playSound('foodPickup');
            
            for (let i = 0; i < 6; i++) {
                if (typeof IrysParticle !== 'undefined') {
                    const particle = new IrysParticle(
                        food.x + food.width/2, 
                        food.y + food.height/2, 
                        false
                    );
                    particle.healthParticle = true;
                    irysParticles.push(particle);
                }
            }
            
            console.log(` Food collected: ${food.type} (+${actualHealing} HP healing, Health: ${player.health}/${player.maxHealth})`);
            
            updateUI();
            return false;
        }

        return food.life > 0;
    });

    powerSpheres = powerSpheres.filter(sphere => {
        if (typeof GameUtils !== 'undefined' && GameUtils.isInRange && GameUtils.isInRange(player, sphere, 60)) {
            if (sphere.type === 'shield') {
                player.buffs.shield.active = true;
                player.buffs.shield.timer = typeof CONFIG !== 'undefined' ? CONFIG.player.buffs.shield.duration : 300;
                console.log('Shield activated!');
                
                if (player.shieldAura) {
                    player.shieldAura.activate();
                    console.log('Shield aura manually activated on sphere pickup');
                } else {
                    console.log('Shield aura not found on player');
                }
                
                if (typeof window.enhancedGameFunctions !== 'undefined' && window.enhancedGameFunctions.playEnhancedFeedback) {
                    window.enhancedGameFunctions.playEnhancedFeedback('shieldAuraActivated');
                }
                
            } else if (sphere.type === 'attack') {
                player.buffs.attack.active = true;
                player.buffs.attack.timer = typeof CONFIG !== 'undefined' ? CONFIG.player.buffs.attack.duration : 240;
                console.log(' Attack boost activated!');
                
                if (player.attackAura) {
                    player.attackAura.activate();
                    console.log('Attack aura manually activated on sphere pickup');
                } else {
                    console.log(' Attack aura not found on player');
                }
                
                if (typeof window.enhancedGameFunctions !== 'undefined' && window.enhancedGameFunctions.playEnhancedFeedback) {
                    window.enhancedGameFunctions.playEnhancedFeedback('attackAuraActivated');
                }
            }
            
            return false;
        }

        return sphere.life > 0;
    });
}

// Enemy spawning 
function spawnEnemy() {
    const types = getEnemyTypesForWave(currentWave);
    const type = types[Math.floor(Math.random() * types.length)];

    const side = Math.random() > 0.5 ? 'left' : 'right';
    const x = side === 'left' ? -150 : canvas.width + 50;

    if (typeof Enemy !== 'undefined') {
        const enemy = new Enemy(type, x);
        enemies.push(enemy);
        enemiesLeft--;

        console.log(` Spawned ${type} from ${side} side, enemies left: ${enemiesLeft}`);
    }
}

function getEnemyTypesForWave(wave) {
    if (wave === 1) return ['hero', 'hero'];
    if (wave === 2) return ['hero', 'hero', 'hero'];
    if (wave === 3) return ['hero', 'martialHero'];
    if (wave <= 5) return ['hero', 'hero', 'martialHero'];

    return ['hero', 'martialHero'];
}

function nextWave() {
    currentWave++;
    const baseEnemies = typeof CONFIG !== 'undefined' ? CONFIG.waves.baseEnemies : 3;
    const enemyIncrease = typeof CONFIG !== 'undefined' ? CONFIG.waves.enemyIncrease : 1;
    const maxEnemies = typeof CONFIG !== 'undefined' ? CONFIG.waves.maxEnemies : 8;

    enemiesInWave = Math.min(
        baseEnemies + currentWave * enemyIncrease,
        maxEnemies
    );
    enemiesLeft = enemiesInWave;

    player.health = Math.min(player.health + 25, player.maxHealth);

    console.log(` Wave ${currentWave} started! Enemies: ${enemiesInWave}`);
}


function updateGame() {
    frameCount++;

    updatePlayer();

    const spawnInterval = typeof CONFIG !== 'undefined' ? CONFIG.enemies.spawnInterval : 120;
    if (enemiesLeft > 0 && frameCount % spawnInterval === 0) {
        spawnEnemy();
    }

    if (enemies.length === 0 && enemiesLeft === 0) {
        nextWave();
    }

    enemies.forEach((enemy, index) => {
        try {
            if (enemy && typeof enemy.update === 'function') {
                enemy.update();
            }
        } catch (error) {
            console.log(`❌ Error updating enemy ${index}:`, error);
            enemies.splice(index, 1);
        }
    });

    powerSpheres.forEach(sphere => {
        if (sphere && typeof sphere.update === 'function') {
            sphere.update();
        }
    });

    irysTexts.forEach(irysText => {
        if (irysText && typeof irysText.update === 'function') {
            irysText.update();
        }
    });

    irysParticles.forEach(particle => {
        if (particle && typeof particle.update === 'function') {
            particle.update();
        }
    });

    foodDrops.forEach(food => {
        if (food && typeof food.update === 'function') {
            food.update();
        }
    });

    floatingHealthTexts.forEach(healthText => {
        if (healthText && typeof healthText.update === 'function') {
            healthText.update();
        }
    });

    sakuraParticles.forEach(particle => {
        if (particle && typeof particle.update === 'function') {
            particle.update();
        }
    });

    particles = particles.filter(particle => {
        if (particle && typeof particle.update === 'function') {
            particle.update();
            return particle.life > 0;
        }
        return false;
    });

    slashEffects = slashEffects.filter(effect => {
        try {
            if (effect && typeof effect.update === 'function') {
                effect.update();
                if (typeof effect.isFinished === 'function') {
                    return !effect.isFinished();
                } else {
                    return effect.life > 0;
                }
            }
            return false;
        } catch (error) {
            console.log('❌ Error updating slash effect:', error);
            return false;
        }
    });

    irysParticles = irysParticles.filter(particle => particle.life > 0);
    sakuraParticles = sakuraParticles.filter(particle => particle.life > 0);
    foodDrops = foodDrops.filter(food => food.life > 0);
    floatingHealthTexts = floatingHealthTexts.filter(healthText => healthText.life > 0);

    let spawnRate = 180;
    let spawnCount = 3;
    let extraSpawnRate = 120;
    let extraSpawnCount = 2;

    if (typeof CONFIG !== 'undefined' && CONFIG.particles && CONFIG.particles.sakura) {
        spawnRate = CONFIG.particles.sakura.ambientSpawnRate;
        spawnCount = CONFIG.particles.sakura.ambientCount;
        extraSpawnRate = CONFIG.particles.sakura.extraAmbientSpawnRate || 60;
        extraSpawnCount = CONFIG.particles.sakura.extraAmbientCount || 4;
    }

    if (frameCount % spawnRate === 0) {
        for (let i = 0; i < spawnCount; i++) {
            if (typeof SakuraParticle !== 'undefined') {
                sakuraParticles.push(new SakuraParticle(
                    Math.random() * canvas.width,
                    -20,
                    false
                ));
            }
        }
    }

    if (frameCount % extraSpawnRate === 0) {
        for (let i = 0; i < extraSpawnCount; i++) {
            if (typeof SakuraParticle !== 'undefined') {
                sakuraParticles.push(new SakuraParticle(
                    Math.random() * canvas.width,
                    -20 - Math.random() * 30,
                    false
                ));
            }
        }
    }

    if (frameCount % (spawnRate * 1.5) === 0) {
        for (let i = 0; i < Math.floor(spawnCount * 0.8); i++) {
            if (typeof SakuraParticle !== 'undefined') {
                sakuraParticles.push(new SakuraParticle(
                    -20 + Math.random() * 40,
                    Math.random() * canvas.height * 0.3,
                    false
                ));
            }
        }
    }

    const comboWindow = typeof CONFIG !== 'undefined' ? CONFIG.combat.comboWindow * 16.67 : 2000;
    if (Date.now() - lastKillTime > comboWindow) {
        comboCounter = 0;
    }

    checkCollisions();
    updateUI();
}

// Draw function
function drawGame() {
    try {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (typeof drawBackground === 'function') {
            drawBackground();
        }

        sakuraParticles.forEach(particle => {
            if (!particle.isDeathEffect) {
                try { 
                    if (particle && typeof particle.draw === 'function') {
                        particle.draw(); 
                    }
                } catch (e) {}
            }
        });

        powerSpheres.forEach(sphere => {
            try { 
                if (sphere && typeof sphere.draw === 'function') {
                    sphere.draw(); 
                }
            } catch (e) {}
        });

        foodDrops.forEach(food => {
            try { 
                if (food && typeof food.draw === 'function') {
                    food.draw(); 
                }
            } catch (e) {}
        });

        enemies.forEach((enemy, index) => {
            try {
                if (enemy && typeof enemy.draw === 'function') {
                    enemy.draw();
                }
            } catch (error) {
                console.log(`❌ Error drawing enemy ${index}:`, error);
            }
        });

        if (typeof drawShieldAuraBehindPlayer === 'function') {
            drawShieldAuraBehindPlayer(ctx);
        }

        if (typeof drawAttackAuraBehindPlayer === 'function') {
            drawAttackAuraBehindPlayer(ctx);
        }

        if (typeof drawPlayer === 'function') {
            drawPlayer();
        }

        slashEffects.forEach(effect => {
            try { 
                if (effect && typeof effect.draw === 'function') {
                    effect.draw(); 
                }
            } catch (e) { console.log('❌ Slash draw error:', e); }
        });

        particles.forEach(particle => {
            try { 
                if (particle && typeof particle.draw === 'function') {
                    particle.draw(); 
                }
            } catch (e) {}
        });

        irysTexts.forEach(irysText => {
            try { 
                if (irysText && typeof irysText.draw === 'function') {
                    irysText.draw(); 
                }
            } catch (e) {}
        });

        irysParticles.forEach(particle => {
            try { 
                if (particle && typeof particle.draw === 'function') {
                    particle.draw(); 
                }
            } catch (e) {}
        });

        floatingHealthTexts.forEach(healthText => {
            try { 
                if (healthText && typeof healthText.draw === 'function') {
                    healthText.draw(); 
                }
            } catch (e) {}
        });

        sakuraParticles.forEach(particle => {
            if (particle.isDeathEffect) {
                try { 
                    if (particle && typeof particle.draw === 'function') {
                        particle.draw(); 
                    }
                } catch (e) {}
            }
        });

    } catch (error) {
        console.log('❌ Draw error:', error);
    }
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;

    try {
        updateGame();
        drawGame();
    } catch (error) {
        console.log('❌ Game loop error:', error);
    }

    requestAnimationFrame(gameLoop);
}

// Start game 
function startGame() {
    console.log('🎮 Starting game...');

    if (!audioEnabled) {
        audioEnabled = true;
        if (typeof AUDIO !== 'undefined') AUDIO.enabled = true;
    }

    playBackgroundMusic();

    gameRunning = true;
    gameOver = false;
    currentWave = 1;
    enemiesInWave = typeof CONFIG !== 'undefined' ? CONFIG.waves.baseEnemies : 3;
    enemiesLeft = enemiesInWave;
    player.health = player.maxHealth;
    player.x = typeof CONFIG !== 'undefined' ? CONFIG.player.x : 400;

    alignPlayerToGround();

    player.attackCooldown = 0;
    player.invulnerable = 0;
    player.buffs.shield.active = false;
    player.buffs.shield.timer = 0;
    player.buffs.attack.active = false;
    player.buffs.attack.timer = 0;

    previousShieldState = false;
    previousAttackState = false;

    honorPoints = 0;
    totalKills = 0;
    comboCounter = 0;
    frameCount = 0;
    gameStartTime = Date.now();

    heroKilled = 0;
    irysCollected = 0;

    window.heroKilled = heroKilled;
    window.irysCollected = irysCollected;

    enemies = [];
    particles = [];
    slashEffects = [];
    projectiles = [];
    irysTexts = [];
    irysParticles = [];
    sakuraParticles = [];
    powerSpheres = [];
    foodDrops = [];
    floatingHealthTexts = [];

    const startBtnEl = document.getElementById('startBtn');
    const gameOverScreenEl = document.getElementById('gameOverScreen');
    if (startBtnEl) startBtnEl.style.display = 'none';
    if (gameOverScreenEl) gameOverScreenEl.style.display = 'none';

    gameLoop();

    console.log(' Game started ');
}

function endGame() {
    gameRunning = false;
    gameOver = true;

    stopBackgroundMusic();
    playSound('gameOver');

    if (typeof window.enhancedGameFunctions !== 'undefined' && window.enhancedGameFunctions.updateFinalStats) {
        window.enhancedGameFunctions.updateFinalStats();
    }

    const gameOverScreenEl = document.getElementById('gameOverScreen');
    if (gameOverScreenEl) gameOverScreenEl.style.display = 'flex';

    console.log('Game Over');
}

function restartGame() {
    const startBtnEl = document.getElementById('startBtn');
    if (startBtnEl) startBtnEl.style.display = 'inline-block';

    startGame();
}

function toggleAudio() {
    const audioBtn = document.getElementById('audioBtn');

    if (audioEnabled && typeof AUDIO !== 'undefined' && AUDIO.enabled) {
        audioEnabled = false;
        AUDIO.enabled = false;
        stopBackgroundMusic();

        if (audioBtn) {
            audioBtn.textContent = '🔇 Audio';
            audioBtn.style.opacity = '0.6';
        }
        console.log('Audio disabled');

    } else {
        audioEnabled = true;
        if (typeof AUDIO !== 'undefined') AUDIO.enabled = true;

        if (gameRunning) {
            playBackgroundMusic();
        }

        if (audioBtn) {
            audioBtn.textContent = '🔊 Audio';
            audioBtn.style.opacity = '1';
        }
        console.log('Audio enabled');
    }
}

function startGameSafe() {
    try {
        startGame();
    } catch (error) {
        console.log('❌ Error starting game:', error);
    }
}

function restartGameSafe() {
    try {
        restartGame();
    } catch (error) {
        console.log('❌ Error restarting game:', error);
    }
}

function toggleAudioSafe() {
    try {
        toggleAudio();
    } catch (error) {
        console.log('❌ Error toggling audio:', error);
    }
}

// Input handling
document.addEventListener('keydown', (e) => {
    switch(e.key.toLowerCase()) {
        case 'a': keys.a = true; break;
        case 'd': keys.d = true; break;
        case 'arrowleft': keys.left = true; break;
        case 'arrowright': keys.right = true; break;
    }
});

document.addEventListener('keyup', (e) => {
    switch(e.key.toLowerCase()) {
        case 'a': keys.a = false; break;
        case 'd': keys.d = false; break;
        case 'arrowleft': keys.left = false; break;
        case 'arrowright': keys.right = false; break;
    }
});

canvas.addEventListener('click', (e) => {
    if (!gameRunning || gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    const playerCenterX = player.x + player.width / 2;
    if (mouseX > playerCenterX) {
        player.facing = 'right';
    } else {
        player.facing = 'left';
    }

    performAttack();
});

document.addEventListener('click', () => {
    if (!audioEnabled) {
        audioEnabled = true;
        if (typeof AUDIO !== 'undefined') AUDIO.enabled = true;
        console.log(' Audio enabled by user interaction');

        if (gameRunning && typeof AUDIO !== 'undefined' && AUDIO.musicTracks && AUDIO.musicTracks.length > 0) {
            playBackgroundMusic();
        }
    }
}, { once: true });

function initGame() {
    console.log('Initializing game');

    if (typeof initShieldAuraSystem === 'function') {
        initShieldAuraSystem();
        console.log('Shield aura initialized ');
    } else {
        console.log('Shield aura not found');
    }

    if (typeof initAttackAuraSystem === 'function') {
        initAttackAuraSystem();
        console.log('Attack aura  initialized ');
    } else {
        console.log('Attack aura not found');
    }

    if (typeof initSlashAnimationSystem === 'function') {
        initSlashAnimationSystem();
        console.log(' Slash animation initialized');
    } else {
        console.log('Slash animation not found');
    }

    gameInitialized = true;

    if (!gameRunning && typeof drawStartScreen === 'function') {
        drawStartScreen();
    }

    updateUI();

    console.log('✅ Game initialized');
}

// Export functions
window.startGame = startGame;
window.restartGame = restartGame;
window.toggleAudio = toggleAudio;
window.startGameSafe = startGameSafe;
window.restartGameSafe = restartGameSafe;
window.toggleAudioSafe = toggleAudioSafe;

window.gameController = {
    startGame,
    restartGame,
    toggleAudio,
    startGameSafe,
    restartGameSafe,
    toggleAudioSafe
};

// Debug functions
window.spawnTestHero = function() {
    if (gameRunning && typeof Enemy !== 'undefined') {
        const hero = new Enemy('hero', canvas.width / 2);
        enemies.push(hero);
        console.log('Test Hero spawned');
    } else {
        console.log('Game not running ');
    }
};

window.spawnTestMartialHero = function() {
    if (gameRunning && typeof Enemy !== 'undefined') {
        const boss = new Enemy('martialHero', canvas.width / 2);
        enemies.push(boss);
        console.log(' Test Martial Hero spawned');
    } else {
        console.log('Game not running');
    }
};

window.testShieldAura = function() {
    if (player.shieldAura) {
        player.buffs.shield.active = true;
        player.buffs.shield.timer = 300;
        console.log('🧪 Testing shield aura manually');

        setTimeout(() => {
            player.buffs.shield.active = false;
            player.buffs.shield.timer = 0;
            console.log('Shield aura test completed');
        }, 3000);
    } else {
        console.log('Shield aura not initialized');
    }
};

window.testAttackAura = function() {
    if (player.attackAura) {
        player.buffs.attack.active = true;
        player.buffs.attack.timer = 240;
        console.log('Testing attack aura manually');

        setTimeout(() => {
            player.buffs.attack.active = false;
            player.buffs.attack.timer = 0;
            console.log(' Attack aura test completed');
        }, 3000);
    } else {
        console.log('Attack aura not initialized');
    }
};

window.testSlashEffect = function() {
    if (gameRunning && typeof AnimatedSlashEffect !== 'undefined') {
        const attackRange = typeof CONFIG !== 'undefined' ? CONFIG.player.attackRange : 80;
        const slashX = player.facing === 'right' ? 
            player.x + player.width : 
            player.x - attackRange;

        slashEffects.push(new AnimatedSlashEffect(
            slashX,
            player.y + player.height / 2,
            player.facing,
            attackRange
        ));

        console.log('Test animated slash effect created');
    } else {
        console.log(' Game not running not available');
    }
};

window.spawnTestFood = function() {
    if (gameRunning && typeof FoodDrop !== 'undefined') {
        const playerX = player.x + player.width / 2;
        const playerY = player.y + player.height / 2;

        foodDrops.push(new FoodDrop(playerX - 60, playerY, 'sushi', playerX - 60, playerY));
        foodDrops.push(new FoodDrop(playerX + 60, playerY, 'nigiri', playerX + 60, playerY));

        console.log(' Test food spawned sushi');
    } else {
        console.log('FoodDrop class not defined');
    }
};

window.testHealthText = function() {
    if (gameRunning && typeof FloatingHealthText !== 'undefined') {
        const playerX = player.x + player.width / 2;
        const playerY = player.y + player.height / 2;

        floatingHealthTexts.push(new FloatingHealthText(playerX - 30, playerY - 20, 25));
        floatingHealthTexts.push(new FloatingHealthText(playerX + 30, playerY - 20, 50));

        console.log(' Test floating health created)');
    } else {
        console.log(' Game not FloatingHealthText class not defined');
    }
};

window.damagePlayer = function(amount = 30) {
    if (gameRunning) {
        const oldHealth = player.health;
        player.health = Math.max(player.health - amount, 0);
        const actualDamage = oldHealth - player.health;

        console.log(`Player damaged: -${actualDamage} HP (Health: ${player.health}/${player.maxHealth})`);

        if (player.health === 0) {
            console.log(' Player health  collect food to heal!');
        }

        updateUI();
    } else {
        console.log('Game not running');
    }
};

window.debugFoodHealing = function() {
    console.log('ALANCED FOOD HEALING SYSTEM DEBUG:');

    if (typeof CONFIG !== 'undefined' && CONFIG.food) {
        console.log(`  Sushi healing: ${CONFIG.food.sushi.healAmount} HP (Drop chance: ${CONFIG.food.sushi.dropChance * 100}%)`);
        console.log(`  Nigiri healing: ${CONFIG.food.nigiri.healAmount} HP (Drop chance: ${CONFIG.food.nigiri.dropChance * 100}%)`);
        console.log(`  Sushi size: ${CONFIG.food.sushi.width}x${CONFIG.food.sushi.height}`);
        console.log(`  Nigiri size: ${CONFIG.food.nigiri.width}x${CONFIG.food.nigiri.height}`);
    }

    if (typeof player !== 'undefined') {
        console.log(`  Player health: ${player.health}/${player.maxHealth} HP`);
    }

    if (typeof foodDrops !== 'undefined') {
        console.log(`  Active food drops: ${foodDrops.length}`);

        if (foodDrops.length > 0) {
            console.log('\nACTIVE HEALING FOOD:');
            foodDrops.forEach((food, index) => {
                console.log(`  ${index}: ${food.type} (+${food.healAmount} HP), Life: ${food.life}, Size: ${food.width}x${food.height}`);
            });
        }
    }

    if (typeof floatingHealthTexts !== 'undefined') {
        console.log(`  Active PINK healing texts: ${floatingHealthTexts.length}`);
    }
};

window.spawnMoreSakura = function() {
    if (gameRunning && typeof SakuraParticle !== 'undefined') {
        for (let i = 0; i < 30; i++) {
            sakuraParticles.push(new SakuraParticle(
                Math.random() * canvas.width,
                -20 - Math.random() * 100,
                false
            ));
        }
        console.log('🌸 Extra sakura particles spawned (30 petals)');
    } else {
        console.log('⚠️ Game not running or SakuraParticle class not defined');
    }
};

window.spawnColoredSpheres = function() {
    if (gameRunning && typeof EnhancedPowerSphere !== 'undefined') {
        const playerX = player.x + player.width / 2;
        const playerY = player.y + player.height / 2;

        powerSpheres.push(new EnhancedPowerSphere(playerX - 50, playerY - 30, 'shield'));
        powerSpheres.push(new EnhancedPowerSphere(playerX + 50, playerY - 30, 'attack'));

        console.log('💜 Spawned colored spheres');
    } else {
        console.log('⚠️ Enhanced spheres not available or game not running');
    }
};

// Initialize
initGameAudio();

document.addEventListener('DOMContentLoaded', () => {
    alignPlayerToGround();
    initGame();

    if (typeof loadAllAssets === 'function') {
        loadAllAssets();
    }
});
