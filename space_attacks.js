var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.fillStyle = "#FFFFFF";

var secondsToTicks = function(s){
    return s*gameRate;
}

var secondsToFrames = function(s){
    return s*frameRate;
}

var secondsSince = function(e){
    return (gameCounter - e)/gameRate;
}

var drawBackground = function(context, backgrounds, gameSequence){
    var level = gameSequence.getLevel();
    if (level != 0)
        backgrounds[level].draw();
}

var vectorToDirection = function(v){
    var a = v.theta();
    if (a > -Math.PI/8 && a < Math.PI/8)
        var direction = 'r';
    else if (a > Math.PI/8 && a < Math.PI*3.0/8)
        var direction = 'ur';
    else if (a > Math.PI*3.0/8 && a < Math.PI*5.0/8)
        var direction = 'u';
    else if (a > Math.PI*5.0/8 && a < Math.PI*7.0/8)
        var direction = 'ul';
    else if (a > Math.PI*7.0/8 || a < -Math.PI*7.0/8)
        var direction = 'l';
    else if (a > -Math.PI*7.0/8 && a < -Math.PI*5.0/8)
        var direction = 'dl';
    else if (a > -Math.PI*5.0/8 && a < -Math.PI*3.0/8)
        var direction = 'd';
    else if (a > -Math.PI*3.0/8 && a < -Math.PI*1.0/8)
        var direction = 'dr';
    else
        var direction = 'ur'; //default
    return direction;
};

var directionToVector = function(direction){
    if (direction == 'r')
        return (new Vector(1, 0)).unit_vector();
    else if (direction == 'dr')
        return (new Vector(1, -1)).unit_vector();
    else if (direction == 'd')
        return (new Vector(0, -1)).unit_vector();
    else if (direction == 'dl')
        return (new Vector(-1, -1)).unit_vector();
    else if (direction == 'l')
        return (new Vector(-1, 0)).unit_vector();
    else if (direction == 'ul')
        return (new Vector(-1, 1)).unit_vector();
    else if (direction == 'u')
        return (new Vector(0, 1)).unit_vector();
    else /* ur */
        return (new Vector(1, 1)).unit_vector();
}

/* Keyboard Input */

var keycodes = {
    "KEYUP": 38
  , "KEYDOWN": 40
  , "KEYLEFT": 37
  , "KEYRIGHT": 39
  , "KEYSPACE": 32
};

var keystates = {
    "KEYUP": false
  , "KEYDOWN": false
  , "KEYLEFT": false
  , "KEYRIGHT": false
  , "KEYSPACE": false
};

var keyeventtimes ={
    "KEYUP": 0
  , "KEYDOWN": 0
  , "KEYLEFT": 0
  , "KEYRIGHT": 0
  , "KEYSPACE": 0
};

var onkeydown = function(event){
    for (var key in keycodes){
        if(keycodes[key] == event.which){
            if(!keystates[key]){
                keystates[key] = true;
                keyeventtimes[key] = gameCounter;
            }
            event.preventDefault();
            return;
        }
    }
};

var onkeyup = function(event){
    for (var key in keycodes){
        if(keycodes[key] == event.which){
            keystates[key] = false;
            return;
        }
    }
};

$("input").keydown(onkeydown);
$("input").keyup(onkeyup);

/* ----------- */

/* Sprite */

var Sprite = function (ctx, loaders, imgsrc, width, height) {
    this.context = ctx;
    this.imageSource = imgsrc;
    this.width = width;
    this.height = height;
    this.deferred = $.Deferred();
    this.image = new Image();
    var thisobj = this;
    this.image.onload = function() {
        thisobj.deferred.resolve();
    };
    this.image.src = imgsrc;
    loaders.push(this.deferred.promise());
};

Sprite.prototype.draw = function (x, y){
    this.context.drawImage(
        this.image
      , x*windowScaling
      , y*windowScaling
      , this.width*windowScaling
      , this.height*windowScaling
    );
};

/* ---------- Sprite */

/* Load sprites */

var loaders = [];

