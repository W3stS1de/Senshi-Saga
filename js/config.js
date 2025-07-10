const CONFIG = {
    canvas: {
        width: 900,
        height: 500
    },

    player: {
        x: 450,       
        y: 320,       
        width: 120,        
        height: 140,      
        speed: 5,
        attackCooldown: 30,
        attackRange: 160,
        maxHealth: 130,
        health: 100,
        facing: 'right',
        invulnerableTime: 45,
        
        groundOffset: -20,
        
        animation: {
            frameSpeed: 8,
            runFrames: 2,
            currentFrame: 0,
            frameTimer: 0
        },
        
        buffs: {
            shield: {
                duration: 300,
                active: false,
                timer: 0
            },
            attack: {
                duration: 240,
                multiplier: 2.0,
                active: false,
                timer: 0
            }
        }
    },

    combat: {
        comboWindow: 120,
        comboMultiplier: 1.5,
        slashEffectDuration: 18,
        criticalChance: 0.2,
        criticalMultiplier: 2,
        baseDamage: 50,
        
        hitDetection: {
            useVisualRange: true,
            visualRangeMultiplier: 1.3,
            minHitRange: 100,
            maxHitRange: 180
        }
    },

    food: {
        sushi: {
            healAmount: 25,
            dropChance: 0.20,
            life: 600,
            width: 50,
            height: 50,
            collectRadius: 45
        },
        nigiri: {
            healAmount: 50,
            dropChance: 0.30,
            life: 700,
            width: 55,
            height: 55,
            collectRadius: 45
        }
    },

    enemies: {
        spawnInterval: 120,
        
        hero: { 
            health: 120, 
            speed: 2.2,
            damage: 12, 
            color: '#FF6B35', 
            reward: 20,
            width: 320,
            height: 340,
            attackRange: 100,
            attackCooldown: 300,
            spritesheet: true,
            frames: {
                run: 8,
                attack: 4
            },
            animationSpeed: 8,
            groundOffset: 115
        },
        
        martialHero: { 
            health: 250, 
            speed: 1.8,
            damage: 23, 
            color: '#4B0082', 
            reward: 50,
            width: 320,
            height: 340,
            attackRange: 120,
            attackCooldown: 400,
            spritesheet: true,
            frames: {
                run: 8,            
                attack: 6
            },
            animationSpeed: 10,
            groundOffset: 127
        }
    },

    waves: {
        baseEnemies: 3,
        enemyIncrease: 2,
        maxEnemies: 12,
        spawnDelay: 1000,
        
        bossSystem: {
            heroKillsForBoss: 5,
            enabled: true
        }
    },

    particles: {
        bloodParticles: 12,
        sakuraParticles: 8,
        maxLife: 40,
        slashParticleCount: 20,
        
        sakura: {
            ambientSpawnRate: 90,
            ambientCount: 6,
            deathEffectCount: 15,
            windStrength: 0.3,
            fallSpeed: 0.8,
            lifespan: 250,
            extraAmbientSpawnRate: 60,
            extraAmbientCount: 4,
            windVariation: 0.5
        }
    },

    spheres: {
        dropChance: {
            shield: 0.18,
            attack: 0.15
        },
        colors: {
            shield: '#00ffcc',
            attack: '#ff3333'
        },
        pickupRange: 50,
        floatSpeed: 0.02,
        glowIntensity: 15
    },

    ground: {
        y: 420,                    
        grassHeight: 30,           
        borderHeight: 80,          
        borderOffset: -30,         
        stoneColor: '#3d3d3d',     
        woodColor: '#8B4513',      
        sakuraColor: '#FFB6C1',    
        bambooColor: '#567d46'     
    },

    shieldAura: {
        spritesheet: {
            path: 'assets/effects/shield_aura.png',
            frameCount: 30,
            columns: 5,
            rows: 6,
            frameWidth: 0,
            frameHeight: 0,
            frameDuration: 3
        },
        
        visual: {
            scale: 1.8,
            opacity: 0.85,
            offsetX: 0,
            offsetY: -15,
            rotation: 0.01,
            blend: 'screen',
            pulseIntensity: 0.15
        },
        
        animation: {
            loop: true,
            autoPlay: true,
            pingPong: false,
            randomStart: true,
            speedMultiplier: 1.0,
            readingOrder: 'row-by-row'
        },
        
        effects: {
            enablePulse: true,
            enableRotation: true,
            enableGlow: true,
            glowColor: '#00ffcc',
            glowIntensity: 15
        },
        
        behavior: {
            fadeInDuration: 30,
            fadeOutDuration: 45,
            syncWithShieldBuff: true,
            showOnActivation: true,
            hideOnDeactivation: true
        }
    },

    attackAura: {
        spritesheet: {
            path: 'assets/effects/attack_aura.png',
            frameCount: 30,
            columns: 5,
            rows: 6,
            frameWidth: 0,
            frameHeight: 0,
            frameDuration: 4
        },
        
        visual: {
            scale: 1.6,
            opacity: 0.9,
            offsetX: 0,
            offsetY: -10,
            rotation: 0.03,
            blend: 'screen',
            pulseIntensity: 0.2
        },
        
        animation: {
            loop: true,
            autoPlay: true,
            pingPong: false,
            randomStart: true,
            speedMultiplier: 1.2,
            readingOrder: 'row-by-row'
        },
        
        effects: {
            enablePulse: true,
            enableRotation: true,
            enableGlow: true,
            glowColor: '#ff3333',
            glowIntensity: 20
        },
        
        behavior: {
            fadeInDuration: 25,
            fadeOutDuration: 35,
            syncWithAttackBuff: true,
            showOnActivation: true,
            hideOnDeactivation: true
        }
    },

    slashAnimation: {
        frameCount: 6,
        frameDuration: 3,
        totalDuration: 18,
        scale: 0.1,
        alpha: 0.9,
        
        visual: {
            blend: 'screen',
            glow: true,
            glowColor: '#ffdd44',
            shadowBlur: 10
        },
        
        positioning: {
            offsetX: {
                right: 20,
                left: -20
            },
            offsetY: -10,
            centerOnPlayer: true
        },
        
        behavior: {
            autoDestroy: true,
            fadeOut: true,
            scaleEffect: false,
            rotateWithDirection: true
        }
    }
};

