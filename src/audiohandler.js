/**
 * Handles loading and playing of mp3 and other audio files. 
 */
var AudioHandler = function() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();

    this.source = null;
    this.buffer = null;

    this.startTime = 0;

    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 64; 
    this.analyser.connect(this.context.destination);
    this.times = new Uint8Array(this.analyser.frequencyBinCount);
    this.freqs = new Uint8Array(this.analyser.frequencyBinCount);

    this.beatTimes = [];
    this.beatCounter = 0;
    
    this.waveTimes = [];
    this.waveCounter = 0;
    this.waveTypes = [new Game.WaveType.Spiral(3, 10),
                      new Game.WaveType.Spiral(3, -10),
                      ];
    
    var s = new Game.WaveType.Spiral(3, 10);
    s.x = 50;
    var s2 = new Game.WaveType.Spiral(3, -10);
    s2.x = 50;
    this.waveTypes2= [s, s2, ];

    var c = new Game.WaveType.Circle(50, 'yellow');
    c.v = 200;
    var st = new Game.WaveType.Stream(4, 10, 'yellow');
    var ca = new Game.WaveType.Cascade(32, 10, 'yellow');

    this.beatTypes = [s, c, ca, st];

    this.colors = ['yellow', 'orange', 'red', 'orange'];
}

/**
 * Returns a wave of bullets.
 */
AudioHandler.prototype.getEmission = function(ctx) {
    if (this.source === null) { return []; }

    var emission = [];

    this.analyser.getByteTimeDomainData(this.times);
    this.analyser.getByteFrequencyData(this.freqs);
    // uncomment below to use self-written FFT instead
    //this.freqs = FFT(this.times)[0];
     
    var amplitude = 0;
    var highestFreq = 0;

    for (var i = 0; i < this.analyser.frequencyBinCount; i++) {
        if (highestFreq < this.freqs[i]) {
            highestFreq = this.freqs[i];
        }
            
        var value = this.freqs[i];
        var percent = value / 256;
        var hue = percent * 360;
        var color = 'hsl(' + hue + ', 100%, 50%)';

        var x = i / this.analyser.frequencyBinCount * 450;
        //var b = new Game.Bullet();
        //b.x = i / this.analyser.frequencyBinCount * 450;
        //b.color = color;
        //b.angle = 90;

        ctx.fillStyle = color;
        ctx.fillRect(x, 10, 20, 10);

        //emission.push(b);
        amplitude += this.freqs[i];
    }

    
    var beatTime = this.beatTimes[this.beatCounter];   
    var waveTime = this.waveTimes[this.waveCounter];
    var time = this.context.currentTime - this.startTime;
    var dir = 1;
    var arms = 3;
    if (time > waveTime)  { 
        this.waveCounter++;
    }
    while (Math.abs(beatTime - time) < 0.1 || time > beatTime) {
        if (this.beatCounter > this.beatTimes.length) {break;}

        this.beatCounter += 1;
        beatTime = this.beatTimes[this.beatCounter];
        
        this.beatTypes[1].nBullets = amplitude/3000 * 50;
        this.beatTypes[1].color = this.colors[this.waveCounter % this.colors.length];
        emission = emission.concat(this.beatTypes[1].emit());
        dir = -dir;
        arms++;
    }
   // var emitter = this.waveTypes[this.waveCounter % this.waveTypes.length];
    var emitter = this.waveTypes[1];
    emitter.spinRate = dir * emitter.spinRate;
    emitter.nArms = arms;
    emission = emission.concat(emitter.emit());

    return emission;
}

/**
 * Beat detection. 
 **/
AudioHandler.prototype.getBeats = function() {
    var left = this.source.buffer.getChannelData(0);
    var right = this.source.buffer.getChannelData(1);

    var sampleSize = 1024;
    var localSamples = this.context.sampleRate/sampleSize; // about 1 second
    var instEnergies = []; //instaneous energy buffer
    var localEnergy = 0;  //sum of the instaneous energies; about 1 second
    var localEnergies = [];
    var varience = 0;
    var count = 0;
    for (var i = 0; i < left.length; i += sampleSize) {
        var e = 0;
        for (var j = 0; j < sampleSize; j++) {
            e += (left[i + j] * left[i + j]) + (right[i + j] * right[i + j]);
        }
        instEnergies.push(e);
        localEnergy += e;
        if (count < localSamples) { count++; }
        if (count >= localSamples) {
           localEnergy -= instEnergies[0]; 
           varience -= (localEnergies[0] - instEnergies[0]);
           count--;
           instEnergies.shift();
           localEnergies.shift();
        }
        localEnergies.push(localEnergy / localSamples);
        varience += (e - localEnergy/localSamples);

        var c = -0.00257 * Math.abs(varience)/localSamples + 1.514;
        if (e > c * localEnergies[localEnergies.length - 1]) {
            var beatTime = i / this.context.sampleRate;
            this.beatTimes.push(beatTime);
        }
    }
}

/**
 * Wave detection.
 *  Detects when the music changes moods dramatically.
 *   
 **/
 AudioHandler.prototype.getWaves = function() {
    var left = this.source.buffer.getChannelData(0);
    var right = this.source.buffer.getChannelData(1);

    var sampleSize = 0.9 * this.context.sampleRate; //about 1 second
    var localSamples = 7; 
    var instEnergies = []; //instaneous energy buffer
    var localEnergy = 0;  
    var count = 0;
    var skipCountDown = 0;
    for (var i = 0; i < left.length; i += sampleSize) {
        var e = 0;
        for (var j = 0; j < sampleSize; j++) {
            e += (left[i + j] * left[i + j]) + (right[i + j] * right[i + j]);
        }
        instEnergies.push(e);
        localEnergy += e;
        if (count < localSamples) { count++; }
        if (count >= localSamples) {
           localEnergy -= instEnergies[0]; 
           count--;
           instEnergies.shift();
        }
        skipCountDown ++;
        if ((Math.abs(e - 1/localSamples*localEnergy) > 0.2/localSamples * localEnergy ||
            false) && skipCountDown > 3) {
            var waveTime = i / this.context.sampleRate;
            this.waveTimes.push(waveTime);
            skipCountDown = 0;
        }
    }
 };

AudioHandler.prototype.playSound = function(arraybuffer) {
    var h = this;
    this.context.decodeAudioData(arraybuffer, function (buf) {
        h.source = h.context.createBufferSource();
        h.source.connect(h.context.destination);
        h.source.connect(h.analyser);
        h.source.buffer = buf;

        h.getBeats();
        h.getWaves();
        h.startTime = h.context.currentTime;

        h.source.start(0);
    });
}

AudioHandler.prototype.playFile = function(file) {
    var h = this;
    var freader = new FileReader();
    freader.onload = function(e) {
        buffer = e.target.result;
        h.playSound(buffer);
    };
    freader.readAsArrayBuffer(file);
}

function handleFileSelect(handler, evt) {
    var files = evt.target.files;
    handler.playFile(files[0]);
}