var backgroundSprites = {
    1: new Sprite(ctx, loaders, "sprites/space.GIF", 1200, 760)
  , 2: new Sprite(ctx, loaders, "sprites/overearth.GIF", 1200, 760)
}

var dashSprites = {
    'hdiv' : new Sprite(ctx, loaders, "sprites/ship/dash/dashbar.GIF", 1200, 40)
  , 'vdiv' : new Sprite(ctx, loaders, "sprites/ship/dash/divide.GIF", 11, 27)
};

var shipSprites = {
    'dl'    : new Sprite(ctx, loaders, "sprites/ship/shipdl.png", 50, 50)
  , 'd'     : new Sprite(ctx, loaders, "sprites/ship/shipd.png", 50, 50)
  , 'dr'    : new Sprite(ctx, loaders, "sprites/ship/shipdr.png", 50, 50)
  , 'r'     : new Sprite(ctx, loaders, "sprites/ship/shipr.png", 50, 50)
  , 'ur'    : new Sprite(ctx, loaders, "sprites/ship/shipur.png", 50, 50)
  , 'u'     : new Sprite(ctx, loaders, "sprites/ship/shipu.png", 50, 50)
  , 'ul'    : new Sprite(ctx, loaders, "sprites/ship/shipul.png", 50, 50)
  , 'l'     : new Sprite(ctx, loaders, "sprites/ship/shipl.png", 50, 50)
  , 'hitdl' : new Sprite(ctx, loaders, "sprites/ship/hitshipdl.GIF", 50, 50)
  , 'hitd'  : new Sprite(ctx, loaders, "sprites/ship/hitshipd.GIF", 50, 50)
  , 'hitdr' : new Sprite(ctx, loaders, "sprites/ship/hitshipdr.GIF", 50, 50)
  , 'hitr'  : new Sprite(ctx, loaders, "sprites/ship/hitshipr.GIF", 50, 50)
  , 'hitur' : new Sprite(ctx, loaders, "sprites/ship/hitshipur.GIF", 50, 50)
  , 'hitu'  : new Sprite(ctx, loaders, "sprites/ship/hitshipu.GIF", 50, 50)
  , 'hitul' : new Sprite(ctx, loaders, "sprites/ship/hitshipul.GIF", 50, 50)
  , 'hitl'  : new Sprite(ctx, loaders, "sprites/ship/hitshipl.GIF", 50, 50)
};

var  pawn0Sprites = {
    'd'    : new Sprite(ctx, loaders, "sprites/pawn/0/pawn0d.GIF", 40, 40)
  , 'u'    : new Sprite(ctx, loaders, "sprites/pawn/0/pawn0u.GIF", 40, 40)
  , 'r'    : new Sprite(ctx, loaders, "sprites/pawn/0/pawn0r.GIF", 40, 40)
  , 'l'    : new Sprite(ctx, loaders, "sprites/pawn/0/pawn0l.GIF", 40, 40)
  , 'dl'   : new Sprite(ctx, loaders, "sprites/pawn/0/pawn0dl.png", 40, 40)
  , 'dr'   : new Sprite(ctx, loaders, "sprites/pawn/0/pawn0dr.png", 40, 40)
  , 'ul'   : new Sprite(ctx, loaders, "sprites/pawn/0/pawn0ul.png", 40, 40)
  , 'ur'   : new Sprite(ctx, loaders, "sprites/pawn/0/pawn0ur.png", 40, 40)
  , 'hitd' : new Sprite(ctx, loaders, "sprites/pawn/0/hitpawn0d.GIF", 40, 40)
  , 'hitu' : new Sprite(ctx, loaders, "sprites/pawn/0/hitpawn0u.GIF", 40, 40)
  , 'hitr' : new Sprite(ctx, loaders, "sprites/pawn/0/hitpawn0r.GIF", 40, 40)
  , 'hitl' : new Sprite(ctx, loaders, "sprites/pawn/0/hitpawn0l.GIF", 40, 40)
  , 'hitdl': new Sprite(ctx, loaders, "sprites/pawn/0/hitpawn0dl.png", 40, 40)
  , 'hitdr': new Sprite(ctx, loaders, "sprites/pawn/0/hitpawn0dr.png", 40, 40)
  , 'hitul': new Sprite(ctx, loaders, "sprites/pawn/0/hitpawn0ul.png", 40, 40)
  , 'hitur': new Sprite(ctx, loaders, "sprites/pawn/0/hitpawn0ur.png", 40, 40)
  , 'expl0': new Sprite(ctx, loaders, "sprites/pawn/expl/pawnexpl0.GIF", 55, 55)
  , 'expl1': new Sprite(ctx, loaders, "sprites/pawn/expl/pawnexpl1.GIF", 55, 55)
  , 'expl2': new Sprite(ctx, loaders, "sprites/pawn/expl/pawnexpl2.GIF", 55, 55)
  , 'expl3': new Sprite(ctx, loaders, "sprites/pawn/expl/pawnexpl3.GIF", 55, 55)
}

