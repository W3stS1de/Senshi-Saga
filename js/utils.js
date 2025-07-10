function drawBackground() {
    
    if (IMAGES.background && IMAGES.background.complete && IMAGES.background.naturalHeight !== 0) {
        ctx.drawImage(IMAGES.background, 0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        // Fallback gradient 
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#1a1a2e'); 
        gradient.addColorStop(0.5, '#16213e'); 
        gradient.addColorStop(1, '#0f1824'); 
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.save();
        ctx.fillStyle = '#f0f0f0';
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#f0f0f0';
        ctx.beginPath();
        ctx.arc(700, 100, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }


    drawEnhancedJapaneseGroundBorder();
    
    const groundGradient = ctx.createLinearGradient(0, CONFIG.ground.y, 0, canvas.height);
    groundGradient.addColorStop(0, '#3a2a2a');
    groundGradient.addColorStop(0.3, '#2a1a1a'); 
    groundGradient.addColorStop(0.7, '#1a0a0a');
    groundGradient.addColorStop(1, '#0d0505');

    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, CONFIG.ground.y, canvas.width, canvas.height - CONFIG.ground.y);
    
    
    drawGroundTexture();
}

function drawEnhancedJapaneseGroundBorder() {
    const borderY = CONFIG.ground.y - 8;
    
    ctx.save();
    
    
    const woodGradient = ctx.createLinearGradient(0, borderY - 15, 0, borderY + 15);
    woodGradient.addColorStop(0, '#8B4513');
    woodGradient.addColorStop(0.3, '#A0522D');
    woodGradient.addColorStop(0.7, '#8B4513');
    woodGradient.addColorStop(1, '#654321');
    
    ctx.fillStyle = woodGradient;
    ctx.fillRect(0, borderY - 12, canvas.width, 20);
    

    ctx.strokeStyle = 'rgba(101, 67, 33, 0.8)';
    ctx.lineWidth = 2;
    for (let i = 0; i < canvas.width; i += 60) {
        ctx.beginPath();
        ctx.moveTo(i, borderY - 12);
        ctx.lineTo(i, borderY + 8);
        ctx.stroke();
        
        ctx.fillStyle = '#696969';
        ctx.beginPath();
        ctx.arc(i + 15, borderY - 6, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(i + 45, borderY + 2, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Бамбук
    for (let i = 80; i < canvas.width; i += 120) {
        drawBambooPost(i, borderY - 35);
    }
    
    // Каменные фонари
    for (let i = 150; i < canvas.width; i += 250) {
        drawEnhancedStoneLantern(i, borderY - 45);
    }
    
    // Лепестки сакуры 
    drawSakuraPetalsOnGround(borderY);
    
    // вечение фонарика
    if (typeof gameRunning !== 'undefined' && gameRunning) {
        drawLanternGlow(borderY);
    }
    
    ctx.restore();
}

function drawBambooPost(x, y) {
    ctx.save();
    
    const bambooGradient = ctx.createLinearGradient(x - 5, y, x + 5, y);
    bambooGradient.addColorStop(0, '#4a6b3b');
    bambooGradient.addColorStop(0.5, '#567d46');
    bambooGradient.addColorStop(1, '#3a5530');
    
    ctx.fillStyle = bambooGradient;
    ctx.fillRect(x - 4, y, 8, 40);
    
    ctx.fillStyle = '#3a5530';
    ctx.fillRect(x - 5, y + 10, 10, 3);
    ctx.fillRect(x - 5, y + 25, 10, 3);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(x - 2, y, 1, 40);
    
    ctx.restore();
}
function drawEnhancedStoneLantern(x, y) {
    ctx.save();
    
    const baseGradient = ctx.createLinearGradient(x - 15, y + 35, x + 15, y + 35);
    baseGradient.addColorStop(0, '#2d2d2d');
    baseGradient.addColorStop(0.5, '#3d3d3d');
    baseGradient.addColorStop(1, '#2d2d2d');
    
    ctx.fillStyle = baseGradient;
    ctx.fillRect(x - 15, y + 35, 30, 15);
    
    const pillarGradient = ctx.createLinearGradient(x - 10, y + 10, x + 10, y + 10);
    pillarGradient.addColorStop(0, '#2d2d2d');
    pillarGradient.addColorStop(0.5, '#4d4d4d');
    pillarGradient.addColorStop(1, '#2d2d2d');
    
    ctx.fillStyle = pillarGradient;
    ctx.fillRect(x - 10, y + 10, 20, 25);
   
    const lightGradient = ctx.createRadialGradient(x, y + 10, 0, x, y + 10, 15);
    lightGradient.addColorStop(0, '#ffcc66');
    lightGradient.addColorStop(0.7, '#ff9933');
    lightGradient.addColorStop(1, 'rgba(255, 153, 51, 0)');
    
    ctx.fillStyle = '#2d2d2d';
    ctx.fillRect(x - 12, y, 24, 20);
    
    ctx.fillStyle = lightGradient;
    ctx.fillRect(x - 10, y + 2, 20, 16);
    
    // Крыша
    ctx.fillStyle = '#3d3d3d';
    ctx.beginPath();
    ctx.moveTo(x - 18, y);
    ctx.lineTo(x + 18, y);
    ctx.lineTo(x + 13, y - 8);
    ctx.lineTo(x - 13, y - 8);
    ctx.closePath();
    ctx.fill();
    
    // Блик на крыше
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(x - 13, y - 8);
    ctx.lineTo(x, y - 8);
    ctx.lineTo(x - 6, y);
    ctx.lineTo(x - 18, y);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
}

// Лепестки сакуры 
function drawSakuraPetalsOnGround(borderY) {
    ctx.save();
    
    const petals = [
        {x: 50, y: borderY - 5, size: 3, rotation: 0.5},
        {x: 120, y: borderY - 3, size: 2, rotation: 1.2},
        {x: 200, y: borderY - 7, size: 4, rotation: 0.8},
        {x: 350, y: borderY - 4, size: 3, rotation: 1.8},
        {x: 450, y: borderY - 6, size: 2, rotation: 0.3},
        {x: 580, y: borderY - 2, size: 3, rotation: 1.5},
        {x: 720, y: borderY - 5, size: 4, rotation: 0.7},
        {x: 820, y: borderY - 3, size: 2, rotation: 1.1}
    ];
    
    petals.forEach(petal => {
        ctx.save();
        ctx.translate(petal.x, petal.y);
        ctx.rotate(petal.rotation);
        ctx.globalAlpha = 0.7;
        
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, petal.size);
        gradient.addColorStop(0, '#ffb3c6');
        gradient.addColorStop(0.7, '#ffc9d9');
        gradient.addColorStop(1, 'rgba(255, 201, 217, 0.3)');
        
        ctx.fillStyle = gradient;
        
        ctx.beginPath();
        ctx.moveTo(0, -petal.size);
        ctx.quadraticCurveTo(petal.size * 0.7, -petal.size * 0.3, petal.size * 0.5, 0);
        ctx.quadraticCurveTo(petal.size * 0.3, petal.size * 0.7, 0, petal.size);
        ctx.quadraticCurveTo(-petal.size * 0.3, petal.size * 0.7, -petal.size * 0.5, 0);
        ctx.quadraticCurveTo(-petal.size * 0.7, -petal.size * 0.3, 0, -petal.size);
        ctx.fill();
        
        ctx.restore();
    });
    
    ctx.restore();
}

function drawLanternGlow(borderY) {
    ctx.save();
    ctx.globalAlpha = 0.4;
    
    for (let i = 150; i < canvas.width; i += 250) {
        const glowGradient = ctx.createRadialGradient(i, borderY - 35, 0, i, borderY - 35, 40);
        glowGradient.addColorStop(0, '#ffcc66');
        glowGradient.addColorStop(0.3, '#ff9933');
        glowGradient.addColorStop(0.7, 'rgba(255, 153, 51, 0.3)');
        glowGradient.addColorStop(1, 'rgba(255, 153, 51, 0)');
        
        ctx.fillStyle = glowGradient;
        ctx.fillRect(i - 40, borderY - 75, 80, 80);
    }
    
    ctx.restore();
}

// Текстура земли
function drawGroundTexture() {
    ctx.save();
    
    // Камни и корни
    ctx.fillStyle = 'rgba(80, 60, 60, 0.4)';
    for (let i = 0; i < canvas.width; i += 45) {
        const stoneSize = 4 + Math.sin(i * 0.1) * 2;
        const stoneY = CONFIG.ground.y + CONFIG.ground.grassHeight + 10;
        
        // Камни
        ctx.beginPath();
        ctx.arc(i + 20, stoneY, stoneSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Корни деревьев
        if (i % 90 === 0) {
            ctx.strokeStyle = 'rgba(101, 67, 33, 0.5)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(i + 10, CONFIG.ground.y + 15);
            ctx.quadraticCurveTo(i + 25, CONFIG.ground.y + 30, i + 40, CONFIG.ground.y + 25);
            ctx.stroke();
        }
    }
    
    ctx.restore();
}

// отрисовка перса
function drawPlayer() {
    ctx.save();
    
    
    if (player.invulnerable > 0 && player.invulnerable % 10 < 5) {
        ctx.globalAlpha = 0.5;
    }
    
    let playerImage = null;
    let useFlip = false;
    
    if (player.moving) {
        // бег анимэйшэн
        if (player.facing === 'right') {
            playerImage = player.animationFrame === 0 ? 
                IMAGES.player.run_right_1 : IMAGES.player.run_right_2;
        } else {
            const leftSprite1 = IMAGES.player.run_left_1;
            const leftSprite2 = IMAGES.player.run_left_2;
            
            if (leftSprite1 && leftSprite1.complete && leftSprite1.naturalHeight !== 0 &&
                leftSprite2 && leftSprite2.complete && leftSprite2.naturalHeight !== 0) {
                playerImage = player.animationFrame === 0 ? leftSprite1 : leftSprite2;
            } else {
                playerImage = player.animationFrame === 0 ? 
                    IMAGES.player.run_right_1 : IMAGES.player.run_right_2;
                useFlip = true;
            }
        }
    } else {
        
        if (player.facing === 'right') {
            playerImage = IMAGES.player.idle;
        } else {
            const leftIdle = IMAGES.player.idle_left;
            
            if (leftIdle && leftIdle.complete && leftIdle.naturalHeight !== 0) {
                playerImage = leftIdle;
            } else {
                playerImage = IMAGES.player.idle;
                useFlip = true;
            }
        }
    }
    
    // отрисовка спрайта
    if (playerImage && playerImage.complete && playerImage.naturalHeight !== 0) {
        if (useFlip) {
            ctx.save();
            ctx.translate(player.x + player.width, player.y);
            ctx.scale(-1, 1);
            ctx.drawImage(playerImage, 0, 0, player.width, player.height);
            ctx.restore();
        } else {
            ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
        }
    } else {
        drawPlayerFallback();
    }
    
    // аура дефа
    if (player.buffs.shield.active) {
        drawShieldAura();
    }
    
    // аура атаки
    if (player.buffs.attack.active) {
        drawAttackAura();
    }
    
    // Health bar
    const barWidth = player.width;
    const barHeight = 8;
    const barY = player.y - 20;
    
    ctx.fillStyle = '#333';
    ctx.fillRect(player.x, barY, barWidth, barHeight);
    
    const healthColor = player.health > 60 ? '#4CAF50' : 
                       player.health > 30 ? '#FFC107' : '#F44336';
    ctx.fillStyle = healthColor;
    const healthPercent = player.health / player.maxHealth;
    ctx.fillRect(player.x + 1, barY + 1, (barWidth - 2) * healthPercent, barHeight - 2);
    
    ctx.restore();
}

function drawPlayerFallback() {
   
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(player.x + 10, player.y + 20, player.width - 20, 50);
    
    // Armor 
    ctx.fillStyle = '#2d2d2d';
    ctx.fillRect(player.x + 15, player.y + 25, player.width - 30, 20);
    ctx.fillRect(player.x + 15, player.y + 50, player.width - 30, 15);
    
    // Head
    ctx.fillStyle = '#f4e4c1';
    ctx.fillRect(player.x + 25, player.y + 5, 30, 20);
    
    // Helmet
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(player.x + 20, player.y, 40, 15);
    
    // Legs
    const legY = player.y + player.height - 30;
    if (player.moving) {
        const legOffset = player.animationFrame === 0 ? 2 : -2;
        ctx.fillRect(player.x + 20, legY + legOffset, 15, 30);
        ctx.fillRect(player.x + 45, legY - legOffset, 15, 30);
    } else {
        ctx.fillRect(player.x + 20, legY, 15, 30);
        ctx.fillRect(player.x + 45, legY, 15, 30);
    }
    
    // Sword
    if (player.facing === 'right') {
        ctx.fillStyle = '#c0c0c0';
        ctx.fillRect(player.x + player.width - 10, player.y + 30, 25, 4);
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(player.x + player.width - 15, player.y + 28, 10, 8);
    } else {
        ctx.fillStyle = '#c0c0c0';
        ctx.fillRect(player.x - 15, player.y + 30, 25, 4);
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(player.x + 5, player.y + 28, 10, 8);
    }
}

function drawShieldAura() {
    const centerX = player.x + player.width / 2;
    const centerY = player.y + player.height / 2;
    const radius = 50 + Math.sin(frameCount * 0.1) * 5;
    
    ctx.save();
    ctx.globalAlpha = 0.3;
    const shieldGradient = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, radius);
    shieldGradient.addColorStop(0, 'rgba(0, 255, 204, 0.6)');
    shieldGradient.addColorStop(0.7, 'rgba(0, 255, 204, 0.3)');
    shieldGradient.addColorStop(1, 'rgba(0, 255, 204, 0)');
    
    ctx.fillStyle = shieldGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function drawAttackAura() {
    const centerX = player.x + player.width / 2;
    const centerY = player.y + player.height / 2;
    
    ctx.save();
    ctx.globalAlpha = 0.6;
    const fireGradient = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 60);
    fireGradient.addColorStop(0, 'rgba(255, 100, 0, 0.9)');
    fireGradient.addColorStop(0.3, 'rgba(255, 50, 0, 0.7)');
    fireGradient.addColorStop(0.6, 'rgba(255, 0, 0, 0.5)');
    fireGradient.addColorStop(1, 'rgba(100, 0, 0, 0)');
    
    ctx.fillStyle = fireGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function drawStartScreen() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBackground();
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.restore();
}

async function loadAllAssets() {
    console.log('Loading HERO + MARTIAL HERO assets with food system...');
    
    try {
        loadBackgroundSilently();
        
        // загрузка спрайтов
        loadImageSilently(ASSETS.player.idle, IMAGES.player, 'idle');
        loadImageSilently(ASSETS.player.run_right_1, IMAGES.player, 'run_right_1');
        loadImageSilently(ASSETS.player.run_right_2, IMAGES.player, 'run_right_2');
        loadImageOptionally(ASSETS.player.idle_left, IMAGES.player, 'idle_left');
        loadImageOptionally(ASSETS.player.run_left_1, IMAGES.player, 'run_left_1');
        loadImageOptionally(ASSETS.player.run_left_2, IMAGES.player, 'run_left_2');
        
        console.log('Loading Hero');
        loadSpritesheetWithLogging(ASSETS.enemies.hero.run, IMAGES.enemies.hero, 'run', 'Hero');
        loadSpritesheetWithLogging(ASSETS.enemies.hero.attack, IMAGES.enemies.hero, 'attack', 'Hero');
        loadSpritesheetWithLogging(ASSETS.enemies.hero.run_left, IMAGES.enemies.hero, 'run_left', 'Hero');
        loadSpritesheetWithLogging(ASSETS.enemies.hero.run_right, IMAGES.enemies.hero, 'run_right', 'Hero');
        loadSpritesheetWithLogging(ASSETS.enemies.hero.attack_left, IMAGES.enemies.hero, 'attack_left', 'Hero');
        loadSpritesheetWithLogging(ASSETS.enemies.hero.attack_right, IMAGES.enemies.hero, 'attack_right', 'Hero');
        
        console.log('Loading Martial Hero');
        loadSpritesheetWithLogging(ASSETS.enemies.martialHero.run, IMAGES.enemies.martialHero, 'run', 'Martial Hero');
        loadSpritesheetWithLogging(ASSETS.enemies.martialHero.attack, IMAGES.enemies.martialHero, 'attack', 'Martial Hero');
        loadSpritesheetWithLogging(ASSETS.enemies.martialHero.run_left, IMAGES.enemies.martialHero, 'run_left', 'Martial Hero');
        loadSpritesheetWithLogging(ASSETS.enemies.martialHero.run_right, IMAGES.enemies.martialHero, 'run_right', 'Martial Hero');
        loadSpritesheetWithLogging(ASSETS.enemies.martialHero.attack_left, IMAGES.enemies.martialHero, 'attack_left', 'Martial Hero');
        loadSpritesheetWithLogging(ASSETS.enemies.martialHero.attack_right, IMAGES.enemies.martialHero, 'attack_right', 'Martial Hero');
        
    
        console.log('Loading food');
        loadFoodSprite(ASSETS.food.sushi, IMAGES.food, 'sushi');
        loadFoodSprite(ASSETS.food.nigiri, IMAGES.food, 'nigiri');
        
        console.log('Loading effects');
        loadImageOptionally(ASSETS.effects.shieldAura, IMAGES.effects, 'shieldAura');
        loadImageOptionally(ASSETS.effects.attackAura, IMAGES.effects, 'attackAura');
        
        
        for (let i = 1; i <= 6; i++) {
            const frameName = `frame${i}`;
            if (ASSETS.effects.slash[frameName]) {
                loadImageOptionally(ASSETS.effects.slash[frameName], IMAGES.effects.slash, frameName);
            }
        }
        
        initSoundEffects();
        
        setTimeout(() => {
            checkLoadingStatus();
        }, 3000);
        
        IMAGES.loaded = true;
        console.log('Asset loading completed');
        
    } catch (error) {
        console.log('Some assets failed to load:', error);
        IMAGES.loaded = true;
    }
}

// загрузка хавки
function loadFoodSprite(src, targetObject, propertyName) {
    if (!src) {
        console.log(`No source path for food: ${propertyName}`);
        targetObject[propertyName] = null;
        return;
    }
    
    const img = new Image();
    
    img.onload = function() {
        targetObject[propertyName] = img;
        console.log(`Food loaded: ${propertyName} (${img.width}x${img.height})`);
    };
    
    img.onerror = function() {
        console.log(`FAILED to load food: ${propertyName} from ${src}`);
        targetObject[propertyName] = null;
    };
    
    console.log(`Loading food: ${propertyName}: ${src}`);
    img.src = src;
}

function loadSpritesheetWithLogging(src, targetObject, propertyName, enemyType) {
    if (!src) {
        console.log(`${enemyType}.${propertyName}: No source path`);
        targetObject[propertyName] = null;
        return;
    }
    
    const img = new Image();
    
    img.onload = function() {
        targetObject[propertyName] = img;
        console.log(`${enemyType} loaded: ${propertyName} (${img.width}x${img.height})`);
        
        if (enemyType === 'Hero') {
            if (propertyName === 'attack_left' || propertyName === 'attack_right') {
                const frames = Math.round(img.width / img.height);
                console.log(`Hero Attack Direction: ${frames} frames (expected: 4)`);
            } else if (propertyName === 'run_left' || propertyName === 'run_right') {
                const frames = Math.round(img.width / img.height);
                console.log(`Hero Run Direction: ${frames} frames (expected: 8)`);
            }
        }
        
        if (enemyType === 'Martial Hero') {
            if (propertyName === 'attack_left' || propertyName === 'attack_right') {
                const frames = Math.round(img.width / img.height);
                console.log(`Martial Hero Attack Direction: ${frames} frames (expected: 6)`);
            } else if (propertyName === 'run_left' || propertyName === 'run_right') {
                const frames = Math.round(img.width / img.height);
                console.log(`Martial Hero Run Direction: ${frames} frames (expected: 8)`);
            }
        }
    };
    
    img.onerror = function() {
        console.log(`FAILED to load ${enemyType}.${propertyName} from ${src}`);
        targetObject[propertyName] = null;
    };
    
    console.log(`Loading ${enemyType}.${propertyName}: ${src}`);
    img.src = src;
}

function checkLoadingStatus() {
    console.log('Checking loading status...');
    
    const hero = IMAGES.enemies.hero;
    console.log('Hero status:');
    console.log(`  run: ${hero.run ? 'YES' : 'NO'}`);
    console.log(`  attack: ${hero.attack ? 'YES' : 'NO'}`);
    console.log(`  run_left: ${hero.run_left ? 'YES' : 'NO'}`);
    console.log(`  run_right: ${hero.run_right ? 'YES' : 'NO'}`);
    console.log(`  attack_left: ${hero.attack_left ? 'YES' : 'NO'}`);
    console.log(`  attack_right: ${hero.attack_right ? 'YES' : 'NO'}`);
    
    const martialHero = IMAGES.enemies.martialHero;
    console.log('Martial Hero status:');
    console.log(`  run: ${martialHero.run ? 'YES' : 'NO'}`);
    console.log(`  attack: ${martialHero.attack ? 'YES' : 'NO'}`);
    console.log(`  run_left: ${martialHero.run_left ? 'YES' : 'NO'}`);
    console.log(`  run_right: ${martialHero.run_right ? 'YES' : 'NO'}`);
    console.log(`  attack_left: ${martialHero.attack_left ? 'YES' : 'NO'}`);
    console.log(`  attack_right: ${martialHero.attack_right ? 'YES' : 'NO'}`);
    
    const food = IMAGES.food;
    console.log('Food status:');
    console.log(`  sushi: ${food.sushi ? 'YES' : 'NO'}`);
    console.log(`  nigiri: ${food.nigiri ? 'YES' : 'NO'}`);
    
    const heroReady = hero.run && hero.attack && hero.run_left && hero.run_right && hero.attack_left && hero.attack_right;
    const martialReady = martialHero.run && martialHero.attack && martialHero.run_left && martialHero.run_right && martialHero.attack_left && martialHero.attack_right;
    const foodReady = food.sushi && food.nigiri;
    
    console.log(`\nREADINESS STATUS:`);
    console.log(`Hero ready: ${heroReady ? 'YES' : 'NO'}`);
    console.log(`Martial Hero ready: ${martialReady ? 'YES' : 'NO'}`);
    console.log(`Food ready: ${foodReady ? 'YES' : 'NO'}`);
    
    if (heroReady && martialReady && foodReady) {
        console.log('All assets loaded successfully');
    } else {
        console.log('Some assets missing');
    }
}

function initSoundEffects() {
    console.log('Initializing sound effects');
    
    try {
        if (!AUDIO.swordSlash) {
            AUDIO.swordSlash = new Audio();
            AUDIO.swordSlash.volume = 0.7;
            AUDIO.swordSlash.src = ASSETS.audio.swordSlash || '';
        }
        
        if (!AUDIO.enemyHit) {
            AUDIO.enemyHit = new Audio();
            AUDIO.enemyHit.volume = 0.6;
            AUDIO.enemyHit.src = ASSETS.audio.enemyHit || '';
        }
        
        if (!AUDIO.playerHit) {
            AUDIO.playerHit = new Audio();
            AUDIO.playerHit.volume = 0.7;
            AUDIO.playerHit.src = ASSETS.audio.playerHit || '';
        }
        
        if (!AUDIO.gameOver) {
            AUDIO.gameOver = new Audio();
            AUDIO.gameOver.volume = 0.8;
            AUDIO.gameOver.src = ASSETS.audio.gameOver || '';
        }
        
        if (!AUDIO.spherePickup) {
            AUDIO.spherePickup = new Audio();
            AUDIO.spherePickup.volume = 0.5;
            AUDIO.spherePickup.src = ASSETS.audio.spherePickup || '';
        }
        
        if (!AUDIO.buffActivate) {
            AUDIO.buffActivate = new Audio();
            AUDIO.buffActivate.volume = 0.6;
            AUDIO.buffActivate.src = ASSETS.audio.buffActivate || '';
        }
        
        if (!AUDIO.foodPickup) {
            AUDIO.foodPickup = new Audio();
            AUDIO.foodPickup.volume = 0.6;
            AUDIO.foodPickup.src = ASSETS.audio.foodPickup || '';
        }
        
        console.log('Sound effects initialized');
        
    } catch (error) {
        console.log('Sound initialization error:', error);
    }
}

function loadImageSilently(src, targetObject, propertyName) {
    const img = new Image();
    img.onload = function() {
        targetObject[propertyName] = img;
        console.log('Loaded:', propertyName);
    };
    img.onerror = function() {
        console.log('Failed to load:', propertyName);
        targetObject[propertyName] = null;
    };
    img.src = src;
}

function loadImageOptionally(src, targetObject, propertyName) {
    if (!src) return;
    
    const img = new Image();
    img.onload = function() {
        targetObject[propertyName] = img;
        console.log('Optional loaded:', propertyName);
    };
    img.onerror = function() {
        console.log('Optional not found:', propertyName);
        targetObject[propertyName] = null;
    };
    img.src = src;
}

function loadBackgroundSilently() {
    const img = new Image();
    img.onload = function() {
        IMAGES.background = img;
        console.log('Background loaded');
        
        if (typeof gameRunning !== 'undefined' && !gameRunning && typeof drawStartScreen === 'function') {
            drawStartScreen();
        }
    };
    img.onerror = function() {
        console.log('Background failed to load, using fallback');
    };
    img.src = ASSETS.background;
}

// DEBUG 
function debugEnemySprites() {
    console.log('DEBUGGING ENEMY SPRITES:');
    
    Object.keys(IMAGES.enemies).forEach(enemyType => {
        console.log(`\n${enemyType.toUpperCase()}:`);
        const enemySprites = IMAGES.enemies[enemyType];
        
        Object.keys(enemySprites).forEach(spriteName => {
            const sprite = enemySprites[spriteName];
            if (sprite) {
                const status = sprite.complete && sprite.naturalHeight > 0 ? 'READY' : 'LOADING';
                console.log(`  ${spriteName}: ${status} (${sprite.width}x${sprite.height})`);
                
                if (spriteName.includes('attack')) {
                    console.log(`    ATTACK SPRITE: ${status === 'READY' ? 'ANIMATION READY' : 'NOT READY'}`);
                }
                if (spriteName.includes('run')) {
                    console.log(`    RUN SPRITE: ${status === 'READY' ? 'ANIMATION READY' : 'NOT READY'}`);
                }
            } else {
                console.log(`  ${spriteName}: NULL`);
                if (spriteName.includes('attack')) {
                    console.log(`    MISSING ATTACK SPRITE`);
                }
            }
        });
    });
}

function debugFoodSystem() {
    console.log('FOOD SYSTEM DEBUG:');
    console.log(`  Sushi sprite: ${IMAGES.food.sushi ? 'LOADED' : 'MISSING'}`);
    console.log(`  Nigiri sprite: ${IMAGES.food.nigiri ? 'LOADED' : 'MISSING'}`);
    
    if (typeof CONFIG !== 'undefined' && CONFIG.food) {
        console.log(`  Sushi drop chance: ${(CONFIG.food.sushi.dropChance * 100)}%`);
        console.log(`  Nigiri drop chance: ${(CONFIG.food.nigiri.dropChance * 100)}%`);
        console.log(`  Sushi heal: ${CONFIG.food.sushi.healAmount} HP`);
        console.log(`  Nigiri heal: ${CONFIG.food.nigiri.healAmount} HP`);
        console.log(`  Sushi size: ${CONFIG.food.sushi.width}x${CONFIG.food.sushi.height}`);
        console.log(`  Nigiri size: ${CONFIG.food.nigiri.width}x${CONFIG.food.nigiri.height}`);
    }
    
    if (typeof foodDrops !== 'undefined') {
        console.log(`  Active food drops: ${foodDrops.length}`);
        
        if (foodDrops.length > 0) {
            console.log('\nACTIVE FOOD DROPS:');
            foodDrops.forEach((food, index) => {
                console.log(`  ${index}: ${food.type}, Life: ${food.life}, Grounded: ${food.isGrounded}, Heal: ${food.healAmount} HP`);
                console.log(`    Position: (${Math.round(food.x)}, ${Math.round(food.y)})`);
                console.log(`    Size: ${food.width}x${food.height}`);
            });
        }
    }
}

// Экспорт функций
window.debugEnemySprites = debugEnemySprites;
window.debugFoodSystem = debugFoodSystem;
window.checkLoadingStatus = checkLoadingStatus;
