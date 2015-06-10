//TODO
Sandbox = function() {
    this.canvas = null;
    this.timer = null;
    this.objectManager = null;

    this.audioHandler = null;
};

Sandbox.prototype = {
    update: function(dt) {
        this.objectManager.cleanObjects();

        this.canvas.beginDraw();
        this.objectManager.draw(this.canvas.backBufferContext2D);
        var emission = this.audioHandler.getEmission(this.canvas.backBufferContext2D);
        this.canvas.endDraw();

        this.objectManager.update(dt);
        
        this.objectManager.addEmission(emission);
    },

    initialize: function(resWidth, resHeight) {
        this.audioHandler = new AudioHandler();
        
        var handler = this.audioHandler;
        document.getElementById('files').addEventListener('change', function(evt) {handleFileSelect(handler, evt);}, false);

        this.canvas = new Game.Canvas();
        this.timer = new Game.Timer();
        this.canvas.initialize("canvas", resWidth, resHeight);
        
        this.objectManager = new Game.ObjectManager();
        this.objectManager.initialize(this.canvas);

        this.timer.updateObject = this;

        this.timer.start();
    }

};






