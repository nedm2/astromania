
/* Craft */

var Craft = function(context, position, velocity, health, radius, sprites){
    Drawable.prototype.constructor.call(this, context, position, radius, sprites)
    this.velocity = velocity;
    this.health = health;
    this.shielded = 0;
    this.mass = 100;
    this.destroyed = false;
    this.explosionDuration = 4;
    this.forces = new Vector(0, 0);
};

Craft.prototype = new Drawable();
Craft.prototype.constructor = Craft;

Craft.prototype.draw = function(direction, prefix){
    if (typeof(direction)==='undefined')
        var direction = vectorToDirection(this.velocity);

    if (typeof(prefix)==='undefined')
        prefix = '';

    if (this.shakeCount > 0)
      prefix = 'hit' + prefix;

    spritename = prefix+direction;

    if (this.destroyed){
        if     (secondsSince(this.explosionTime) < this.explosionDuration*1/4)
            spritename = 'expl0';
        else if(secondsSince(this.explosionTime) < this.explosionDuration*2/4)
            spritename = 'expl1';    
        else if(secondsSince(this.explosionTime) < this.explosionDuration*3/4)
            spritename = 'expl2';   
        else
            spritename = 'expl3';
    }

    Drawable.prototype.draw.call(this, spritename);
};

Craft.prototype.updatePosition = function() {
    this.position = this.position.add(this.velocity);
};

Craft.prototype.update = function(){
    this.updatePosition();
    if(this.destroyed && (secondsSince(this.explosionTime) > this.explosionDuration)){
        this.active = false;
    }
    if(this.shielded > 0)
        this.shielded -= 1
};

Craft.prototype.getHealth = function(){
    return this.health;
};

Craft.prototype.getSpeed = function(){
    return Math.round(this.velocity.magnitude());
};

Craft.prototype.getType = function(){
    return 'craft';
};

Craft.prototype.damage = function(d, shieldperiod){
    if (!this.shielded && !this.destroyed){
        this.health = Math.max(0, this.health - d);
        if (this.health <= 0){
            this.destroy();
        }
        else{
            this.shielded = secondsToTicks(shieldperiod);
            this.shake(secondsToFrames(1));
        }
    }
};

Craft.prototype.destroy = function(){
    this.destroyed = true;
    this.explosionTime=gameCounter;
    this.velocity = new Vector(0,0);
    this.zlayer = -20;
}

Craft.prototype.onremoval = function(elementsToPush){
    //elementsToPush.push(Explosion(this.context, this.position));
};

Craft.prototype.momentum = function(o){
}

/* ------ Craft */