const ASSETS = {
    player: {
        idle: 'assets/player/samurai_idle.png',
        idle_left: 'assets/player/samurai_idle_left.png',
        run_right_1: 'assets/player/samurai_run_right_1.png',
        run_right_2: 'assets/player/samurai_run_right_2.png',
        run_left_1: 'assets/player/samurai_run_left_1.png',
        run_left_2: 'assets/player/samurai_run_left_2.png'
    },
    
    enemies: {
        hero: {
            run: 'assets/enemies/hero_run_left.png',        
            attack: 'assets/enemies/hero_attack_left.png', 
            run_left: 'assets/enemies/hero_run_left.png',
            run_right: 'assets/enemies/hero_run_right.png',
            attack_left: 'assets/enemies/hero_attack_left.png',
            attack_right: 'assets/enemies/hero_attack_right.png'
        },
        
        martialHero: {
            run: 'assets/enemies/martial_hero_run_left.png',
            attack: 'assets/enemies/martial_hero_attack_left.png',
            run_left: 'assets/enemies/martial_hero_run_left.png',
            run_right: 'assets/enemies/martial_hero_run_right.png',
            attack_left: 'assets/enemies/martial_hero_attack_left.png',
            attack_right: 'assets/enemies/martial_hero_attack_right.png'
        }
    },
    
    food: {
        sushi: 'assets/food/sushi.png',
        nigiri: 'assets/food/nigiri.png'
    },
    
    effects: {
        shieldAura: 'assets/effects/shield_aura.png',
        attackAura: 'assets/effects/attack_aura.png',
        
        slash: {
            frame1: 'assets/effects/slash_frame_1.png',
            frame2: 'assets/effects/slash_frame_2.png',
            frame3: 'assets/effects/slash_frame_3.png',
            frame4: 'assets/effects/slash_frame_4.png',
            frame5: 'assets/effects/slash_frame_5.png',
            frame6: 'assets/effects/slash_frame_6.png'
        }
    },
    
    background: 'assets/backgrounds/background.png',
    
    audio: {
        backgroundMusic: 'assets/audio/background_music.mp3',
        backgroundMusic2: 'assets/audio/background_music_2.mp3',
        swordSlash: 'assets/audio/sword_slash.mp3',
        enemyHit: 'assets/audio/enemy_hit.mp3',
        playerHit: 'assets/audio/player_hit.mp3',
        gameOver: 'assets/audio/game_over.mp3',
        comboSound: 'assets/audio/combo.mp3',
        spherePickup: 'assets/audio/sphere_pickup.mp3',
        buffActivate: 'assets/audio/buff_activate.mp3',
        foodPickup: 'assets/audio/food_pickup.mp3'
    }
};

