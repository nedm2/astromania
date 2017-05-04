var Base = function(x) {
    this.x = x;
};

Base.prototype.foo = function () {
    console.log(this.x);
};

var Sub = function(){
    Base.prototype.constructor.call(this, 10);
};

Sub.prototype = new Base();
Sub.prototype.constructor = Sub;

//Sub.prototype.foo = function () {
//    console.log('sub');
//};


var v = new Sub();

v.foo();
