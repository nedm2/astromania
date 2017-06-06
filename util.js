
var secondsToTicks = function(s){
    return s*gameRate;
}

var secondsToFrames = function(s){
    return s*frameRate;
}

var secondsSince = function(e){
    return (gameCounter - e)/gameRate;
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
