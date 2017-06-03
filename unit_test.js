var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.fillStyle = "#FFFFFF";

var Ball = function(context, position, velocity, radius, mass){
    Drawable.prototype.constructor.call(this, context, position, radius)
    this.velocity = velocity;
    this.mass = mass;
};

Ball.prototype = new Drawable();
Ball.prototype.constructor = Ball;

Ball.prototype.draw = function(){
    this.context.beginPath();
    this.context.arc(this.position.x,this.position.y,this.radius,0,2*Math.PI);
    this.context.stroke();
}

Ball.prototype.update= function() {
    this.position = this.position.add(this.velocity);
};

var b2 = new Ball(ctx, new Vector(100, 100), new Vector(1, 0), 40, 1000);
var b1 = new Ball(ctx, new Vector(900, 100), new Vector(-1, 0), 40, 100);

var colliding = false;

var collision = function(){
    momentum_twoupdate(b1, b2);
}

var drawprocessing = false;
setInterval(function(){
    if(!drawprocessing){
        drawprocessing = true;

        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0,0,frameWidth,frameHeight);

        b1.draw();
        b1.update();

        b2.draw();
        b2.update();

        if(b1.position.distance(b2.position) < (b1.radius + b2.radius)){
            if(colliding == false){
                colliding = true;
                collision();
            }
        }
        else{
            colliding = false;
        }

        drawprocessing = false;
    }
    else if(drawprocessing){
        console.log("Can't achieve draw framerate");
    }
}, 1);
