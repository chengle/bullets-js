Game.Timer = function() {
    this.FPS = 1000 / 30;
    this.startTime = 0;
    this.lastTime = 0;
    this.intervalFunc = null;
    this.updateObject = null;
}

Game.Timer.prototype = {
    start: function() {
        this.lastTime = new Date().getTime();
        this.startTime = this.lastTime;
        var self = this;
        this.intervalFunc = setInterval(function() { self.tick() }, this.FPS);
    },
    
    tick: function() {
        if (this.updateObject != null) {
            var newTime = new Date().getTime();
            var dt = (newTime - this.lastTime) / 1000;
            this.lastTime = newTime;
            this.updateObject.update(dt);
        }
    },

    stop: function() {
        clearInterval(this.intervalFunc);
    }
};
