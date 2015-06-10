Game.WaveType = {};

Game.WaveType.Spiral = function(nArms, spinRate, color) {
    this.nArms = nArms;
    this.emitAngle = 0;
    this.spinRate = spinRate;

    this.x = 200;
    this.y = 200;
    this.v = 150;
    if (color === undefined) { this.color = 'lawngreen'; }
    else {this.color = color; }
    this.shape = 'petal';
};

Game.WaveType.Spiral.prototype.emit = function() {
    var bullets = [];
    for (var i = 0; i < 360; i+=360/this.nArms) {
        var b = new Game.Bullet();
        b.angle = (i + 90 + this.emitAngle) % 360; 

        b.x = this.x;
        b.y = this.y;
        b.color = this.color;
        b.shape = this.shape;
        b.v = this.v;
        bullets.push(b);

    }
    this.emitAngle = (this.emitAngle + this.spinRate) % 360;
    return bullets;
};

Game.WaveType.Circle = function(nBullets, color) {
    this.nBullets = nBullets;
    this.nArms = 0;    
    this.v = 200;
    this.x = 200;
    this.y = 200;
    if (color === undefined) { this.color = 'lawngreen'; }
    else {this.color = color; }
};

Game.WaveType.Circle.prototype.emit = function() {
    var bullets = [];
    for (var i = 0; i < 360; i+=360/this.nBullets) {
        var b = new Game.Bullet();
        b.angle = (i + 90) % 360; 
        b.x = this.x;
        b.y = this.y;
        b.v = this.v;
        b.color = this.color;
        bullets.push(b);
    }
    return bullets;
};

Game.WaveType.Stream = function(nArms, rowWidth, color) {
    this.nArms = nArms;
    this.rowWidth = rowWidth;
    this.spread = 80;

    this.randFactor = 1;

    this.x = 200;
    this.y = 200;
    if (color === undefined) { this.color = 'lawngreen'; }
    else {this.color = color; }
};

Game.WaveType.Stream.prototype.emit = function() {
    var bullets = [];
    for (var i = 0; i < this.nArms; i++) {
        var angle = i * this.spread/(this.nArms - 1);

        for (var j = 0; j < this.rowWidth; j++) {
             var offset = j - this.rowWidth/2;
             var b = new Game.Bullet();
             b.angle = (angle + j + 5 * Math.sin(i + 2*j + this.randFactor)); 
                
             //b.angle = (angle + 2*j + i); 
             b.angle += (180 - this.spread - 5)/2;

             b.x = this.x;
             b.y = this.y;
             b.color = this.color;
             bullets.push(b);
        }
    }
    this.randFactor += 1;

    return bullets;
};

Game.WaveType.Cascade = function(nArms, rowWidth, color) {
    this.nArms = nArms;
    this.rowWidth = rowWidth;
    this.canvasWidth = 400;

    this.randFactor = 1;

    this.x = 200;
    this.y = 5;
    if (color === undefined) { this.color = 'lawngreen'; }
    else {this.color = color; }
};

Game.WaveType.Cascade.prototype.emit = function() {
    var bullets = [];
    for (var i = 0; i < this.nArms; i++) {
        var x = i * (this.canvasWidth - 5)/(this.nArms - 1);

        for (var j = 0; j < this.rowWidth; j++) {
             var offset = j - this.rowWidth/2;
             var b = new Game.Bullet();
             b.angle = 90 + (3 * Math.sin(i + j + this.randFactor)); 

             b.x = x + (8 * Math.sin(i * j * this.randFactor));
             b.y = this.y;
             b.color = this.color;
             bullets.push(b);
        }
    }
    this.randFactor += 1;

    return bullets;
};



Game.WaveType.pauseMove = function(bullets, stop1, stop2, time) {
    if (Math.abs(time - stop1) < 0.3 || (stop2 > time && time > stop1)) {
        for (var i = 0; i < bullets.length; i++) {
            if (bullets[i].v > 0) { bullets[i].v -= bullets[i].v; }
        }
    }
    else if (Math.abs(time - stop2) < 0.3 || time > stop2) {
        for (var i = 0; i < bullets.length; i++) {
            bullets[i].v = 200;
        }
    }
}