var bulletSprites = {
    'bullet' : new Sprite(ctx, loaders, "sprites/bullet.GIF", 12, 12)
};

var resourcesLoaded = false;
$.when.apply(null, loaders).done(function() {
    resourcesLoaded = true;
});

/* ------------ */

/* Make backgrounds */

var backgrounds = {
    1: new Drawable(ctx, new Vector(0, frameHeight), 0, {'bg': backgroundSprites[1]}, true)
  , 2: new Drawable(ctx, new Vector(0, frameHeight), 0, {'bg': backgroundSprites[2]}, true)
};

/* ---------- */

/* Dashboard */

var Dashboard = function(context, ship, sprites){
    this.context = context;
    this.ship = ship;
    this.hdiv = new Drawable(context, new Vector(0, 40), 0, {'hdiv': sprites.hdiv}, true);
    this.vdivs = [
        new Drawable(context, new Vector(180, 27), 0, {'vdiv': sprites.vdiv}, true)
      , new Drawable(context, new Vector(360, 27), 0, {'vdiv': sprites.vdiv}, true)
      , new Drawable(context, new Vector(540, 27), 0, {'vdiv': sprites.vdiv}, true)
    ];
};

Dashboard.prototype.draw = function() {
    var elems = [this.hdiv].concat(this.vdivs)
    for (var i = 0; i < elems.length; i++){
        elems[i].draw();
    }
    this.context.fillStyle = "#FF0000";
    ctx.font = Math.round(19*windowScaling) + "px monospace";
    this.context.fillText("Health: "+this.ship.health,10*windowScaling,(frameHeight-10)*windowScaling);
    this.context.fillText("Speed: "+Math.ceil(this.ship.velocity.magnitude()*2),200*windowScaling,(frameHeight-10)*windowScaling);
    this.context.fillText("Score: "+this.ship.score,380*windowScaling,(frameHeight-10)*windowScaling);
    this.context.fillText("Control with arrow keys and spacebar",560*windowScaling,(frameHeight-10)*windowScaling);
};

/* ------------ Dashboard */

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
    if(o instanceof Pawn){
        this.markInactive();
    }
}

/* ------ Bullet */
    

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

        this.updateVelocity();
    }
}

HomingPawn.prototype.updateVelocity = function(){
    this.velocity = this.velocity.add(this.forces.unit_vector().scale(this.acceleration));
    this.velocity = this.velocity.sub(this.velocity.scale(this.resistance));
};

HomingPawn.prototype.draw = function(){
    Craft.prototype.draw.call(this, vectorToDirection(this.forces));
}

/* ------ Pawn */

var noEnemyShips = function(gameElems){
    for(var i = 0; i < gameElements.length; i++){
        if(gameElements[i].isEnemyCraft())
            return false;
    }
    return true
}

/* Create game elements */

var gameElements = [];
shipobj = new Ship(ctx, 25, shipSprites, 5, bulletSprites);
gameElements.push(shipobj);
    
var dash = new Dashboard(ctx, shipobj, dashSprites);

/* -------- */

/* Build game sequence */

var gameSequence = new GameSequence(1, 2);

/* -- pre pause */
gameSequence.addStage(1, 0, new GameSequenceEntry(function() {return [];}, secondsToTicks(2)));

