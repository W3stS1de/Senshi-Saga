class Enemy {
    constructor(type, x) {
        this.type = type;
        this.stats = CONFIG.enemies[type];
        this.x = x;
        this.width = this.stats.width;
        this.height = this.stats.height;
        this.health = this.stats.health;
        this.maxHealth = this.stats.health;
        this.speed = this.stats.speed;
        this.damage = this.stats.damage;
        this.color = this.stats.color;
        this.reward = this.stats.reward;
        this.attackRange = this.stats.attackRange;
        this.attackCooldown = 0;
        
        if (x < 0) {
            this.facing = 'right';
            this.targetDirection = 'right';
        } else {
            this.facing = 'left';
            this.targetDirection = 'left';
        }
        
        this.alignToGround();
        
        this.isAttacking = false;
        this.canDamagePlayer = false;
        this.attackLocked = false;
        this.currentState = 'moving';
        this.hit = false;
        this.hitTime = 0;
        
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.animationSpeed = this.stats.animationSpeed || 12;
        this.isSpritesheetType = this.stats.spritesheet || false;
        this.attackAnimationComplete = false;
        this.attackStartTime = 0;
        this.attackDuration = 1000;
        
        this.attackDirection = null;
        
        console.log(`Created ${type} at x=${x}, facing=${this.facing}, y=${this.y}`);
    }
    
    alignToGround() {
        const groundY = CONFIG.ground.y;
        const groundOffset = this.stats.groundOffset || 0;
        this.y = groundY - this.height + groundOffset;
        
        if (!this._alignedToGround) {
            console.log(`${this.type} aligned: y=${this.y} (ground=${groundY}, height=${this.height})`);
            this._alignedToGround = true;
        }
    }
    
    update() {
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }
        
        if (this.isAttacking) {
            this.handleAttackState();
        } else {
            this.handleMovementState();
        }
        
        if (this.isSpritesheetType) {
            this.updateAnimation();
        }
        
        if (this.hit) {
            this.hitTime--;
            if (this.hitTime <= 0) {
                this.hit = false;
            }
        }
    }
    
    handleAttackState() {
        const attackTime = Date.now() - this.attackStartTime;
        
        if (attackTime > 200 && attackTime < 500 && !this.canDamagePlayer) {
            this.canDamagePlayer = true;
            console.log(`${this.type} damage window opened`);
        }
        
        if (this.attackAnimationComplete || attackTime > this.attackDuration) {
            this.finishAttack();
        }
    }
    
    handleMovementState() {
        const playerCenterX = player.x + player.width / 2;
        const enemyCenterX = this.x + this.width / 2;
        const distance = Math.abs(playerCenterX - enemyCenterX);
        
        this.facing = playerCenterX > enemyCenterX ? 'right' : 'left';
        
        if (distance > this.attackRange) {
            this.currentState = 'moving';
            if (this.facing === 'right') {
                this.x += this.speed;
            } else {
                this.x -= this.speed;
            }
        } else {
            if (this.attackCooldown === 0 && !this.attackLocked) {
                this.startAttack();
            }
        }
    }
    
    startAttack() {
        this.attackDirection = this.facing;
        this.isAttacking = true;
        this.attackLocked = true;
        this.currentState = 'attacking';
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.attackAnimationComplete = false;
        this.attackStartTime = Date.now();
        this.canDamagePlayer = false;
        
        console.log(`${this.type} started attack facing ${this.attackDirection}`);
    }
    
    finishAttack() {
        this.isAttacking = false;
        this.attackLocked = false;
        this.canDamagePlayer = false;
        this.attackDirection = null;
        this.attackAnimationComplete = false;
        this.currentState = 'moving';
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.attackCooldown = this.stats.attackCooldown;
        
        console.log(`${this.type} finished attack`);
    }
    
    updateAnimation() {
        this.frameTimer++;
        if (this.frameTimer >= this.animationSpeed) {
            this.frameTimer = 0;
            
            let maxFrames = 1;
            
            if (this.type === 'hero') {
                if (this.currentState === 'attacking') {
                    maxFrames = this.stats.frames.attack || 4;
                } else {
                    maxFrames = this.stats.frames.run || 8;
                }
            } else if (this.type === 'martialHero') {
                if (this.currentState === 'attacking') {
                    maxFrames = this.stats.frames.attack || 6;
                } else {
                    maxFrames = this.stats.frames.run || 8;
                }
            }
            
            this.currentFrame = (this.currentFrame + 1) % maxFrames;
            
            if (this.currentState === 'attacking' && this.currentFrame === maxFrames - 1) {
                this.attackAnimationComplete = true;
            }
        }
    }
    
    draw() {
        ctx.save();
        
        if (this.hit) {
            ctx.filter = 'brightness(200%) saturate(150%)';
        }
        
        const success = this.attemptSpriteRender();
        
        if (!success) {
            this.drawFallback();
        }
        
        this.drawHealthBar();
        
        ctx.filter = 'none';
        ctx.restore();
    }
    
    attemptSpriteRender() {
        const enemyImages = IMAGES.enemies[this.type];
        if (!enemyImages) return false;
        
        let targetSprite = null;
        let spriteName = '';
        
        if (this.currentState === 'attacking') {
            const attackFacing = this.attackDirection || this.facing;
            
            if (attackFacing === 'left' && enemyImages.attack_left) {
                targetSprite = enemyImages.attack_left;
                spriteName = 'attack_left';
            } else if (attackFacing === 'right' && enemyImages.attack_right) {
                targetSprite = enemyImages.attack_right;
                spriteName = 'attack_right';
            } else if (enemyImages.attack) {
                targetSprite = enemyImages.attack;
                spriteName = 'attack';
            }
        } else {
            if (this.facing === 'left' && enemyImages.run_left) {
                targetSprite = enemyImages.run_left;
                spriteName = 'run_left';
            } else if (this.facing === 'right' && enemyImages.run_right) {
                targetSprite = enemyImages.run_right;
                spriteName = 'run_right';
            } else if (enemyImages.run) {
                targetSprite = enemyImages.run;
                spriteName = 'run';
            }
        }
        
        if (!targetSprite || !targetSprite.complete || targetSprite.naturalHeight === 0) {
            console.log(`Sprite ${spriteName} not ready for ${this.type}`);
            return false;
        }
        
        if (this.isSpritesheetType) {
            this.drawSpritesheet(targetSprite, spriteName);
        } else {
            ctx.drawImage(targetSprite, this.x, this.y, this.width, this.height);
        }
        
        return true;
    }
    
    drawSpritesheet(spritesheet, spriteName) {
        let frameCount = 1;
        
        if (this.type === 'hero') {
            if (spriteName.includes('attack')) {
                frameCount = this.stats.frames.attack || 4;
            } else {
                frameCount = this.stats.frames.run || 8;
            }
        } else if (this.type === 'martialHero') {
            if (spriteName.includes('attack')) {
                frameCount = this.stats.frames.attack || 6;
            } else {
                frameCount = this.stats.frames.run || 8;
            }
        }
        
        const frameWidth = spritesheet.width / frameCount;
        const frameHeight = spritesheet.height;
        const srcX = Math.min(this.currentFrame * frameWidth, spritesheet.width - frameWidth);
        
        ctx.drawImage(
            spritesheet,
            srcX, 0, frameWidth, frameHeight,
            this.x, this.y, this.width, this.height
        );
    }
    
    drawFallback() {
        ctx.fillStyle = this.hit ? 'white' : this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        const label = this.type === 'hero' ? 'HERO' : this.type === 'martialHero' ? 'BOSS' : this.type.toUpperCase();
        ctx.fillText(label, this.x + this.width/2, this.y + this.height/2);
        
        ctx.fillStyle = '#FFD700';
        ctx.font = '10px Arial';
        ctx.fillText(this.currentState, this.x + this.width/2, this.y + this.height/2 + 15);
        
        ctx.fillStyle = '#FFD700';
        const facing = this.currentState === 'attacking' && this.attackDirection ? this.attackDirection : this.facing;
        if (facing === 'right') {
            ctx.fillRect(this.x + this.width - 10, this.y + 10, 8, 4);
        } else {
            ctx.fillRect(this.x + 2, this.y + 10, 8, 4);
        }
    }
    
    drawHealthBar() {
        if (this.health < this.maxHealth) {
            const barWidth = this.width;
            const barHeight = 6;
            const barY = this.y - 12;
            
            ctx.fillStyle = '#333';
            ctx.fillRect(this.x, barY, barWidth, barHeight);
            
            const healthPercent = this.health / this.maxHealth;
            ctx.fillStyle = healthPercent > 0.5 ? '#4CAF50' : '#F44336';
            ctx.fillRect(this.x + 1, barY + 1, (barWidth - 2) * healthPercent, barHeight - 2);
        }
    }
    
    takeDamage(damage) {
        this.health -= damage;
        this.hit = true;
        this.hitTime = 15;
        
        console.log(`${this.type} took ${damage} damage, health: ${this.health}`);
        
        return this.health <= 0;
    }
}

