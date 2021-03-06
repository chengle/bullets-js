Game.Player = function() {
    this.x = 200;
    this.y = 10;

    this.color = 'red';
    this.radius = 5;
};

Game.Bullet.prototype.update = function(dt) {
    this.x += dt * this.v * Math.cos(this.angle/180 * Math.PI);
    this.y += dt * this.v * Math.sin(this.angle/180 * Math.PI);
};

Game.Bullet.prototype.draw = function(ctx) {
    if (this.shape === "circle") {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
    }
    else if (this.shape === "petal"){
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.x - this.radius, this.y - this.radius/2);
        ctx.rotate(this.angle/180 * Math.PI);
        ctx.scale(this.radius, this.radius/2);
        ctx.arc(1, 1, 1, 0, 2*Math.PI, false);
        ctx.restore();
    }
   ctx.fillStyle = "#FFFFFF";
   ctx.fill();
   ctx.lineWidth = 1;
   ctx.strokeStyle = this.color;
   ctx.stroke();
};

Game.Bullet.prototype.isOutOfBounds = function(width, height) {
    return this.x > width || this.x < 0 || this.y > height || this.y < 0;
};


document.addEventListener('keydown', function(event) {
});
