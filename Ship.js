
/* Ship */

var Ship = function(context, radius, sprites, bulletRadius, bulletSprites){
    Craft.prototype.constructor.call(this, context, new Vector(playingAreaWidth/2, playingAreaHeight/2), 
      new Vector(0, 0), 100, radius, sprites);
    this.key_sensitivity = 0.1;
    this.resistance = 0.008;
    this.fireFrequency = gameRate;
    this.bulletRadius = bulletRadius;
    this.bulletSprites = bulletSprites;
    this.bulletPower = 1;
    this.direction = (new Vector(1, 0)).unit_vector();
    this.bulletSpeed = 15;
    this.score = 0;
    this.acceleration=0.5;
    this.impactdamage = 2;
    this.collisionDamageInflicted = 5;
    this.collset = new Set();
};

Ship.prototype = new Craft();
Ship.prototype.constructor = Ship;

var transkeystates = {
    "KEYUP": [false, 0]
  , "KEYDOWN": [false, 0]
  , "KEYLEFT": [false, 0]
  , "KEYRIGHT": [false, 0]
};

Ship.prototype.updateDirection = function(){

    if ( transkeystates["KEYUP"][1] == 1 
      || transkeystates["KEYDOWN"][1] == 1
      || transkeystates["KEYLEFT"][1] == 1
      || transkeystates["KEYRIGHT"][1] == 1){
        transkeystates["KEYUP"] = [keystates["KEYUP"], 0];
        transkeystates["KEYDOWN"] = [keystates["KEYDOWN"], 0];
        transkeystates["KEYLEFT"] = [keystates["KEYLEFT"], 0];
        transkeystates["KEYRIGHT"] = [keystates["KEYRIGHT"], 0];
    }

    for (var tk in transkeystates) {
        if(!transkeystates.hasOwnProperty(tk)) continue; 
        if(transkeystates[tk][1] > 1)
            transkeystates[tk][1] = transkeystates[tk][1] - 1;
        else if(keystates[tk] != transkeystates[tk][0])
            transkeystates[tk][1] = 2;
    }
    
    if ( transkeystates["KEYUP"][0] 
      || transkeystates["KEYDOWN"][0] 
      || transkeystates["KEYLEFT"][0] 
      || transkeystates["KEYRIGHT"][0]){
        var x = 0;
        var y = 0;
        if (transkeystates["KEYUP"][0])
            y = 1.0;
        else if (transkeystates["KEYDOWN"][0])
            y = -1.0;
        if (transkeystates["KEYRIGHT"][0])
            x = 1.0;
        else if (transkeystates["KEYLEFT"][0])
            x = -1.0;
        this.direction = (new Vector(x, y)).unit_vector();
    }
};

Ship.prototype.updateForces = function(){
    f = new Vector(0, 0);
    if (keystates["KEYUP"])
        f.y = 1;
    else if (keystates["KEYDOWN"])
        f.y = -1;
    if (keystates["KEYRIGHT"])
        f.x = 1;
    else if (keystates["KEYLEFT"])
        f.x = -1;
    this.forces = f.unit_vector();
};

Ship.prototype.updateVelocity = function(){
    this.velocity = this.velocity.add(this.forces.unit_vector().scale(this.acceleration));
    this.velocity = this.velocity.sub(this.velocity.scale(this.resistance));
};

Ship.prototype.screenWrap = function(){
    if (this.position.get_x() < 0)
        this.position.x = playingAreaWidth;
    if (this.position.get_x() > playingAreaWidth)
        this.position.x = 0;
    if (this.position.get_y() < 0)
        this.position.y = playingAreaHeight;
    if (this.position.get_y() > playingAreaHeight)
        this.position.y = 0;
};

Ship.prototype.fire = function(){
    gameElements.push(new Bullet(this, this.context, this.position, this.direction.scale(this.bulletSpeed), this.bulletRadius, this.bulletSprites, 1, false));
};

Ship.prototype.updateFire = function(){
    if (keystates["KEYSPACE"]){
        if (((gameCounter - keyeventtimes["KEYSPACE"])%maxFrameCount)%this.fireFrequency == 0)
            this.fire(gameElements);
    }
};

Ship.prototype.update = function(){
    Craft.prototype.update.call(this);
    this.updateDirection();
    this.updateForces();
    this.updateVelocity();
    this.screenWrap();
    this.updateFire();
};

Ship.prototype.getScore = function(){
    return this.score;
}

Ship.prototype.draw = function(){
    Craft.prototype.draw.call(this, vectorToDirection(this.direction));
}

Ship.prototype.getType = function(){
    return 'ship';
}

Ship.prototype.isEnemyCraft = function(){
    return false;
}

Ship.prototype.collision = function(o){
    if((o instanceof HomingPawn) && !(this.collset.has(o))){
        this.damage(o.collisionDamageInflicted, 1);
        momentum_twoupdate(this, o);
        this.collset.add(o);
    }
    else if((o instanceof Pawn) && !(this.collset.has(o))){
        this.damage(o.collisionDamageInflicted, 1);
        /* For calculating this momentum we don't want to affect the pawn velocity so 
         * it is best to consider it as a stationary object. Need to create a dummy
         * object with position and velocity to pass in */
        momentum_oneupdate(this, {position:o.position, velocity:new Vector(0,0), mass:o.mass});
        this.collset.add(o);
    }
    else if((o instanceof Bullet) && (o.owner instanceof Pawn)){
        this.damage(o.power, 1);
    }
}

Ship.prototype.nocollision = function(o){
    this.collset.delete(o);
}

/* ------ Ship */
