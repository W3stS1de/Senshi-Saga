const ATTACK_AURA_CONFIG = {
    // Настройки спрайтшита 
    spritesheet: {
        path: 'assets/effects/attack_aura.png',
        frameCount: 30,        
        columns: 5,            
        rows: 6,               
        frameHeight: 0,        
        frameDuration: 4       
    },
    
    // Вижуал
    visual: {
        scale: 1.6,            
        opacity: 0.9,          
        offsetX: 0,            
        offsetY: -10,          
        rotation: 0.03,        
        blend: 'screen',       
        pulseIntensity: 0.2    
    },
    
    // Анимационные настройки
    animation: {
        loop: true,            
        autoPlay: true,        
        pingPong: false,       
        randomStart: true,     
        speedMultiplier: 1.2,  
        readingOrder: 'row-by-row' 
    },
    
    // Эффекты
    effects: {
        enablePulse: true,     
        enableRotation: true,  
        enableGlow: true,      
        glowColor: '#ff3333',  
        glowIntensity: 20      
    },
    
    // Поведение
    behavior: {
        fadeInDuration: 25,    
        fadeOutDuration: 35,   
        syncWithAttackBuff: true,  
        showOnActivation: true,   
        hideOnDeactivation: true  
    }
};

// управления анимацией ауры атаки 
class AttackAura {
    constructor(target) {
        this.target = target;                    
        this.sprite = null;                      
        this.loaded = false;                     
        
        // Параметры сетки спрайтшита
        this.columns = ATTACK_AURA_CONFIG.spritesheet.columns;
        this.rows = ATTACK_AURA_CONFIG.spritesheet.rows;
        this.frameCount = ATTACK_AURA_CONFIG.spritesheet.frameCount;
        this.readingOrder = ATTACK_AURA_CONFIG.animation.readingOrder;
        
        // Анимационные параметры
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.frameDuration = ATTACK_AURA_CONFIG.spritesheet.frameDuration;
        this.frameWidth = 0;
        this.frameHeight = 0;
        
        // Состояние
        this.active = false;
        this.visible = true;
        this.alpha = ATTACK_AURA_CONFIG.visual.opacity;
        
        // Эффекты
        this.pulsePhase = 0;                     
        this.rotationAngle = 0;                 
        
        this.loadSprite();
        
        console.log(`Attack aura system initialized for ${this.columns}x${this.rows} grid`);
    }
    
    // Загрузка спрайтшита сетки
    loadSprite() {
        this.sprite = new Image();
        
        this.sprite.onload = () => {
            
            this.frameWidth = this.sprite.width / this.columns;
            this.frameHeight = this.sprite.height / this.rows;
            
            ATTACK_AURA_CONFIG.spritesheet.frameWidth = this.frameWidth;
            ATTACK_AURA_CONFIG.spritesheet.frameHeight = this.frameHeight;
            
            this.loaded = true;
            
        
            if (ATTACK_AURA_CONFIG.animation.randomStart) {
                this.currentFrame = Math.floor(Math.random() * this.frameCount);
            }
            
            console.log(`Attack aura sprite loaded: ${this.sprite.width}x${this.sprite.height}`);
            console.log(` Grid: ${this.columns}x${this.rows}, Frame size: ${this.frameWidth}x${this.frameHeight}`);
            console.log(`Total frames: ${this.frameCount}, Reading order: ${this.readingOrder}`);
        };
        
        this.sprite.onerror = () => {
            console.log('Failed to load attack aura sprite');
            this.loaded = false;
        };
        
        this.sprite.src = ATTACK_AURA_CONFIG.spritesheet.path;
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
        this.alpha = ATTACK_AURA_CONFIG.visual.opacity;
        console.log('Attack aura activated');
    }
    
    // Деактивация ауры
    deactivate() {
        this.active = false;
        // Плавное исчезновение
        this.fadeOut();
    }
    
    // Плавное исчезновение
    fadeOut() {
        const fadeSpeed = 0.06; 
        if (this.alpha > 0) {
            this.alpha -= fadeSpeed;
            if (this.alpha <= 0) {
                this.alpha = 0;
                this.visible = false;
                console.log('Attack aura deactivated');
            }
        }
    }
    
    // Обновление анимации
    update() {
        if (!this.loaded || !this.visible) return;
        
        // Обновляем анимацию кадров
        this.updateFrameAnimation();
        
        // Обновляем доп эффекты
        this.updateEffects();
        
       
        if (!this.active) {
            this.fadeOut();
        }
    }
    
