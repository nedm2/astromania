
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
            this.damage(o.power, 0);
        }
    }
    else if(o instanceof Ship){
        this.damage(o.collisionDamageInflicted, 0);
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
        this.updateForces();
        this.direction = directionToVector(vectorToDirection(this.target.position.sub(this.position).unit_vector()));
        this.updateVelocity();

        if (gameCounter%100 == 0)
            this.fire()
    }
}

HomingPawn.prototype.updateForces = function(){
    /* Find vector from this to target */
    var thistotarget = this.target.position.sub(this.position).unit_vector();

    /* Calculate repulsive force For all other craft, prevents craft from 
     * constantly converging on each other */
    var repulseResultant = new Vector(0, 0);
    var numcraft = 0;
    for(var i = 0; i < gameElements.length; i++){
        if((gameElements[i] instanceof Craft) && !(gameElements[i] == this)){

            /* Find vector from the other craft to this */
            var crafttothis = this.position.sub(gameElements[i].position);

            /* Calculate repulsive force, inverse to cube of distance, add it to the resultant */
            var repulsiveForce = crafttothis.unit_vector().scale(10000000.0/Math.pow(crafttothis.magnitude(), 3));
            repulseResultant = repulseResultant.add(repulsiveForce);

            numcraft++;
        }
    }
    /* Scale the repulsive force by the inverse of the number of contributing elements */
    repulseResultant = repulseResultant.scale(1.0/numcraft);

    /* Combine repulsive and attractive elements */
    var resultant = thistotarget.add(repulseResultant);

    /* Apply a rotational force to align the pawn to a 45 degree angle 
     * around the target. */
    var targettothis = this.position.sub(this.target.position).unit_vector();
    var closestSnap = getClosestSnapVector(targettothis);
    var normaldir = targettothis.getNormalTowards(closestSnap);
    resultant = resultant.add(normaldir.unit_vector().scale(0.01));
    

    /* Apply a force in the resultant direction */
    this.forces = resultant.unit_vector()
}

HomingPawn.prototype.updateVelocity = function(){
    this.velocity = this.velocity.add(this.forces.unit_vector().scale(this.acceleration));
    this.velocity = this.velocity.sub(this.velocity.scale(this.resistance));
};

HomingPawn.prototype.draw = function(){
    Craft.prototype.draw.call(this, vectorToDirection(this.direction));
}

Pawn.prototype.fire = function(){
    gameElements.push(new Bullet(this, this.context, this.position, this.direction.scale(this.bulletSpeed), this.bulletRadius, this.bulletSprites, 1, false));
};

/* ------ Pawn */
