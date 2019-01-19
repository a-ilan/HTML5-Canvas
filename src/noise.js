import SimplexNoise from "simplex-noise";
import Alea from "alea";

class Noise {
    constructor(name){
        this.name = name;
    }
    
    render(){
        this.canvas = document.getElementById(this.name);
        this.ctx = this.canvas.getContext("2d");
        this.h = this.canvas.height;
        this.w = this.canvas.width;
        this.seed = Date.now();
        this.simplex = new SimplexNoise(new Alea(this.seed));
        this.ctx.resetTransform();
        this.imageData = this.ctx.getImageData(0,0,this.w,this.h);
        for(var i = 0; i < this.w; i++){
			for(var j = 0; j < this.h; j++){
				var value = this.turbulence(i,j,3,0.3,0.5,10,250);
				this.setHeight(i,j,value);
			}
        }
        this.ctx.putImageData(this.imageData, 0, 0);
    }

    setPixel(x,y,value){
        var i = (this.w*y+x)*4;
        this.imageData.data[i+0] = (value >> 0) & 0xff;
        this.imageData.data[i+1] = (value >> 8) & 0xff;
        this.imageData.data[i+2] = (value >> 16) & 0xff;
        this.imageData.data[i+3] = 0xff;
    }

    setHeight(x,y,value){
        var i = (this.w*y+x)*4;
        this.imageData.data[i+0] = value;
        this.imageData.data[i+1] = value;
        this.imageData.data[i+2] = value;
        this.imageData.data[i+3] = 0xff;
    }

    turbulence(x,y,octaves,persistence,scale,low,high){
        var maxAmp = 0;
        var amp = 1;
        var freq = scale*0.01;
        var total = 0;
        for(var i = 0; i < octaves; i++){
            total += this.simplex.noise2D(x*freq,y*freq)*amp;
            maxAmp += amp;
            amp *= persistence;
            freq *= 2;
        }
        total /= maxAmp;
        total = total * (high - low) / 2 + (high + low) / 2;
        return total;
    }
}



export default Noise;