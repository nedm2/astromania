
/* Make backgrounds */

var backgrounds = {
    1: new Drawable(ctx, new Vector(0, frameHeight), 0, {'bg': backgroundSprites[1]}, true)
  , 2: new Drawable(ctx, new Vector(0, frameHeight), 0, {'bg': backgroundSprites[2]}, true)
};

var drawBackground = function(context, backgrounds, gameSequence){
    var level = gameSequence.getLevel();
    if (level != 0)
        backgrounds[level].draw();
}

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
        new HomingPawn(ctx, 22, pawn0Sprites, 5, bulletSprites, new Vector(1,   playingAreaHeight/3), new Vector(3,0), 50, shipobj)
      , new HomingPawn(ctx, 22, pawn0Sprites, 5, bulletSprites, new Vector(1, 2*playingAreaHeight/3), new Vector(3,0), 50, shipobj)
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

    /* Draw the dashboard */
    dash.draw();

    /* Draw an extra white bar at the right hand end to cover any 
     * elements that stray beyond the end of the playing area */
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(windowScaling*frameWidth,0,windowScaling*(frameWidth+50),frameHeight);

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
