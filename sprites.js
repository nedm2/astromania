

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