    // Обновление анимации кадров
    updateFrameAnimation() {
        this.frameTimer++;
        
        if (this.frameTimer >= this.frameDuration) {
            this.frameTimer = 0;
            
            // Переход к следующему кадру
            if (ATTACK_AURA_CONFIG.animation.pingPong) {
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
    
    // Обновление дополнительных эффектов
    updateEffects() {
        // Пульсирование прозрачности
        this.pulsePhase += 0.15;
        
        // Вращение
        if (ATTACK_AURA_CONFIG.visual.rotation !== 0) {
            this.rotationAngle += ATTACK_AURA_CONFIG.visual.rotation;
            if (this.rotationAngle >= Math.PI * 2) {
                this.rotationAngle = 0;
            }
        }
    }
    
    
    draw(ctx) {
        if (!this.loaded || !this.visible || this.alpha <= 0 || !this.target) return;
        
        ctx.save();
        
        // Позиция ауры 
        const centerX = this.target.x + this.target.width / 2 + ATTACK_AURA_CONFIG.visual.offsetX;
        const centerY = this.target.y + this.target.height / 2 + ATTACK_AURA_CONFIG.visual.offsetY;
        
        // Размеры отрисовки
        const drawWidth = this.frameWidth * ATTACK_AURA_CONFIG.visual.scale;
        const drawHeight = this.frameHeight * ATTACK_AURA_CONFIG.visual.scale;
        
        // Позиция отрисовки (центрируем)
        const drawX = centerX - drawWidth / 2;
        const drawY = centerY - drawHeight / 2;
        
        // Применяем эффекты
        let finalAlpha = this.alpha;
        
        if (ATTACK_AURA_CONFIG.effects.enablePulse) {
            const pulse = Math.sin(this.pulsePhase) * ATTACK_AURA_CONFIG.visual.pulseIntensity;
            finalAlpha += pulse;
            finalAlpha = Math.max(0, Math.min(1, finalAlpha));
        }
        
        ctx.globalAlpha = finalAlpha;
        
        // Режим наложения
        if (ATTACK_AURA_CONFIG.visual.blend) {
            ctx.globalCompositeOperation = ATTACK_AURA_CONFIG.visual.blend;
        }
        
        // Поворот 
        if (this.rotationAngle !== 0) {
            ctx.translate(centerX, centerY);
            ctx.rotate(this.rotationAngle);
            ctx.translate(-centerX, -centerY);
        }
        
        const { srcX, srcY, srcWidth, srcHeight } = this.getSourceCoordinates(this.currentFrame);
        
        // Отрисовываем кадр из сетки
        ctx.drawImage(
            this.sprite,
            srcX, srcY, srcWidth, srcHeight,      
            drawX, drawY, drawWidth, drawHeight   
        );
        
        ctx.restore();
    }
    
    // Проверка активности
    isActive() {
        return this.active && this.visible && this.alpha > 0;
    }
    
    // Установка цели
    setTarget(newTarget) {
        this.target = newTarget;
    }
    
    // Настройка масштаба
    setScale(scale) {
        ATTACK_AURA_CONFIG.visual.scale = scale;
    }
    
    // Настройка прозрачности
    setOpacity(opacity) {
        ATTACK_AURA_CONFIG.visual.opacity = opacity;
        this.alpha = opacity;
    }
    
    debugCurrentFrame() {
        const { row, col } = this.getFramePosition(this.currentFrame);
        const { srcX, srcY } = this.getSourceCoordinates(this.currentFrame);
        
        console.log(`Debug Attack Frame ${this.currentFrame}:`);
        console.log(`  Grid position: row ${row}, col ${col}`);
        console.log(`  Source coords: (${srcX}, ${srcY})`);
        console.log(`  Reading order: ${this.readingOrder}`);
    }
}

function initAttackAuraSystem() {
    if (typeof player !== 'undefined') {
        player.attackAura = new AttackAura(player);
        console.log('Attack aura system integrated (grid 5x6)');
    } else {
        console.log('Player not found, will retry attack aura init later');
    }
}

function updateAttackAura() {
    if (player.attackAura) {
    
        if (player.buffs && player.buffs.attack && player.buffs.attack.active) {
            if (!player.attackAura.isActive()) {
                player.attackAura.activate();
            }
        } else {
            if (player.attackAura.isActive()) {
                player.attackAura.deactivate();
            }
        }
        
        player.attackAura.update();
    }
}

function drawAttackAuraBehindPlayer(ctx) {
    if (player.attackAura) {
        player.attackAura.draw(ctx);
    }
}
function debugAttackAuraGrid() {
    if (player.attackAura) {
        player.attackAura.debugCurrentFrame();
        console.log(`Grid info: ${player.attackAura.columns}x${player.attackAura.rows}`);
        console.log(` Frame size: ${player.attackAura.frameWidth}x${player.attackAura.frameHeight}`);
    } else {
        console.log('Attack aura not initialized');
    }
}

if (typeof window !== 'undefined' && typeof window.ENHANCED_SPHERE_COLORS === 'undefined') {
    const ENHANCED_SPHERE_COLORS = {
        shield: '#cc66ff',      
        attack: '#ff66cc',      
        shieldGlow: '#aa44dd',  
        attackGlow: '#dd44aa'   
    };
    

    window.ENHANCED_SPHERE_COLORS = ENHANCED_SPHERE_COLORS;
}

if (typeof window !== 'undefined' && typeof window.EnhancedPowerSphere === 'undefined') {
    class EnhancedPowerSphere {
        constructor(x, y, type) {
            this.x = x;
            this.y = y;
            this.type = type;
            this.width = 36;      
            this.height = 36;     
            this.life = 800;      
            this.pulsePhase = Math.random() * Math.PI * 2; 
            this.floatOffset = Math.random() * Math.PI * 2;
            this.floatSpeed = 0.03;
            this.originalY = y;
        }
        
        update() {
            this.life--;
            this.pulsePhase += 0.12;
            this.floatOffset += this.floatSpeed;
            
            // Плавающее движение вверх-вниз
            this.y = this.originalY + Math.sin(this.floatOffset) * 3;
        }
        
        draw(ctx) {
            ctx.save();
            
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
            
            const baseRadius = 18;  
            const pulseRadius = baseRadius + Math.sin(this.pulsePhase) * 4; 
            // Цвета на основе изображения
            const colors = typeof window.ENHANCED_SPHERE_COLORS !== 'undefined' ? window.ENHANCED_SPHERE_COLORS : {
                shield: '#cc66ff', attack: '#ff66cc', shieldGlow: '#aa44dd', attackGlow: '#dd44aa'
            };
            
            const mainColor = this.type === 'shield' ? colors.shield : colors.attack;
            const glowColor = this.type === 'shield' ? colors.shieldGlow : colors.attackGlow;
            
            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseRadius);
            gradient.addColorStop(0, mainColor);
            gradient.addColorStop(0.4, this.type === 'shield' ? '#9933cc' : '#cc3399');
            gradient.addColorStop(0.7, this.type === 'shield' ? '#6600aa' : '#aa0066');
            gradient.addColorStop(1, 'rgba(102, 0, 170, 0.2)');
            
            ctx.shadowBlur = 20;  
            ctx.shadowColor = glowColor;
            
            // Основная сфера
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
            ctx.fill();
            
            
            ctx.shadowBlur = 30;  
            ctx.globalAlpha = 0.6;
            ctx.beginPath();
            ctx.arc(centerX, centerY, pulseRadius * 1.4, 0, Math.PI * 2); 
            ctx.fill();
            
            // Внутренний блик
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 0.8;
            const innerGradient = ctx.createRadialGradient(
                centerX - 4, centerY - 4, 0,  
                centerX, centerY, pulseRadius * 0.6
            );
            innerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            innerGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
            innerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = innerGradient;
            ctx.beginPath();
            ctx.arc(centerX - 3, centerY - 3, pulseRadius * 0.6, 0, Math.PI * 2); 
            
            ctx.restore();
        }
    }
    
    window.EnhancedPowerSphere = EnhancedPowerSphere;
}

if (typeof window !== 'undefined') {
    window.AttackAura = AttackAura;
    window.ATTACK_AURA_CONFIG = ATTACK_AURA_CONFIG;
    window.initAttackAuraSystem = initAttackAuraSystem;
    window.updateAttackAura = updateAttackAura;
    window.drawAttackAuraBehindPlayer = drawAttackAuraBehindPlayer;
    window.debugAttackAuraGrid = debugAttackAuraGrid;
    
    if (typeof player !== 'undefined' && !player.attackAura) {
        console.log('Auto-initializing attack aura system...');
        initAttackAuraSystem();
    }
}