class FoodDrop {
    constructor(x, y, type, enemyCenterX = null, enemyCenterY = null) {
        this.type = type;
        this.x = enemyCenterX ? enemyCenterX + (Math.random() - 0.5) * 40 : x;
        this.groundY = CONFIG.ground.y - 40;
        this.y = enemyCenterY ? enemyCenterY - 25 : y;
        this.targetY = this.groundY;
        
        if (type === 'sushi') {
            this.healAmount = CONFIG.food.sushi.healAmount;
            this.life = CONFIG.food.sushi.life;
            this.spritePath = 'assets/food/sushi.png';
            this.width = CONFIG.food.sushi.width;
            this.height = CONFIG.food.sushi.height;
            this.collectRadius = CONFIG.food.sushi.collectRadius;
        } else if (type === 'nigiri') {
            this.healAmount = CONFIG.food.nigiri.healAmount;
            this.life = CONFIG.food.nigiri.life;
            this.spritePath = 'assets/food/nigiri.png';
            this.width = CONFIG.food.nigiri.width;
            this.height = CONFIG.food.nigiri.height;
            this.collectRadius = CONFIG.food.nigiri.collectRadius;
        }
        
        this.maxLife = this.life;
        
        this.vy = -1.8;
        this.vx = (Math.random() - 0.5) * 2.5;
        this.gravity = 0.12;
        this.bounce = 0.25;
        this.isGrounded = false;
        this.bounceCount = 0;
        
        this.alpha = 1;
        this.scale = 1;
        
        this.spawnScale = 0.1;
        this.spawnGrow = 0.12;
        this.hasSpawned = false;
        
        this.sprite = null;
        this.loadSprite();
        
        console.log(`🍱 Food drop created: ${type}, Heal: +${this.healAmount} HP, Size: ${this.width}x${this.height} (NO ROTATION)`);
    }
    
