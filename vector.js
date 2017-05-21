
var tinyFloat = 0.0000001

var Vector = function (x, y) {
    this.x = x;
    this.y = y;
};

Vector.prototype.get_x = function () {
    return this.x;
};

Vector.prototype.get_y = function () {
    return this.y;
};

Vector.prototype.add = function(other){
    return new Vector(this.x + other.x, this.y + other.y);
}

Vector.prototype.sub = function(other){
    return new Vector(this.x - other.x, this.y - other.y);
}

Vector.prototype.scale = function(scale){
    return new Vector(this.x*scale, this.y*scale);
}

Vector.prototype.magnitude = function() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
};

Vector.prototype.angle_rad = function(){
    return Math.atan2(this.y, this.x);
}

Vector.prototype.unit_vector = function(){
    if (Math.abs(this.x) < tinyFloat && Math.abs(this.y) < tinyFloat)
        return new Vector(0,0);
    else
        return new Vector(this.x/this.magnitude(), this.y/this.magnitude());
};

Vector.prototype.repr = function() {
    return this.x.toString() + "," + this.y.toString();
};

Vector.prototype.distance = function(other){
    return Math.sqrt((this.x - other.x)**2 + (this.y - other.y)**2)
}
