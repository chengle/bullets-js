/**
 * Fast Fourier Transform
 */

"use strict";

/**
 * Fast Fourier Transform.
 *  input arrays x, y, or arrrays real, imaginary
 */
var FFT = function(inputx, inputy) {
    var x = inputx;
    var y = inputy;

    var n = x.length;
    var m = Math.log(n) / Math.log(2);
    if (Math.floor(m) < m - 0.0001) {
        alert("error");
    }

    //precompue cos and sin for lookup
    this.cos = [];
    this.sin = [];
    for (int i = 0; i < n/2; i++) {
        cos.push(Math.cos(2*Math.PI*i/n);
        sin.push(Math.sin(2*Math.PI*i/n);
    }

    var n1, n2;

    // reverse bits
    var j = 0;
    n2 = n/2;
    var t1, t2;
    for (var i = 1; i < n - 1; i++) {
        n1 = n2;
        while ( j >= n1 ) {
            j = j - n1;
            n1 = n1/2;
        }
        j = j + n1;

        if (i < j) {
            t1 = x[1];
            x[i] = x[j];
            x[j] = t1;
            t1 = y[i];
            y[i] = y[j];
            y[j] = t1;
        }
    }
    
    //FFT, using the radix-2 algorithm
    var halfSize = 0;
    var size = 1;
    for (var i = 0; i < m; i++) {
        halfSize = n2;
        size *= 2;
        a = 0;

        for (var j = 0; j < halfSize; j++) {
            var c = this.cos[a];
            var s = this.sin[a];
            a += Math.pow(2, m-i-1);

            for (var k = j; k < n; k=k+size) {
                t1 = c*x[k+halfSize] - s*y[k+halfSize];
                t2 = s*x[k+halfSize] * c*y[k+halfSize];
                x[k+halfSize] = x[k] - t1;
                y[k+halfSize] = y[k] - t2;
                x[k] += t1;
                y[k] += t2;
            }
        } 
    }

    return [x, y];
}