const IMAGES = {
    player: {
        idle: null,
        idle_left: null,
        run_right_1: null,
        run_right_2: null,
        run_left_1: null,
        run_left_2: null
    },
    
    enemies: {
        hero: {
            run: null,
            attack: null,
            run_left: null,
            run_right: null,
            attack_left: null,
            attack_right: null
        },
        
        martialHero: {
            run: null,
            attack: null,
            run_left: null,
            run_right: null,
            attack_left: null,
            attack_right: null
        }
    },
    
    food: {
        sushi: null,
        nigiri: null
    },
    
    effects: {
        shieldAura: null,
        attackAura: null,
        
        slash: {
            frame1: null,
            frame2: null,
            frame3: null,
            frame4: null,
            frame5: null,
            frame6: null
        }
    },
    
    background: null,
    loaded: false,
    
    isImageReady: function(imagePath) {
        const pathParts = imagePath.split('.');
        let current = this;
        
        for (const part of pathParts) {
            if (!current[part]) return false;
            current = current[part];
        }
        
        return current && current.complete && current.naturalHeight !== 0;
    },
    
    hasBidirectionalSprites: function(enemyType) {
        const enemy = this.enemies[enemyType];
        if (!enemy) return false;
        
        const hasLeftSprites = enemy.run_left || enemy.attack_left;
        const hasRightSprites = enemy.run_right || enemy.attack_right;
        
        return hasLeftSprites && hasRightSprites;
    },
    
    isEffectReady: function(effectName) {
        return this.effects[effectName] && 
               this.effects[effectName].complete && 
               this.effects[effectName].naturalHeight !== 0;
    },
    
    isFoodReady: function(foodType) {
        return this.food[foodType] && 
               this.food[foodType].complete && 
               this.food[foodType].naturalHeight !== 0;
    },
    
    getGridInfo: function(effectName) {
        if (!this.isEffectReady(effectName)) return null;
        
        const sprite = this.effects[effectName];
        let config;
        
        if (effectName === 'shieldAura') {
            config = CONFIG.shieldAura.spritesheet;
        } else if (effectName === 'attackAura') {
            config = CONFIG.attackAura.spritesheet;
        } else {
            return null;
        }
        
        return {
            totalWidth: sprite.width,
            totalHeight: sprite.height,
            frameWidth: sprite.width / config.columns,
            frameHeight: sprite.height / config.rows,
            columns: config.columns,
            rows: config.rows,
            totalFrames: config.frameCount
        };
    },
    
    isSlashFrameReady: function(frameNumber) {
        const frameName = `frame${frameNumber}`;
        return this.effects.slash[frameName] && 
               this.effects.slash[frameName].complete && 
               this.effects.slash[frameName].naturalHeight !== 0;
    },
    
    getSlashAnimationStatus: function() {
        const status = {
            totalFrames: CONFIG.slashAnimation.frameCount,
            loadedFrames: 0,
            readyFrames: [],
            missingFrames: []
        };
        
        for (let i = 1; i <= CONFIG.slashAnimation.frameCount; i++) {
            if (this.isSlashFrameReady(i)) {
                status.loadedFrames++;
                status.readyFrames.push(i);
            } else {
                status.missingFrames.push(i);
            }
        }
        
        status.isComplete = status.loadedFrames === status.totalFrames;
        status.progressPercent = (status.loadedFrames / status.totalFrames) * 100;
        
        return status;
    }
};

const AUDIO = {
    backgroundMusic: null,
    backgroundMusic2: null,
    swordSlash: null,
    enemyHit: null,
    playerHit: null,
    gameOver: null,
    comboSound: null,
    spherePickup: null,
    buffActivate: null,
    foodPickup: null,
    
    enabled: false,
    musicPlaying: false,
    currentTrackIndex: 0,
    musicTracks: [],
    musicPaused: false
};

