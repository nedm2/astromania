
/* Bullet */

var Bullet = function(owner, context, position, velocity, radius, sprites, power, enemyfire){
    Drawable.prototype.constructor.call(this, context, position, radius, sprites);
    this.owner = owner
    this.velocity = velocity
    this.power = power
    this.enemyfire = enemyfire
}

Bullet.prototype = new Drawable();
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function(){
    this.position = this.position.add(this.velocity);
}

Bullet.prototype.draw = function(){
    Drawable.prototype.draw.call(this);
}

Bullet.prototype.getType = function(){
    return (this.owner.getType() + 'bullet');
}

Bullet.prototype.isActive = function(){
    return this.active && this.inPlayingArea();
}

Bullet.prototype.isFriendlyFire = function(){
    return !this.enemyfire;
}

Bullet.prototype.collision = function(o){
    if((o instanceof Pawn) && (this.owner instanceof Ship)){
        this.markInactive();
    }
    else if((o instanceof Ship) && (this.owner instanceof Pawn)){
        this.markInactive();
    }
}

/* ------ Bullet */
