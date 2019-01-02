const DEAD = 0;
const ALIVE = 1;

class Cave {
    constructor(name){
        this.name = name;
        this.seed = Date.now();
        this.chanceToStartAlive = 0.5;
        this.numberOfSteps = 5;
        this.padding = 2;
        this.CELL = 4; //cell width
    }

    render(){
        this.canvas = document.getElementById(this.name);
        this.ctx = this.canvas.getContext("2d");
        this.h = Math.floor(this.canvas.height/this.CELL);
        this.w = Math.floor(this.canvas.width/this.CELL);
        this.board = this.makeArray2d(this.w,this.h);
        this.generateCave();
    }

    generateCave(){
        this.initCells();
        for(let i = 0; i < this.numberOfSteps; i++){
            this.nextStep();
        }
        this.drawGrid();
    }

    initCells(){
        for(let i = this.padding; i < this.w-this.padding; i++){
            for(var j = this.padding; j < this.h-this.padding; j++){
                if(this.random(0,1) < this.chanceToStartAlive)
                    this.board[i][j] = ALIVE;
                else 
                    this.board[i][j] = DEAD;
            }
        }
    }
    
    nextStep(){
        let next = new Array(this.w);
        for(let i = 0; i < this.w; i++){
            next[i] = new Array(this.h);
            for(let j = 0; j < this.h; j++){
                let nbrs = this.countAliveNeighbors(i,j);
                
                if(this.board[i][j] === ALIVE){
                    if(nbrs < 4){ //if starvation
                        next[i][j] = DEAD; //cell dies
                    } else {
                        next[i][j] = ALIVE;
                    }
                } else {
                    if(nbrs > 4){ //if breeding
                        next[i][j] = ALIVE; //cell born
                    } else {
                        next[i][j] = DEAD;
                    }
                }
            }
        }
        this.board = next;
    }
    
    countAliveNeighbors(x, y){
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                    //if cell is in the boundaries
                let isInBound = x+i < this.w && y+j < this.h && x+i >= 0 && y+j >= 0;
                if(!isInBound) return 0; //if cell is on edge

                    //count alive cells around the middle cell
                let isMiddle = i === 0 && j === 0;
                let isAlive = this.board[x+i][y+j] === ALIVE;
                if(!isMiddle && isAlive) count++;
            }
        }
        return count;
    }

    makeArray2d(width, height){
        let arr = new Array(width);
        for (let i = 0; i < width; i++) {
            arr[i] = new Array(height);
        }
        return arr;
    }

    random(min, max){
        max = max || 1;
        min = min || 0;
        this.seed = (this.seed * 9301 + 49297) % 233280;
        let rnd = this.seed / 233280;
        return min + rnd * (max - min);
    }

    drawGrid(){
        //background
        this.ctx.fillStyle = "#000000"; //black
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
    
        //cells color
        this.ctx.fillStyle = "#ffffff"; //white
    
        //draw
        for(var i = 0; i < this.w; i++){
         for(var j = 0; j < this.h; j++){
            if(this.board[i][j] === ALIVE){
                this.ctx.fillRect(i*this.CELL, j*this.CELL, this.CELL, this.CELL);
            }
         }
        }
    }
}

export default Cave;