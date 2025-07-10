const SHIELD_AURA_CONFIG = {
    // Настройки спрайтшита 
    spritesheet: {
        path: 'assets/effects/shield_aura.png', 
        frameCount: 30,        
        columns: 5,            
        rows: 6,               
        frameWidth: 0,         
        frameHeight: 0,        
        frameDuration: 3       
    },
    
    // Вижуал
    visual: {
        scale: 1.8,            
        opacity: 0.85,         
        offsetX: 0,            
        offsetY: -15,          
        rotation: 0.01,        
        blend: 'screen',       
        pulseIntensity: 0.15  
    },
    
    // настройки анимац
    animation: {
        loop: true,            
        autoPlay: true,        
        pingPong: false,       
        randomStart: true,     
        speedMultiplier: 1.0,  
        readingOrder: 'row-by-row' 
    },
    
    // Эффекты
    effects: {
        enablePulse: true,     
        enableRotation: true,  
        enableGlow: true,      
        glowColor: '#00ffcc',  
        glowIntensity: 15      
    },
    
    // Поведение
    behavior: {
        fadeInDuration: 30,    
        fadeOutDuration: 45,   
        syncWithShieldBuff: true,  
        showOnActivation: true,    
        hideOnDeactivation: true  
    }
};

class ShieldAura {
    constructor(target) {
        this.target = target;                    
        this.sprite = null;                      
        this.loaded = false;                     
        
        // Параметры сетки 
        this.columns = SHIELD_AURA_CONFIG.spritesheet.columns;
        this.rows = SHIELD_AURA_CONFIG.spritesheet.rows;
        this.frameCount = SHIELD_AURA_CONFIG.spritesheet.frameCount;
        this.readingOrder = SHIELD_AURA_CONFIG.animation.readingOrder;
        
        // Анимационные параметры
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.frameDuration = SHIELD_AURA_CONFIG.spritesheet.frameDuration;
        this.frameWidth = 0;
        this.frameHeight = 0;
        
        // Состояние
        this.active = false;
        this.visible = true;
        this.alpha = SHIELD_AURA_CONFIG.visual.opacity;
        
        // Эффекты
        this.pulsePhase = 0;                     
        this.rotationAngle = 0;                 

        this.loadSprite();
        
        console.log(`Shield aura system initialized for ${this.columns}x${this.rows} grid`);
    }
    
    // Загрузка 
    loadSprite() {
        this.sprite = new Image();
        
        this.sprite.onload = () => {
            
            this.frameWidth = this.sprite.width / this.columns;
            this.frameHeight = this.sprite.height / this.rows;
            
            SHIELD_AURA_CONFIG.spritesheet.frameWidth = this.frameWidth;
            SHIELD_AURA_CONFIG.spritesheet.frameHeight = this.frameHeight;
            
            this.loaded = true;
            
            
            if (SHIELD_AURA_CONFIG.animation.randomStart) {
                this.currentFrame = Math.floor(Math.random() * this.frameCount);
            }
            
            console.log(`Shield aura sprite loaded: ${this.sprite.width}x${this.sprite.height}`);
            console.log(`Grid: ${this.columns}x${this.rows}, Frame size: ${this.frameWidth}x${this.frameHeight}`);
            console.log(`Total frames: ${this.frameCount}, Reading order: ${this.readingOrder}`);
        };
        
        this.sprite.onerror = () => {
            console.log('Failed to load shield aura sprite');
            this.loaded = false;
        };
        
        this.sprite.src = SHIELD_AURA_CONFIG.spritesheet.path;
    }
    
    getFramePosition(frameIndex) {
        if (this.readingOrder === 'row-by-row') {
            
            const row = Math.floor(frameIndex / this.columns);
            const col = frameIndex % this.columns;
            return { row, col };
        } else {
            
            const col = Math.floor(frameIndex / this.rows);
            const row = frameIndex % this.rows;
            return { row, col };
        }
    }
    
    getSourceCoordinates(frameIndex) {
        const { row, col } = this.getFramePosition(frameIndex);
        
        return {
            srcX: col * this.frameWidth,
            srcY: row * this.frameHeight,
            srcWidth: this.frameWidth,
            srcHeight: this.frameHeight
        };
    }
    
    // Активация ауры
    activate() {
        this.active = true;
        this.visible = true;
        this.alpha = SHIELD_AURA_CONFIG.visual.opacity;
        console.log('Shield aura activated');
    }
    
    // Деактивация ауры
    deactivate() {
        this.active = false;
        
        this.fadeOut();
    }
    
    fadeOut() {
        const fadeSpeed = 0.05;
        if (this.alpha > 0) {
            this.alpha -= fadeSpeed;
            if (this.alpha <= 0) {
                this.alpha = 0;
                this.visible = false;
                console.log('Shield aura deactivated');
            }
        }
    }
    

    update() {
        if (!this.loaded || !this.visible) return;
        
       
        this.updateFrameAnimation();
        
     
        this.updateEffects();
        
        
        if (!this.active) {
            this.fadeOut();
        }
    }
    
