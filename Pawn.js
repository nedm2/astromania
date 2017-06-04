
/* Pawn */

var Pawn = function(context, radius, sprites, bulletRadius, bulletSprites,
      position = new Vector(playingAreaWidth/2, playingAreaHeight/2), velocity = new Vector(0, 0), health=100){
    Craft.prototype.constructor.call(this, context, position, velocity, health, radius, sprites);
    this.initialposition = position;
    this.collisionDamageInflicted = 1;
    this.mass=600;
}

Pawn.prototype = new Craft();
Pawn.prototype.constructor = Pawn;

Pawn.prototype.update = function(){
    Craft.prototype.update.call(this);
    if(!this.inPlayingArea()){
        this.position = this.initialposition
    }
}

Pawn.prototype.isEnemyCraft = function(){
    return true;
}

Pawn.prototype.collision = function(o){
    if(o instanceof Bullet){
        if(o.owner instanceof Ship){
            this.damage(o.power, 1);
        }
    }
    else if(o instanceof Ship){
        this.damage(o.collisionDamageInflicted, 1);
    }
}

/* ------ Pawn */

/* HomingPawn */

var HomingPawn = function(context, radius, sprites, bulletRadius, bulletSprites,
      position = new Vector(playingAreaWidth/2, playingAreaHeight/2), velocity = new Vector(0, 0), health=100, target){
    Pawn.prototype.constructor.call(this, context, radius, sprites, bulletRadius, bulletSprites, position, velocity, health);
    this.target = target;
    this.acceleration=0.4;
    this.resistance = 0.025;
    this.mass = 100;
    this.direction = this.velocity.unit_vector();
    this.bulletSpeed = 15;
    this.bulletSprites = bulletSprites;
    this.bulletRadius =  bulletRadius;
}

HomingPawn.prototype = new Pawn();
HomingPawn.prototype.constructor = HomingPawn;

HomingPawn.prototype.update = function(){
    Craft.prototype.update.call(this);

    if(!this.destroyed){
        /* Find vector from this to target */
        var dir = this.target.position.sub(this.position);

        /* Snap dir vector to 45 degree increment */
        var snapdir = directionToVector(vectorToDirection(dir));

        /* Apply a force in the snapped direction */
        this.forces = snapdir.unit_vector();
        this.direction = this.forces;

        this.updateVelocity();

        if (gameCounter%100 == 0)
            this.fire()
    }
}

HomingPawn.prototype.updateVelocity = function(){
    this.velocity = this.velocity.add(this.forces.unit_vector().scale(this.acceleration));
    this.velocity = this.velocity.sub(this.velocity.scale(this.resistance));
};

HomingPawn.prototype.draw = function(){
    Craft.prototype.draw.call(this, vectorToDirection(this.forces));
}

Pawn.prototype.fire = function(){
    gameElements.push(new Bullet(this, this.context, this.position, this.direction.scale(this.bulletSpeed), this.bulletRadius, this.bulletSprites, 1, false));
};

/* ------ Pawn */
