
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
