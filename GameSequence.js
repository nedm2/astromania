
/* GameSequenceEntry */

var GameSequenceEntry = function (enemygen, prepause){
    this.enemygen = enemygen;
    this.prepause = prepause;
    this.postpause = 0;
    this.state = 'unstarted';
};

GameSequenceEntry.prototype.action = function(gameElements){
    if (this.state == 'unstarted'){
        this.state = 'prepause';
        this.lastActionTime = gameCounter;
    }
    else if (this.state == 'prepause' && this.timeHasElapsed(this.prepause)){
        this.state = 'waitenemies';
        var enemies = this.enemygen();
        for (var i = 0; i < enemies.length; i++)
            gameElements.push(enemies[i]);
        this.lastActionTime = gameCounter;
    }
    else if (this.state == 'waitenemies' && noEnemyShips(gameElements)){
        this.state = 'postpause';
        this.lastActionTime = gameCounter;
    }
    else if (this.state == 'postpause' && this.timeHasElapsed(this.postpause)){
        this.state = 'complete';
        this.lastActionTime = gameCounter;
    }
};
      
GameSequenceEntry.prototype.stageComplete = function(){
    return this.state == 'complete';
};

GameSequenceEntry.prototype.timeHasElapsed = function(t){
    return (gameCounter - this.lastActionTime > t)
}

GameSequenceEntry.prototype.reset = function(){
    this.state = 'unstarted';
}
    
/* ----------------- GameSequenceEntry */

/* GameSequence */

var GameSequence = function (level, stage) {
    this.level = level;
    this.stage = stage;
    this.sequence = [];
    this.sequence.push([]);
};

GameSequence.prototype.action = function(gameElements){
    this.sequence[this.level][this.stage].action(gameElements);
};

GameSequence.prototype.advanceStage = function() {
    if (this.stage+1 < this.sequence[this.level].length) {
        this.stage += 1;
    }
    else if (this.level+1 < this.sequence.length) {
        this.level += 1;
        this.stage = 0;
    }
    else{
        /* No more stages, just restart the last stage */
        this.sequence[this.level][this.stage].reset();
    }
};

GameSequence.prototype.stageComplete = function() {
    return this.sequence[this.level][this.stage].stageComplete();
};

GameSequence.prototype.getLevel = function() {
    return this.level;
};

GameSequence.prototype.addStage = function(l, s, gse) {
    if (this.sequence.length < l)
        throw "Invalid game sequence construction";
    else if (this.sequence.length == l)
        this.sequence.push([]);
    if (this.sequence[l].length != s)
        throw "Invalid game sequence construction";
    this.sequence[l].push(gse);
};

/* ---------- GameSequence */
