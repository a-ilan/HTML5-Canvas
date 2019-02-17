//spiral

var rotation = 0.5000751357963434;
var space = 0.015;
var iter = 20000;
var randomness = 2;
var w,h;

class Galaxy {
    constructor(name) {
        this.name = name;
    }

    render() {
        this.canvas = document.getElementById(this.name);
        this.ctx = this.canvas.getContext("2d");
        h = this.canvas.height;
        w = this.canvas.width;
        this.ctx.fillStyle = "#000000"; //black
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGalaxy();
    }

    drawGalaxy(){
        var pivot = {x: w/2, y: h/2};
        for(var i = 0; i < iter; i++){
            var s = space - i/iter*space*0.4;
            var point = {x: w/2+s*i, y: h/2};
            point = this.rotate(pivot,point,rotation*360*i);
            var r =  i/iter*10 + this.random(0,20)*randomness;
            point.x = point.x + this.random(-r,r);
            point.y = point.y + this.random(-r,r);
            this.drawPixel(point);
        }
    }

    drawPixel(point){
        this.ctx.fillStyle = "#ffffff"; //white
        this.ctx.fillRect(point.x, point.y, 1, 1);
    }

    //2d rotation
    rotate(pivot, point, angle) {
        var radians = (Math.PI / 180) * angle;
        var cos = Math.cos(radians);
        var sin = Math.sin(radians);
        return {
            x: (cos * (point.x - pivot.x)) + (sin * (point.y - pivot.y)) + pivot.x,
            y: (cos * (point.y - pivot.y)) - (sin * (point.x - pivot.x)) + pivot.y
        };
    }

    random(min, max) {
        return Math.random() * (max - min) + min;
    }
}



export default Galaxy;