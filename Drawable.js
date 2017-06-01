
/* Drawable */

var Drawable = function (context, position, radius, sprites, frameCoords){
    this.context = context;
    this.position = position;
    this.radius = radius;
    this.sprites = sprites;
    this.frameCoords = frameCoords;
    this.shakeCount = 0;
    this.shakeRadius = 5;
    this.active = true;
    this.zlayer = 0;
};

Drawable.prototype.inPlayingArea = function(){
    if(this.position.get_x() < 0) return false;
    if(this.position.get_y() < 0) return false;
    if(this.position.get_x() > playingAreaWidth)  return false;
    if(this.position.get_y() > playingAreaHeight) return false;
    return true;
}

Drawable.prototype.isActive = function(){
    return this.active;
}

Drawable.prototype.isFriendlyFire = function(){
    return false;
}

Drawable.prototype.isEnemyCraft = function(){
    return false;
}

Drawable.prototype.collision = function(){}

Drawable.prototype.draw = function(spritename){

    /* Don't draw if outside the playing area */
    if(!this.frameCoords && !this.inPlayingArea())
            return;

    if (typeof(spritename)==='undefined')
        var s = this.sprites[Object.keys(this.sprites)[0]];
    else
        var s = this.sprites[spritename];
    if (this.frameCoords)
        var h = frameHeight;
    else
        var h = playingAreaHeight;
    if (this.shakeCount > 0){
        var actual_x = this.position.get_x() - this.shakeRadius + (Math.random()*this.shakeRadius*2);
        var actual_y = this.position.get_y() - this.shakeRadius + (Math.random()*this.shakeRadius*2);
    }
    else{
        actual_x = this.position.get_x();
        actual_y = this.position.get_y();
    }

    s.draw(Math.round(actual_x - this.radius), h - Math.round(actual_y + this.radius));

    if (this.shakeCount > 0)
      this.shakeCount -= 1;
}

Drawable.prototype.shake = function(c){
    this.shakeCount = c;
}

Drawable.prototype.markInactive = function(){
    this.active = false;
}

/* --------- Drawable */
