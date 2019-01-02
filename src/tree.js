class Tree {
    constructor(name){
        this.name = name;
    }
    
    render(){
        this.canvas = document.getElementById(this.name);
        this.ctx = this.canvas.getContext("2d");
        this.h = this.canvas.height;
        this.w = this.canvas.width;
        this.ctx.resetTransform();
        this.ctx.fillStyle = "#000000";
        this.ctx.strokeStyle = "#ffffff";
        this.ctx.fillRect(0,0,this.w,this.h);
        this.ctx.translate(this.w/2,this.h);
        this.branch(110);
    }

    branch(len){
        if(len < 4) return;
  
        let rot1 = Math.PI/this.random(3,7);
        let rot2 = Math.PI/this.random(3,7);
        
        this.ctx.beginPath();
        this.ctx.moveTo(0,0);
        this.ctx.lineTo(0,-len);
        this.ctx.stroke();
        this.ctx.translate(0,-len);
        
        this.ctx.rotate(rot1);
        this.branch(len/this.random(1.4,1.6));
        this.ctx.rotate(-rot1);
        
        this.ctx.rotate(-rot2);
        this.branch(len/this.random(1.4,1.6));
        this.ctx.rotate(rot2);
        
        this.ctx.translate(0,len);
    }

    random(min,max){
        return Math.random() * (max-min) + min;
    }
}



export default Tree;