/* Calculates resultant velocities but only updates b1 */
var momentum_oneupdate = function(b1, b2){
    var impVelComp1 = b1.velocity.component(b2.position.sub(b1.position));
    var impVelComp2 = b2.velocity.component(b1.position.sub(b2.position));
    var velInit1 = impVelComp1.magnitude();
    var velInit2 = impVelComp2.magnitude();

    // Take 'this' direction as positive, must negate magnitudes in opposite direction
    if(Math.abs(impVelComp1.alpha(impVelComp2)) > Math.PI/2){
        velInit2 *= -1;
        impVelComp2 = impVelComp2.scale(-1);
    }

    // Calculate final velocities along the line of impulse using 1D formulas
    var velFin1 = velInit1*((b1.mass - b2.mass) / (b1.mass + b2.mass)) + velInit2*((2*b2.mass)/(b1.mass+b2.mass));

    // Special case when initial velocity along line of impulse is very small 
    if(Math.abs(velInit1) < 0.01)
        impVelComp1 = impVelComp2;

    // Combine the component normal to the line of impulse (which should not change) with the newly
    // calculated component along the line of impulse. 
    b1.velocity = b1.velocity.component(impVelComp1.rotated(Math.PI/2)).add((impVelComp1).unit_vector().scale(velFin1));
}

/* Calculates resultant velocities and updates both b1 and b2 */
var momentum_twoupdate = function(b1, b2){
    var impVelComp1 = b1.velocity.component(b2.position.sub(b1.position));
    var impVelComp2 = b2.velocity.component(b1.position.sub(b2.position));
    var velInit1 = impVelComp1.magnitude();
    var velInit2 = impVelComp2.magnitude();

    // Take 'this' direction as positive, must negate magnitudes in opposite direction
    if(Math.abs(impVelComp1.alpha(impVelComp2)) > Math.PI/2){
        velInit2 *= -1;
        impVelComp2 = impVelComp2.scale(-1);
    }

    // Calculate final velocities along the line of impulse using 1D formulas
    var velFin1 = velInit1*((b1.mass - b2.mass) / (b1.mass + b2.mass)) + velInit2*((2*b2.mass)/(b1.mass+b2.mass));
    var velFin2 = velInit2*((b2.mass - b1.mass) / (b2.mass + b1.mass)) + velInit1*((2*b1.mass)/(b2.mass+b1.mass));

    // Special case when initial velocity along line of impulse is very small 
    if(Math.abs(velInit1) < 0.01)
        impVelComp1 = impVelComp2;
    if(Math.abs(velInit2) < 0.01)
        impVelComp2 = impVelComp1;

    // Combine the component normal to the line of impulse (which should not change) with the newly
    // calculated component along the line of impulse. 
    b1.velocity = b1.velocity.component(impVelComp1.rotated(Math.PI/2)).add((impVelComp1).unit_vector().scale(velFin1));
    b2.velocity = b2.velocity.component(impVelComp2.rotated(Math.PI/2)).add((impVelComp2).unit_vector().scale(velFin2));
}
