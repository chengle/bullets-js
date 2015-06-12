
var derp = 0;
var herp = 1;

Game.ObjectManager = function() {
    this.waves = [];
    this.canvas = null;

    this.waveObjs = [];
};

Game.ObjectManager.prototype.initialize = function(c) { 
    this.canvas = c;
    var wave = new Game.WaveType.Circle(40);
    wave.x = 250;
    this.waves.push(wave.emit());
    wave.x = 150;
    this.waves.push(wave.emit());
    wave.y = 300;
    this.waves.push(wave.emit());
    wave.x = 250;
    this.waves.push(wave.emit());

    //wave.x = 250;
    //this.waves.push(wave.emit());

//    wave = new Game.WaveType.Line(50, 0);
//    this.waves.push(wave.emit());
//   wave.angle = 360/5;
//   this.waves.push(wave.emit());
//   wave.angle = 360/5 * 2;
//   this.waves.push(wave.emit());
//   wave.angle = 360/5 * 3;
//   this.waves.push(wave.emit());
//   wave.angle = 360/5 * 4;
//   this.waves.push(wave.emit());

};

Game.ObjectManager.prototype.update = function(dt) {
    for (var w = 0; w < this.waveObjs.length; w++) {
        this.waves.push(this.waveObjs[w].emit());
    }
    
    for (var w = 0; w < this.waves.length; w++) {
        var bullets = this.waves[w];
        for (var i = 0; i < bullets.length; i++) {
            bullets[i].update(dt);
        }
    }

};

Game.ObjectManager.prototype.draw = function(ctx) {
    for (var w = 0; w < this.waves.length; w++) {
        var bullets = this.waves[w];
        for (var i = 0; i < bullets.length; i++) {
            bullets[i].draw(ctx);
        }
    }
};

Game.ObjectManager.prototype.cleanObjects = function() {
    for (var w = this.waves.length - 1; w >= 0; w--) {
        if (this.waves[w].length === 0) { 
            this.waves.splice(w, 1); 
        }
        else {
            var bullets = this.waves[w];
            for (var i = bullets.length - 1; i >= 0; i--) {
                if (bullets[i].isOutOfBounds(this.canvas.backBuffer.width, this.canvas.backBuffer.height)) {
                bullets.splice(i, 1); 
                }
            }
        }
    }
};

Game.ObjectManager.prototype.addEmission = function(emission) {
    this.waves.push(emission);
   // for (var j = 0; j < emission.length; j++) {
   //     this.bullets.push(emission[j]);
   // }
};
