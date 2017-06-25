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

var b2 = new Ball(ctx, new Vector(400, 400), new Vector(0, 0), 40, 1000);
var b1 = new Ball(ctx, new Vector(400, 600), new Vector(0, 0), 40, 100);

var colliding = false;

var collision = function(){
    momentum_twoupdate(b1, b2);
}

var frame = 0;

var line = function(x, y, x1, y1){
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x1,y1);
    ctx.stroke();
}

var drawprocessing = false;
setInterval(function(){
    frame++;
    if(!drawprocessing){
        drawprocessing = true;

        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0,0,frameWidth,frameHeight);

        b1.draw();
        b1.update();

        b2.draw();
        b2.update();

        var targetvec = b1.position.sub(b2.position);
        var normal = targetvec.rotated(Math.PI/2);
        b1.velocity = normal.unit_vector();
        line(b2.position.x, b2.position.x, b1.position.x, b1.position.y);
        //console.log(targetvec.theta());

        // surrounding
        //var g = getSurroundingSnapVectors(targetvec);
        //s0 = g[0].scale(100).add(b2.position);
        //s1 = g[1].scale(100).add(b2.position);
        //line(400, 400, s0.x, s0.y);
        //line(400, 400, s1.x, s1.y);
        //
        //if(frame == 10){
        //    var v0 = new Vector(-1, 0.1);
        //    var v1 = new Vector(-1, -0.1);
        //    console.log(v0.theta());
        //    console.log(v1.theta());
        //    console.log(v0.alpha(v1));
        //    console.log(v1.alpha(v0));
        //}

        var g = getClosestSnapVector(targetvec);
        var s = g.scale(100).add(b2.position);
        line(b2.position.x, b2.position.y, s.x, s.y);

        //console.log(targetvec.min_alpha(g));
        //
        var n = targetvec.getNormalTowards(g);
        var n_draw = n.add(b1.position);
        line(b1.position.x, b1.position.y, n_draw.x, n_draw.y);

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
}, 40);
