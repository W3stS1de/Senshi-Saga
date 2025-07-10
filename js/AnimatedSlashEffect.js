const SLASH_ANIMATION_CONFIG = {
    frameCount: 6,           
    frameDuration: 3,        
    totalDuration: 18,       
    scale: 0.6,              
    alpha: 0.9,              
    

    assets: {
        frame1: 'assets/effects/slash_frame_1.png',
        frame2: 'assets/effects/slash_frame_2.png',
        frame3: 'assets/effects/slash_frame_3.png',
        frame4: 'assets/effects/slash_frame_4.png',
        frame5: 'assets/effects/slash_frame_5.png',
        frame6: 'assets/effects/slash_frame_6.png'
    }
};


class SlashSpriteLoader {
    constructor() {
        this.sprites = {};
        this.loaded = false;
        this.loadingProgress = 0;
        this.totalFrames = SLASH_ANIMATION_CONFIG.frameCount;
        this.fallbackMode = false; // Флаг для fallback режима
        
        this.loadSlashSprites();
    }
    
    loadSlashSprites() {
        console.log('🗡️ Loading slash animation sprites...');
        
        let loadedCount = 0;
        let failedCount = 0;
        
        
        Object.keys(SLASH_ANIMATION_CONFIG.assets).forEach((frameKey, index) => {
            const framePath = SLASH_ANIMATION_CONFIG.assets[frameKey];
            const img = new Image();
            
            img.onload = () => {
                this.sprites[frameKey] = img;
                loadedCount++;
                this.loadingProgress = loadedCount / this.totalFrames;
                
                console.log(`✅ Slash frame ${index + 1} loaded (${img.width}x${img.height})`);
                
                if (loadedCount === this.totalFrames) {
                    this.loaded = true;
                    this.fallbackMode = false;
                    console.log('🎉 All slash animation frames loaded!');
                }
            };
            
            img.onerror = () => {
                console.log(`❌ Failed to load slash frame ${index + 1}: ${framePath}`);
                failedCount++;
                
                // fallback спрайт
                this.sprites[frameKey] = this.createFallbackFrame(index + 1);
                loadedCount++;
                this.loadingProgress = loadedCount / this.totalFrames;
                
                if (loadedCount === this.totalFrames) {
                    this.loaded = true;
                    this.fallbackMode = failedCount > 0;
                    console.log(`⚠️ Slash animation loaded with ${failedCount} fallback frames`);
                }
            };
            
            
            setTimeout(() => {
                if (!img.complete) {
                    console.log(`⏰ Timeout loading frame ${index + 1}, using fallback`);
                    img.onerror();
                }
            }, 2000); // 2 сек таймаут
            
            img.src = framePath;
        });
        
        
        setTimeout(() => {
            if (!this.loaded) {
                console.log('🚨 Force enabling slash system with fallbacks');
                this.loaded = true;
                this.fallbackMode = true;
                
                
                for (let i = 1; i <= this.totalFrames; i++) {
                    const frameKey = `frame${i}`;
                    if (!this.sprites[frameKey]) {
                        this.sprites[frameKey] = this.createFallbackFrame(i);
                    }
                }
            }
        }, 3000);
    }
    
    
    createFallbackFrame(frameNumber) {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        
        const centerX = 64;
        const centerY = 64;
        const progress = frameNumber / this.totalFrames;
        const maxRadius = 50;
        const currentRadius = maxRadius * progress;
        
        ctx.save();
        ctx.globalAlpha = Math.max(0.3, 1 - progress * 0.7);
        
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, currentRadius);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.3, '#ffdd44');
        gradient.addColorStop(0.7, '#ff8844');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        // слэш
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 8 - frameNumber;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        const startAngle = -Math.PI / 4;
        const endAngle = Math.PI / 4;
        ctx.arc(centerX, centerY, currentRadius, startAngle, endAngle);
        ctx.stroke();

        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, currentRadius * 0.8, startAngle, endAngle);
        ctx.fill();
        
        ctx.restore();
        
        const img = new Image();
        img.src = canvas.toDataURL();
        return img;
    }
    
    getFrame(frameNumber) {
        if (!this.loaded) return null;
        
        const frameKey = `frame${frameNumber}`;
        return this.sprites[frameKey] || null;
    }
    
    isReady() {
        return this.loaded;
    }
    
    isFallbackMode() {
        return this.fallbackMode;
    }
}