const MathUtils = {
    random(min, max) {
        return Math.random() * (max - min) + min;
    },
    
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },
    
    lerp(start, end, factor) {
        return start + (end - start) * factor;
    },
    
    distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    },
    
    getGridPosition(frameIndex, columns, rows, readingOrder = 'row-by-row') {
        if (readingOrder === 'row-by-row') {
            const row = Math.floor(frameIndex / columns);
            const col = frameIndex % columns;
            return { row, col };
        } else {
            const col = Math.floor(frameIndex / rows);
            const row = frameIndex % rows;
            return { row, col };
        }
    },
    
    getSourceCoords(frameIndex, frameWidth, frameHeight, columns, rows, readingOrder = 'row-by-row') {
        const { row, col } = this.getGridPosition(frameIndex, columns, rows, readingOrder);
        return {
            x: col * frameWidth,
            y: row * frameHeight,
            width: frameWidth,
            height: frameHeight
        };
    },
    
    easeInOut(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    
    pulse(time, frequency = 1) {
        return (Math.sin(time * frequency) + 1) / 2;
    },
    
    normalizeAngle(angle) {
        while (angle < 0) angle += Math.PI * 2;
        while (angle >= Math.PI * 2) angle -= Math.PI * 2;
        return angle;
    }
};

const GameUtils = {
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    },
    
    distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    },
    
    isInAttackRange(attacker, target, range) {
        const centerX1 = attacker.x + attacker.width / 2;
        const centerY1 = attacker.y + attacker.height / 2;
        const centerX2 = target.x + target.width / 2;
        const centerY2 = target.y + target.height / 2;
        
        const distance = this.distance(centerX1, centerY1, centerX2, centerY2);
        return distance <= range;
    },
    
    isInRange(obj1, obj2, range) {
        const centerX1 = obj1.x + obj1.width / 2;
        const centerY1 = obj1.y + obj1.height / 2;
        const centerX2 = obj2.x + obj2.width / 2;
        const centerY2 = obj2.y + obj2.height / 2;
        
        return this.distance(centerX1, centerY1, centerX2, centerY2) <= range;
    },
    
    getDistanceToPlayer(enemy) {
        if (!player) return Infinity;
        
        const playerCenterX = player.x + player.width / 2;
        const playerCenterY = player.y + player.height / 2;
        const enemyCenterX = enemy.x + enemy.width / 2;
        const enemyCenterY = enemy.y + enemy.height / 2;
        
        return this.distance(enemyCenterX, enemyCenterY, playerCenterX, playerCenterY);
    },
    
    getCenterPoint(obj) {
        return {
            x: obj.x + obj.width / 2,
            y: obj.y + obj.height / 2
        };
    },
    
    getAuraPosition(player, config) {
        const center = this.getCenterPoint(player);
        return {
            x: center.x + config.visual.offsetX,
            y: center.y + config.visual.offsetY
        };
    },
    
    getSlashPosition(player, direction, range) {
        const centerX = player.x + player.width / 2;
        const centerY = player.y + player.height / 2;
        
        if (direction === 'right') {
            return {
                x: centerX + CONFIG.slashAnimation.positioning.offsetX.right,
                y: centerY + CONFIG.slashAnimation.positioning.offsetY
            };
        } else {
            return {
                x: centerX + CONFIG.slashAnimation.positioning.offsetX.left,
                y: centerY + CONFIG.slashAnimation.positioning.offsetY
            };
        }
    },
    
    getFoodDropPosition(enemyCenterX, enemyCenterY, existingItems = []) {
        const attempts = 10;
        const minDistance = 60;
        
        for (let i = 0; i < attempts; i++) {
            const angle = (Math.PI * 2 * i) / attempts + Math.random() * 0.5;
            const distance = 25 + Math.random() * 20;
            
            const x = enemyCenterX + Math.cos(angle) * distance;
            const y = enemyCenterY;
            
            let tooClose = false;
            for (const item of existingItems) {
                const dx = x - item.x;
                const dy = y - item.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < minDistance) {
                    tooClose = true;
                    break;
                }
            }
            
            if (!tooClose) {
                return { x, y };
            }
        }
        
        return {
            x: enemyCenterX + (Math.random() - 0.5) * 80,
            y: enemyCenterY
        };
    }
};