    // анимация кадров
    updateFrameAnimation() {
        this.frameTimer++;
        
        if (this.frameTimer >= this.frameDuration) {
            this.frameTimer = 0;
            
            
            if (SHIELD_AURA_CONFIG.animation.pingPong) {
                // Режим туда-сюда
                if (this.direction === undefined) this.direction = 1;
                
                this.currentFrame += this.direction;
                
                if (this.currentFrame >= this.frameCount - 1) {
                    this.direction = -1;
                } else if (this.currentFrame <= 0) {
                    this.direction = 1;
                }
            } else {
                // Обычный цикл
                this.currentFrame = (this.currentFrame + 1) % this.frameCount;
            }
        }
    }
    
    
    updateEffects() {
        // Пульсирование прозрачности
        this.pulsePhase += 0.1;
        
        // Вращение 
        if (SHIELD_AURA_CONFIG.visual.rotation !== 0) {
            this.rotationAngle += SHIELD_AURA_CONFIG.visual.rotation;
            if (this.rotationAngle >= Math.PI * 2) {
                this.rotationAngle = 0;
            }
        }
    }
    
    draw(ctx) {
        if (!this.loaded || !this.visible || this.alpha <= 0 || !this.target) return;
        
        ctx.save();
        
        // Позиция ауры 
        const centerX = this.target.x + this.target.width / 2 + SHIELD_AURA_CONFIG.visual.offsetX;
        const centerY = this.target.y + this.target.height / 2 + SHIELD_AURA_CONFIG.visual.offsetY;
        
        // Размеры отрисовки
        const drawWidth = this.frameWidth * SHIELD_AURA_CONFIG.visual.scale;
        const drawHeight = this.frameHeight * SHIELD_AURA_CONFIG.visual.scale;
        
        // Позиция отрисовки 
        const drawX = centerX - drawWidth / 2;
        const drawY = centerY - drawHeight / 2;
        
        ctx.globalAlpha = this.alpha;
        
        if (SHIELD_AURA_CONFIG.visual.blend) {
            ctx.globalCompositeOperation = SHIELD_AURA_CONFIG.visual.blend;
        }
        
        // Поворот 
        if (this.rotationAngle !== 0) {
            ctx.translate(centerX, centerY);
            ctx.rotate(this.rotationAngle);
            ctx.translate(-centerX, -centerY);
        }
        
        const { srcX, srcY, srcWidth, srcHeight } = this.getSourceCoordinates(this.currentFrame);
        
        // Отрисовка
        ctx.drawImage(
            this.sprite,
            srcX, srcY, srcWidth, srcHeight,      
            drawX, drawY, drawWidth, drawHeight   
        );
        
        ctx.restore();
    }
    
    isActive() {
        return this.active && this.visible && this.alpha > 0;
    }
    
    setTarget(newTarget) {
        this.target = newTarget;
    }
    
    setScale(scale) {
        SHIELD_AURA_CONFIG.visual.scale = scale;
    }
    
    setOpacity(opacity) {
        SHIELD_AURA_CONFIG.visual.opacity = opacity;
        this.alpha = opacity;
    }
    
    debugCurrentFrame() {
        const { row, col } = this.getFramePosition(this.currentFrame);
        const { srcX, srcY } = this.getSourceCoordinates(this.currentFrame);
        
        console.log(`Debug Frame ${this.currentFrame}:`);
        console.log(`  Grid position: row ${row}, col ${col}`);
        console.log(`  Source coords: (${srcX}, ${srcY})`);
        console.log(`  Reading order: ${this.readingOrder}`);
    }
}

const UPDATED_SHIELD_AURA_CONFIG_FOR_CONFIG_JS = {
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
    }
    
   
};


function initShieldAuraSystem() {
    if (typeof player !== 'undefined') {
        player.shieldAura = new ShieldAura(player);
        console.log('Shield aura integrated');
    }
}

function updateShieldAura() {
    if (player.shieldAura) {
        
        if (player.buffs && player.buffs.shield && player.buffs.shield.active) {
            if (!player.shieldAura.isActive()) {
                player.shieldAura.activate();
            }
        } else {
            if (player.shieldAura.isActive()) {
                player.shieldAura.deactivate();
            }
        }
        
        player.shieldAura.update();
    }
}

function drawShieldAuraBehindPlayer(ctx) {
    if (player.shieldAura) {
        player.shieldAura.draw(ctx);
    }
}

function debugShieldAuraGrid() {
    if (player.shieldAura) {
        player.shieldAura.debugCurrentFrame();
        console.log(`Grid info: ${player.shieldAura.columns}x${player.shieldAura.rows}`);
        console.log(`Frame size: ${player.shieldAura.frameWidth}x${player.shieldAura.frameHeight}`);
    }
}

if (typeof window !== 'undefined') {
    window.ShieldAura = ShieldAura;
    window.SHIELD_AURA_CONFIG = SHIELD_AURA_CONFIG;
    window.initShieldAuraSystem = initShieldAuraSystem;
    window.updateShieldAura = updateShieldAura;
    window.drawShieldAuraBehindPlayer = drawShieldAuraBehindPlayer;
    window.debugShieldAuraGrid = debugShieldAuraGrid;
}