let slashSpriteLoader = null;

function initSlashSpriteLoader() {
    if (!slashSpriteLoader) {
        slashSpriteLoader = new SlashSpriteLoader();
        console.log('🗡️ Slash sprite loader initialized');
    }
    return slashSpriteLoader;
}

class AnimatedSlashEffect {
    constructor(x, y, direction, range) {
        this.x = x;
        this.y = y;
        this.direction = direction; 
        this.range = range;
        this.life = SLASH_ANIMATION_CONFIG.totalDuration;
        this.maxLife = SLASH_ANIMATION_CONFIG.totalDuration;

        this.currentFrame = 1; 
        this.frameTimer = 0;
        this.frameDuration = SLASH_ANIMATION_CONFIG.frameDuration;
        
        // Вижуал 
        this.scale = SLASH_ANIMATION_CONFIG.scale;
        this.alpha = SLASH_ANIMATION_CONFIG.alpha;
        this.rotation = direction === 'left' ? Math.PI : 0; // Поворот для левого направления
        
        // Позиц
        this.offsetX = direction === 'right' ? 20 : -20;
        this.offsetY = -10;
        
        
        if (!slashSpriteLoader) {
            initSlashSpriteLoader();
        }
        
        console.log(`🗡️ AnimatedSlashEffect created: direction=${direction}, frames=6, loader=${slashSpriteLoader ? 'ready' : 'missing'}`);
    }
    
    update() {
        this.life--;
        this.frameTimer++;
        
        // переключ. кадров
        if (this.frameTimer >= this.frameDuration) {
            this.frameTimer = 0;
            this.currentFrame++;
            
            
            if (this.currentFrame > SLASH_ANIMATION_CONFIG.frameCount) {
                this.life = 0; 
            }
        }
        
    
        const lifeRatio = this.life / this.maxLife;
        this.alpha = SLASH_ANIMATION_CONFIG.alpha * Math.max(0.2, lifeRatio);
    }
    
    draw() {
        
        if (!slashSpriteLoader) {
            this.drawSimpleFallback();
            return;
        }
        
        if (!slashSpriteLoader.isReady()) {
            this.drawSimpleFallback();
            return;
        }
        
      
        const frameSprite = slashSpriteLoader.getFrame(this.currentFrame);
        if (!frameSprite) {
            this.drawSimpleFallback();
            return;
        }
        
        ctx.save();
        
        
        const drawX = this.x + this.offsetX;
        const drawY = this.y + this.offsetY;
        
        // отрисовка
        ctx.globalAlpha = this.alpha;
        ctx.globalCompositeOperation = 'screen'; // Эффект свечения
        
        // мастабирование
        ctx.translate(drawX, drawY);
        if (this.direction === 'left') {
            ctx.scale(-1, 1); 
        }
        ctx.scale(this.scale, this.scale);
        
        // сайз отрисовки
        const spriteWidth = frameSprite.width;
        const spriteHeight = frameSprite.height;
        
        // отрисовка кадра
        ctx.drawImage(
            frameSprite,
            -spriteWidth / 2,  // по X
            -spriteHeight / 2, // по Y
            spriteWidth,
            spriteHeight
        );
        
        ctx.restore();
    }
    
    drawSimpleFallback() {
        ctx.save();
        
        ctx.globalAlpha = this.alpha;
        ctx.strokeStyle = '#ffffff';
        ctx.shadowColor = '#ffdd44';
        ctx.shadowBlur = 10;
        ctx.lineWidth = 4 + (SLASH_ANIMATION_CONFIG.frameCount - this.currentFrame);
        ctx.lineCap = 'round';
        
        
        ctx.beginPath();
        if (this.direction === 'right') {
            ctx.arc(this.x, this.y, this.range * 0.8, -Math.PI/3, Math.PI/3);
        } else {
            ctx.arc(this.x, this.y, this.range * 0.8, 2*Math.PI/3, 4*Math.PI/3);
        }
        ctx.stroke();
        
        ctx.globalAlpha = this.alpha * 0.5;
        ctx.strokeStyle = '#ffaa00';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.restore();
    }
    