/* -- 4 streght0 pawns */
var enemy11 = function(){
    return [
        new Pawn(ctx, 22, pawn0Sprites, 0, null, new Vector(1, 1*(playingAreaHeight/5)), new Vector(3,0), 3)
      , new Pawn(ctx, 22, pawn0Sprites, 0, null, new Vector(1, 2*(playingAreaHeight/5)), new Vector(3,0), 3)
      , new Pawn(ctx, 22, pawn0Sprites, 0, null, new Vector(1, 3*(playingAreaHeight/5)), new Vector(3,0), 3)
      , new Pawn(ctx, 22, pawn0Sprites, 0, null, new Vector(1, 4*(playingAreaHeight/5)), new Vector(3,0), 3)
    ];
}
gameSequence.addStage(1, 1, new GameSequenceEntry(enemy11, secondsToTicks(0)));

var enemy12 = function(){
    return [
        new HomingPawn(ctx, 22, pawn0Sprites, 0, null, new Vector(1, playingAreaHeight/2), new Vector(3,0), 10, shipobj)
    ];
}
gameSequence.addStage(1, 2, new GameSequenceEntry(enemy12, secondsToTicks(0)));

/* -------- */

/* Collisions */
    
var collisions = function(gameElements){
    var elementsToPop = []
    var elementsToPush = []
    for (var i = 0; i < gameElements.length; i++){
        for (var j = 1; j < gameElements.length; j++){
            if (i != j){
                ge1 = gameElements[i];
                ge2 = gameElements[j];
                if(ge1.position.distance(ge2.position) < (ge1.radius + ge2.radius)){
                    if(!ge1.destroyed && !ge2.destroyed){
                        ge1.collision(ge2);
                        ge2.collision(ge1);
                    }
                }
                else{
                    ge1.nocollision(ge2);
                    ge2.nocollision(ge1);
                }
            }
        }
    }
}

/* -------- */

var drawloop = function() {

    // Calculate scaling based on viewable area
    if (window.innerHeight < frameHeight){
        windowScaling = (window.innerHeight-10)/frameHeight;
    }
    
    // Clear the screen
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0,0,frameWidth,frameHeight);

    // Draw the background
    drawBackground(ctx, backgrounds, gameSequence);

    /* Draw game elements */
    gameElements.sort(function(a,b){ return a.zlayer - b.zlayer; });
    for(var i = 0; i < gameElements.length; i++){
        gameElements[i].draw();
    }

    // Draw the dashboard
    dash.draw();

};

var gameloop = function() {

    /* Update game element positions */
    var newGameElements = [];
    for(var i = 0; i < gameElements.length; i++){
        gameElements[i].update();
        if(gameElements[i].isActive())
            newGameElements.push(gameElements[i]);
    }
    gameElements = newGameElements;

    /* Check for collisions */
    collisions(gameElements)

    /* Advance game sequence */
    gameSequence.action(gameElements);
    if (gameSequence.stageComplete())
        gameSequence.advanceStage();

};

var curTime = 0;
var frames = 0

var showFrameRate = function() {
    var d = new Date();
    var t = Math.floor(d.getTime()/1000);
    if(t != curTime){
        console.log(frames);
        frames = 0;
        curTime = t;
    }
    frames++;
};

var drawprocessing = false;
setInterval(function(){
    if(resourcesLoaded && !drawprocessing){
        drawprocessing = true;
        drawloop();
        frameCounter = (frameCounter+1)%maxFrameCount;
        drawprocessing = false;
        //showFrameRate();
    }
    else if(drawprocessing){
        console.log("Can't achieve draw framerate");
    }
}, frameInterval);

var gameprocessing = false;
setInterval(function(){
    if(resourcesLoaded && !gameprocessing){
        gameprocessing = true;
        gameloop();
        gameCounter = (gameCounter+1)%maxFrameCount;
        gameprocessing = false;
        //showFrameRate();
    }
    else if(gameprocessing){
        console.log("Can't achieve game framerate");
    }
}, gameInterval);