const DebugUtils = {
    logSpriteState: function(enemy) {
        if (Math.random() < 0.02) {
            console.log(`${enemy.type}: state=${enemy.currentState}, facing=${enemy.facing}, frame=${enemy.currentFrame}`);
        }
    },
    
    logImageStatus: function(type) {
        const images = IMAGES.enemies[type];
        if (images) {
            console.log(`\n${type.toUpperCase()} SPRITE STATUS:`);
            Object.keys(images).forEach(key => {
                const img = images[key];
                const status = img && img.complete && img.naturalHeight !== 0 ? 'READY' : 'LOADING';
                console.log(`  ${key}: ${status} ${img ? `(${img.width}x${img.height})` : '(null)'}`);
            });
        }
    },
    
    logShieldAuraStatus: function() {
        console.log('\nSHIELD AURA STATUS (Grid 5x6):');
        console.log(`  Sprite loaded: ${IMAGES.isEffectReady('shieldAura') ? 'YES' : 'NO'}`);
        console.log(`  Config ready: ${CONFIG.shieldAura ? 'YES' : 'NO'}`);
        
        const gridInfo = IMAGES.getGridInfo('shieldAura');
        if (gridInfo) {
            console.log(`  Grid: ${gridInfo.columns}x${gridInfo.rows} (${gridInfo.totalFrames} frames)`);
            console.log(`  Total size: ${gridInfo.totalWidth}x${gridInfo.totalHeight}`);
            console.log(`  Frame size: ${gridInfo.frameWidth}x${gridInfo.frameHeight}`);
        }
        
        if (typeof player !== 'undefined' && player.shieldAura) {
            console.log(`  Aura active: ${player.shieldAura.isActive() ? 'YES' : 'NO'}`);
            console.log(`  Current frame: ${player.shieldAura.currentFrame}`);
            console.log(`  Reading order: ${CONFIG.shieldAura.animation.readingOrder}`);
            console.log(`  Opacity: ${player.shieldAura.alpha.toFixed(2)}`);
        }
    },
    
    logAttackAuraStatus: function() {
        console.log('\nATTACK AURA STATUS (Grid 5x6):');
        console.log(`  Sprite loaded: ${IMAGES.isEffectReady('attackAura') ? 'YES' : 'NO'}`);
        console.log(`  Config ready: ${CONFIG.attackAura ? 'YES' : 'NO'}`);
        
        const gridInfo = IMAGES.getGridInfo('attackAura');
        if (gridInfo) {
            console.log(`  Grid: ${gridInfo.columns}x${gridInfo.rows} (${gridInfo.totalFrames} frames)`);
            console.log(`  Total size: ${gridInfo.totalWidth}x${gridInfo.totalHeight}`);
            console.log(`  Frame size: ${gridInfo.frameWidth}x${gridInfo.frameHeight}`);
        }
        
        if (typeof player !== 'undefined' && player.attackAura) {
            console.log(`  Aura active: ${player.attackAura.isActive() ? 'YES' : 'NO'}`);
            console.log(`  Current frame: ${player.attackAura.currentFrame}`);
            console.log(`  Reading order: ${CONFIG.attackAura.animation.readingOrder}`);
            console.log(`  Opacity: ${player.attackAura.alpha.toFixed(2)}`);
        }
    },
    
    logSlashAnimationStatus: function() {
        console.log('\nSLASH ANIMATION STATUS:');
        console.log(`  Config ready: ${CONFIG.slashAnimation ? 'YES' : 'NO'}`);
        
        const status = IMAGES.getSlashAnimationStatus();
        console.log(`  Total frames: ${status.totalFrames}`);
        console.log(`  Loaded frames: ${status.loadedFrames}/${status.totalFrames} (${status.progressPercent.toFixed(1)}%)`);
        console.log(`  Ready frames: [${status.readyFrames.join(', ')}]`);
        console.log(`  Missing frames: [${status.missingFrames.join(', ')}]`);
        console.log(`  Complete: ${status.isComplete ? 'YES' : 'NO'}`);
    },
    
    logFoodSystem: function() {
        console.log('\nFOOD HEALING SYSTEM STATUS:');
        console.log(`  Sushi sprite: ${IMAGES.isFoodReady('sushi') ? 'LOADED' : 'MISSING'}`);
        console.log(`  Nigiri sprite: ${IMAGES.isFoodReady('nigiri') ? 'LOADED' : 'MISSING'}`);
        console.log(`  Sushi heal amount: ${CONFIG.food.sushi.healAmount} HP`);
        console.log(`  Nigiri heal amount: ${CONFIG.food.nigiri.healAmount} HP`);
        console.log(`  Sushi drop chance: ${(CONFIG.food.sushi.dropChance * 100)}%`);
        console.log(`  Nigiri drop chance: ${(CONFIG.food.nigiri.dropChance * 100)}%`);
        console.log(`  Sushi size: ${CONFIG.food.sushi.width}x${CONFIG.food.sushi.height}`);
        console.log(`  Nigiri size: ${CONFIG.food.nigiri.width}x${CONFIG.food.nigiri.height}`);
        
        if (typeof foodDrops !== 'undefined') {
            console.log(`  Active food drops: ${foodDrops.length}`);
            
            if (foodDrops.length > 0) {
                console.log('\nACTIVE HEALING FOOD:');
                foodDrops.forEach((food, index) => {
                    console.log(`  ${index}: ${food.type} (+${food.healAmount} HP), Life: ${food.life}`);
                });
            }
        }
    },
    
    logSakuraSystem: function() {
        console.log('\nSAKURA SYSTEM STATUS:');
        console.log(`  Ambient spawn rate: every ${CONFIG.particles.sakura.ambientSpawnRate} frames`);
        console.log(`  Ambient count: ${CONFIG.particles.sakura.ambientCount} per spawn`);
        console.log(`  Extra ambient spawn rate: every ${CONFIG.particles.sakura.extraAmbientSpawnRate} frames`);
        console.log(`  Extra ambient count: ${CONFIG.particles.sakura.extraAmbientCount} per spawn`);
        console.log(`  Death effect count: ${CONFIG.particles.sakura.deathEffectCount}`);
        console.log(`  Wind strength: ${CONFIG.particles.sakura.windStrength}`);
        console.log(`  Fall speed: ${CONFIG.particles.sakura.fallSpeed}`);
        console.log(`  Lifespan: ${CONFIG.particles.sakura.lifespan} frames`);
        
        if (typeof sakuraParticles !== 'undefined') {
            const deathEffects = sakuraParticles.filter(p => p.isDeathEffect);
            const ambient = sakuraParticles.filter(p => !p.isDeathEffect);
            console.log(`  Active particles: ${sakuraParticles.length} (Death: ${deathEffects.length}, Ambient: ${ambient.length})`);
        }
    },
    
    testShieldAuraGrid: function() {
        if (typeof player !== 'undefined' && player.shieldAura) {
            console.log('Testing shield aura grid system');
            
            for (let i = 0; i < Math.min(10, CONFIG.shieldAura.spritesheet.frameCount); i++) {
                const pos = MathUtils.getGridPosition(
                    i, 
                    CONFIG.shieldAura.spritesheet.columns,
                    CONFIG.shieldAura.spritesheet.rows,
                    CONFIG.shieldAura.animation.readingOrder
                );
                console.log(`  Frame ${i}: row ${pos.row}, col ${pos.col}`);
            }
            
            player.shieldAura.activate();
            setTimeout(() => {
                console.log('Testing deactivation');
                player.shieldAura.deactivate();
            }, 3000);
        }
    },
    
    testAttackAuraGrid: function() {
        if (typeof player !== 'undefined' && player.attackAura) {
            console.log('Testing attack aura grid system');
            
            player.attackAura.activate();
            setTimeout(() => {
                console.log('Testing attack aura deactivation');
                player.attackAura.deactivate();
            }, 3000);
        }
    },
    
    switchReadingOrder: function() {
        const currentOrder = CONFIG.shieldAura.animation.readingOrder;
        const newOrder = currentOrder === 'row-by-row' ? 'column-by-column' : 'row-by-row';
        
        CONFIG.shieldAura.animation.readingOrder = newOrder;
        CONFIG.attackAura.animation.readingOrder = newOrder;
        
        if (typeof player !== 'undefined') {
            if (player.shieldAura) {
                player.shieldAura.readingOrder = newOrder;
            }
            if (player.attackAura) {
                player.attackAura.readingOrder = newOrder;
            }
        }
        
        console.log(`Reading order changed: ${currentOrder} → ${newOrder}`);
    },
    
    testAllSystems: function() {
        console.log('\nTESTING ALL SYSTEMS:');
        this.logShieldAuraStatus();
        this.logAttackAuraStatus();
        this.logSlashAnimationStatus();
        this.logFoodSystem();
        this.logSakuraSystem();
        
        if (typeof player !== 'undefined') {
            console.log('\nPLAYER SYSTEMS:');
            console.log(`  Shield aura: ${player.shieldAura ? 'YES' : 'NO'}`);
            console.log(`  Attack aura: ${player.attackAura ? 'YES' : 'NO'}`);
            console.log(`  Current health: ${player.health}/${player.maxHealth} HP`);
        }
    }
};

window.CONFIG = CONFIG;
window.ASSETS = ASSETS;
window.IMAGES = IMAGES;
window.AUDIO = AUDIO;
window.DebugUtils = DebugUtils;
window.MathUtils = MathUtils;
window.GameUtils = GameUtils;