    loadSprite() {
        this.sprite = new Image();
        this.sprite.onload = () => {
            console.log(`Food sprite loaded: ${this.type}`);
        };
        this.sprite.onerror = () => {
            console.log(`❌ Failed to load food sprite: ${this.type}`);
            this.sprite = null;
        };
        this.sprite.src = this.spritePath;
    }
    
    update() {
        this.life--;
        
        if (!this.hasSpawned) {
            this.spawnScale += this.spawnGrow;
            if (this.spawnScale >= 1) {
                this.spawnScale = 1;
                this.hasSpawned = true;
            }
        }
        
        if (!this.isGrounded) {
            this.vy += this.gravity;
            this.y += this.vy;
            this.x += this.vx;
            
            if (this.y >= this.targetY) {
                this.y = this.targetY;
                this.vy *= -this.bounce;
                this.vx *= 0.7;
                this.bounceCount++;
                
                if (this.bounceCount >= 2 || Math.abs(this.vy) < 0.3) {
                    this.isGrounded = true;
                    this.vy = 0;
                    this.vx = 0;
                }
            }
        } else {
            this.y = this.targetY + Math.sin(Date.now() * 0.003) * 0.5;
        }
        
        if (this.life < 100) {
            this.alpha = this.life / 100;
        }
        
        this.scale = this.hasSpawned ? this.spawnScale : this.spawnScale;
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        
        const drawX = this.x;
        const drawY = this.y;
        
        ctx.translate(drawX + this.width/2, drawY + this.height/2);
        ctx.scale(this.scale, this.scale);
        
        if (this.sprite && this.sprite.complete && this.sprite.naturalHeight > 0) {
            ctx.drawImage(
                this.sprite,
                -this.width/2,
                -this.height/2,
                this.width,
                this.height
            );
        } else {
            if (this.type === 'sushi') {
                ctx.fillStyle = '#ff9966';
            } else {
                ctx.fillStyle = '#66ff99';
            }
            ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
            
            ctx.fillStyle = 'white';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(this.type.toUpperCase(), 0, -5);
            ctx.font = 'bold 10px Arial';
            ctx.fillStyle = '#FFB6C1';
            ctx.fillText(`+${this.healAmount}`, 0, 8);
        }
        
        ctx.restore();
        
        if (this.isGrounded && this.life > 100) {
            ctx.save();
            ctx.globalAlpha = 0.15 * this.alpha;
            ctx.strokeStyle = this.type === 'sushi' ? '#ff9966' : '#66ff99';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + this.height/2, this.collectRadius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }
    
    checkCollision(player) {
        const dx = (this.x + this.width/2) - (player.x + player.width / 2);
        const dy = (this.y + this.height/2) - (player.y + player.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.collectRadius;
    }
}

class FloatingHealthText {
    constructor(x, y, healAmount) {
        this.x = x;
        this.y = y;
        this.healAmount = healAmount;
        this.life = 90;
        this.maxLife = 90;
        
        this.vy = -2.5;
        this.vx = (Math.random() - 0.5) * 1.2;
        this.gravity = 0.015;
        
        this.alpha = 1;
        this.scale = 0.6;
        this.scaleGrowth = 0.025;
        this.maxScale = 1.3;
    }
    
    update() {
        this.life--;
        
        this.y += this.vy;
        this.x += this.vx;
        this.vy += this.gravity;
        
        if (this.scale < this.maxScale) {
            this.scale += this.scaleGrowth;
        }
        
        if (this.life < 35) {
            this.alpha = this.life / 35;
        }
    }
    
    draw() {
        ctx.save();
        
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.scale(this.scale, this.scale);
        
        ctx.fillStyle = '#FFB6C1';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const text = `+${this.healAmount} HP`;
        
        ctx.strokeText(text, 0, 0);
        ctx.fillText(text, 0, 0);
        
        ctx.restore();
    }
}

class IrysText {
    constructor(x, y, value = 1, isRare = false, enemyCenterX = null, enemyCenterY = null) {
        this.x = enemyCenterX ? enemyCenterX + (Math.random() - 0.5) * 50 : x;
        this.groundY = CONFIG.ground.y - 50;
        this.y = enemyCenterY ? enemyCenterY - 35 : y;
        this.targetY = this.groundY;
        
        this.value = value;
        this.life = 300;
        this.maxLife = 300;
        
        this.vy = -2.2;
        this.vx = (Math.random() - 0.5) * 3.5;
        this.gravity = 0.15;
        this.bounce = 0.3;
        this.isGrounded = false;
        this.bounceCount = 0;
        
        this.isRare = isRare;
        this.alpha = 1;
        this.scale = 1;
        this.glowIntensity = 0;
        this.pulsePhase = Math.random() * Math.PI * 2;
        
        this.spawnScale = 0.1;
        this.spawnGrow = 0.08;
        this.hasSpawned = false;
    }
    
    update() {
        this.life--;
        
        if (!this.hasSpawned) {
            this.spawnScale += this.spawnGrow;
            if (this.spawnScale >= 1) {
                this.spawnScale = 1;
                this.hasSpawned = true;
            }
        }
        
        if (!this.isGrounded) {
            this.vy += this.gravity;
            this.y += this.vy;
            this.x += this.vx;
            
            if (this.y >= this.targetY) {
                this.y = this.targetY;
                this.vy *= -this.bounce;
                this.vx *= 0.8;
                this.bounceCount++;
                
                if (this.bounceCount >= 2 || Math.abs(this.vy) < 0.5) {
                    this.isGrounded = true;
                    this.vy = 0;
                    this.vx = 0;
                }
            }
        } else {
            this.y = this.targetY + Math.sin(Date.now() * 0.005 + this.pulsePhase) * 2;
        }
        
        if (this.life < 60) {
            this.alpha = this.life / 60;
        }
        
        this.glowIntensity = (Math.sin(Date.now() * 0.01 + this.pulsePhase) + 1) * 0.5;
        
        const lifeRatio = this.life / this.maxLife;
        this.scale = this.hasSpawned ? (0.8 + lifeRatio * 0.4) * this.spawnScale : this.spawnScale;
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        
        const baseColor = '#00ffcc';
        const rareColor = '#ffb3c6';
        
        const glowColor = this.isRare ? rareColor : baseColor;
        ctx.shadowBlur = 20 + this.glowIntensity * 15;
        ctx.shadowColor = glowColor;
        
        ctx.fillStyle = baseColor;
        ctx.font = `bold ${Math.floor(18 * this.scale)}px "Cinzel", serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.fillText('IRYS', this.x, this.y);
        ctx.fillText('IRYS', this.x, this.y);
        
        if (this.value > 1) {
            ctx.font = `bold ${Math.floor(14 * this.scale)}px "Noto Sans JP", sans-serif`;
            ctx.fillStyle = baseColor;
            ctx.shadowColor = baseColor;
            ctx.shadowBlur = 10 + this.glowIntensity * 5;
            ctx.fillText(`+${this.value}`, this.x, this.y + 25);
            
            if (this.isRare) {
                ctx.shadowBlur = 30;
                ctx.shadowColor = rareColor;
                ctx.fillStyle = baseColor;
                ctx.fillText('IRYS', this.x, this.y);
            }
        }
        
        if (this.isGrounded && this.life > 60) {
            ctx.globalAlpha = 0.2 * this.alpha;
            ctx.strokeStyle = glowColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 35, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    checkCollision(player) {
        const dx = this.x - (player.x + player.width / 2);
        const dy = this.y - (player.y + player.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < 35;
    }
}

class IrysParticle {
    constructor(x, y, isRare = false) {
        this.x = x + (Math.random() - 0.5) * 30;
        this.y = y + (Math.random() - 0.5) * 20;
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = -Math.random() * 4 - 2;
        this.life = 80;
        this.maxLife = 80;
        this.isRare = isRare;
        this.size = 2 + Math.random() * 4;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.gravity = 0.1;
        
        this.healthParticle = false;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.life--;
        
        this.vx *= 0.99;
        this.vy *= 0.98;
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.life / this.maxLife;
        
        let color;
        if (this.healthParticle) {
            color = '#4CAF50';
        } else {
            color = this.isRare ? '#ffb3c6' : '#00ffcc';
        }
        
        ctx.fillStyle = color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
        
        const pulseSize = this.size + Math.sin(Date.now() * 0.01 + this.pulsePhase) * 1;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

class SakuraParticle {
    constructor(x, y, isDeathEffect = false) {
        this.x = x + (Math.random() - 0.5) * 60;
        this.y = y + (Math.random() - 0.5) * 40;
        
        if (isDeathEffect) {
            this.vx = (Math.random() - 0.5) * 8;
            this.vy = -Math.random() * 6 - 2;
            this.life = 120;
            this.spinSpeed = (Math.random() - 0.5) * 0.3;
        } else {
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = Math.random() * 0.8 + 0.3;
            this.life = 250;
            this.spinSpeed = (Math.random() - 0.5) * 0.08;
        }
        
        this.maxLife = this.life;
        this.size = 3 + Math.random() * 4;
        this.rotation = Math.random() * Math.PI * 2;
        this.isDeathEffect = isDeathEffect;
        this.gravity = 0.015;
        this.wind = Math.sin(Date.now() * 0.001) * 0.3;
        this.colorVariant = Math.random();
    }
    
    update() {
        this.wind = Math.sin(Date.now() * 0.001 + this.x * 0.01) * CONFIG.particles.sakura.windVariation;
        
        this.x += this.vx + this.wind;
        this.y += this.vy;
        
        if (this.isDeathEffect) {
            this.vy += this.gravity * 2;
        } else {
            this.vy += this.gravity;
        }
        
        this.rotation += this.spinSpeed;
        this.life--;
        
        this.vx += Math.sin(Date.now() * 0.004 + this.x * 0.01) * 0.02;
        
        if (this.y > CONFIG.ground.y + 50) {
            this.life = 0;
        }
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.life / this.maxLife;
        
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        if (this.isDeathEffect) {
            gradient.addColorStop(0, '#ff9db4');
            gradient.addColorStop(0.7, '#ffb3c6');
            gradient.addColorStop(1, '#ffc9d9');
        } else {
            if (this.colorVariant < 0.3) {
                gradient.addColorStop(0, '#ffb3c6');
                gradient.addColorStop(0.7, '#ffc9d9');
                gradient.addColorStop(1, '#ffe0eb');
            } else if (this.colorVariant < 0.6) {
                gradient.addColorStop(0, '#ffa8c0');
                gradient.addColorStop(0.7, '#ffbdd1');
                gradient.addColorStop(1, '#ffd5e5');
            } else {
                gradient.addColorStop(0, '#ff9fb8');
                gradient.addColorStop(0.7, '#ffb8cc');
                gradient.addColorStop(1, '#ffd0e0');
            }
        }
        
        ctx.fillStyle = gradient;
        
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.quadraticCurveTo(this.size * 0.7, -this.size * 0.3, this.size * 0.5, 0);
        ctx.quadraticCurveTo(this.size * 0.3, this.size * 0.7, 0, this.size);
        ctx.quadraticCurveTo(-this.size * 0.3, this.size * 0.7, -this.size * 0.5, 0);
        ctx.quadraticCurveTo(-this.size * 0.7, -this.size * 0.3, 0, -this.size);
        ctx.fill();
        
        if (this.isDeathEffect) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ff9db4';
            ctx.fill();
        }
        
        ctx.restore();
    }
}

class Arrow {
    constructor(x, y, direction, damage) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 4;
        this.speed = 6;
        this.direction = direction;
        this.damage = damage;
    }
    
    update() {
        if (this.direction === 'right') {
            this.x += this.speed;
        } else {
            this.x -= this.speed;
        }
    }
    
    draw() {
        ctx.save();
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x, this.y - 2, this.width, this.height);
        ctx.restore();
    }
}

class PowerSphere {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 32;
        this.height = 32;
        this.life = 600;
        this.pulsePhase = 0;
    }
    
    update() {
        this.life--;
        this.pulsePhase += 0.1;
    }
    
    draw() {
        ctx.save();
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const radius = 16 + Math.sin(this.pulsePhase) * 3;
        
        ctx.fillStyle = this.type === 'shield' ? '#00ffcc' : '#ff3333';
        ctx.shadowBlur = 15;
        ctx.shadowColor = ctx.fillStyle;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class SlashEffect {
    constructor(x, y, direction, range) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.range = range;
        this.life = 15;
    }
    
    update() {
        this.life--;
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.life / 15;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        if (this.direction === 'right') {
            ctx.arc(this.x, this.y, this.range, -Math.PI/4, Math.PI/4);
        } else {
            ctx.arc(this.x, this.y, this.range, 3*Math.PI/4, 5*Math.PI/4);
        }
        ctx.stroke();
        ctx.restore();
    }
}

class BloodParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = (Math.random() - 0.5) * 6;
        this.life = 30;
        this.size = 3;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.2;
        this.life--;
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.life / 30;
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.restore();
    }
}

const UPDATED_SPHERE_COLORS = {
    shield: '#cc66ff',
    attack: '#ff66cc',
    shieldGlow: '#aa44dd',
    attackGlow: '#dd44aa'
};

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
        
        this.y = this.originalY + Math.sin(this.floatOffset) * 3;
    }
    
    draw() {
        ctx.save();
        
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        
        const baseRadius = 18;
        const pulseRadius = baseRadius + Math.sin(this.pulsePhase) * 4;
        
        const mainColor = this.type === 'shield' ? UPDATED_SPHERE_COLORS.shield : UPDATED_SPHERE_COLORS.attack;
        const glowColor = this.type === 'shield' ? UPDATED_SPHERE_COLORS.shieldGlow : UPDATED_SPHERE_COLORS.attackGlow;
        
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseRadius);
        gradient.addColorStop(0, mainColor);
        gradient.addColorStop(0.4, this.type === 'shield' ? '#9933cc' : '#cc3399');
        gradient.addColorStop(0.7, this.type === 'shield' ? '#6600aa' : '#aa0066');
        gradient.addColorStop(1, 'rgba(102, 0, 170, 0.2)');
        
        ctx.shadowBlur = 20;
        ctx.shadowColor = glowColor;
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 30;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulseRadius * 1.4, 0, Math.PI * 2);
        ctx.fill();
        
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
        ctx.fill();
        
        ctx.restore();
    }
}