    // проверка завершения
    isFinished() {
        return this.life <= 0;
    }
    
    getFrameInfo() {
        return {
            currentFrame: this.currentFrame,
            totalFrames: SLASH_ANIMATION_CONFIG.frameCount,
            life: this.life,
            maxLife: this.maxLife,
            loaderReady: slashSpriteLoader ? slashSpriteLoader.isReady() : false,
            fallbackMode: slashSpriteLoader ? slashSpriteLoader.isFallbackMode() : true
        };
    }
}

function initSlashAnimationSystem() {
    console.log('Initializing slash animation system...');
    
    const loader = initSlashSpriteLoader();
    
    if (typeof ASSETS !== 'undefined') {
        ASSETS.effects = ASSETS.effects || {};
        ASSETS.effects.slash = SLASH_ANIMATION_CONFIG.assets;
    }
    
    console.log(' Slash animation system initialized');
    console.log(` Sprite paths configured: ${Object.keys(SLASH_ANIMATION_CONFIG.assets).length} frames`);
    
    return {
        loader: loader,
        config: SLASH_ANIMATION_CONFIG,
        AnimatedSlashEffect: AnimatedSlashEffect
    };
}

if (typeof window !== 'undefined') {
    window.AnimatedSlashEffect = AnimatedSlashEffect;
    window.SlashSpriteLoader = SlashSpriteLoader;
    window.initSlashAnimationSystem = initSlashAnimationSystem;
    window.initSlashSpriteLoader = initSlashSpriteLoader;
    window.SLASH_ANIMATION_CONFIG = SLASH_ANIMATION_CONFIG;
}

window.testSlashAnimation = function() {
    if (typeof player !== 'undefined' && typeof gameRunning !== 'undefined' && gameRunning) {
        const slashX = player.facing === 'right' ? 
            player.x + player.width : 
            player.x - (CONFIG?.player?.attackRange || 120);
        
        if (typeof slashEffects !== 'undefined') {
            slashEffects.push(new AnimatedSlashEffect(
                slashX,
                player.y + player.height / 2,
                player.facing,
                CONFIG?.player?.attackRange || 120
            ));
            
            console.log(' Test animated slash animation created');
        } else {
            console.log(' slashEffects array not found');
        }
    } else {
        console.log(' Game not running or player not found');
    }
};

window.debugSlashLoader = function() {
    if (slashSpriteLoader) {
        console.log(' Slash Loader Status:');
        console.log(`  Loaded: ${slashSpriteLoader.isReady()}`);
        console.log(`  Progress: ${(slashSpriteLoader.loadingProgress * 100).toFixed(1)}%`);
        console.log(`  Fallback Mode: ${slashSpriteLoader.isFallbackMode()}`);
        console.log(`  Sprites:`, Object.keys(slashSpriteLoader.sprites));
        
        // Тестируем каждый кадр
        for (let i = 1; i <= SLASH_ANIMATION_CONFIG.frameCount; i++) {
            const frame = slashSpriteLoader.getFrame(i);
            console.log(`  Frame ${i}: ${frame ? 'Available' : ' Missing'}`);
        }
    } else {
        console.log(' Slash loader not initialized');
        console.log(' Try calling initSlashAnimationSystem() first');
    }
};

window.forceSlashFallback = function() {
    if (slashSpriteLoader) {
        slashSpriteLoader.fallbackMode = true;
        console.log('🔄 Forced slash system into fallback mode');
    }
};

window.createTestSlash = function() {
    
    const testSlash = new AnimatedSlashEffect(
        400, // x
        250, // y
        'right', // direction
        100 // range
    );
    
    console.log('🧪 Test slash created:', testSlash.getFrameInfo());
    return testSlash;
};


if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                initSlashAnimationSystem();
            }, 1000);
        });
    } else {
        setTimeout(() => {
            initSlashAnimationSystem();
        }, 100);
    }
}
