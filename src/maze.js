// Depth First Search

class Maze {
    constructor(name){
        this.name = name;
        this.WALL = 0;
        this.PATH = 1;
        this.UP = 0;
        this.RIGHT = 1;
        this.DOWN = 2;
        this.LEFT = 3;
        this.cell = 6; //cell width
    }

    render(){
        this.canvas = document.getElementById(this.name);
        this.ctx = this.canvas.getContext("2d");

        this.h = Math.floor(this.canvas.height/this.cell);
        this.w = Math.floor(this.canvas.width/this.cell);
        this.board = new Array(this.w);
        for (var i = 0; i < this.w; i++) {
            this.board[i] = new Array(this.h);
        }

        this.setWalls();
        this.setPaths();
        this.drawGrid();
    }

    setWalls(){
        for(var i = 0; i < this.w; i++){
          for(var j = 0; j < this.h; j++){
            this.board[i][j] = this.WALL;
          }
        }
    }

    random(min_inclusive,max_exclusive){
        var min = min_inclusive;
        var max = max_exclusive-min;
        return Math.floor((Math.random() * max) + min);
    }

    random_odd(min_inclusive,max_exclusive){
        var rand = this.random(min_inclusive,max_exclusive);
        if(rand%2 === 0){
          if(rand === max_exclusive-1) rand--;
          else rand++;
        }
        return rand;
      }
    
    // Depth First Search
    setPaths(){
        //stating point
        var dirs = this.randomDirections();
        var x = this.random_odd(0,this.w);
        var y = this.random_odd(0,this.h);
        
        var nodes = [];
        nodes.push([x,y,dirs[0]]);
        nodes.push([x,y,dirs[1]]);
        nodes.push([x,y,dirs[2]]);
        nodes.push([x,y,dirs[3]]);
        this.board[x][y] = this.PATH;
        
        while(nodes.length !== 0){
            var node = nodes.pop();
            var next = this.visitNextNode(node);
            if(next == null) continue;
            x = next[0];
            y = next[1];
            dirs = this.randomDirections();
            nodes.push([x,y,dirs[0]]);
            nodes.push([x,y,dirs[1]]);
            nodes.push([x,y,dirs[2]]);
            nodes.push([x,y,dirs[3]]);
        }
    }
    
    randomDirections(){
        let dir = new Array(4);
        for(let i = 0; i < 4; i++) dir[i] = i;
        for(let i = 0; i < 4; i++){
            let rand = this.random(0,4);
            let tmp = dir[i];
            dir[i] = dir[rand];
            dir[rand] = tmp;
        }
        return dir;
    }
    
    visitNextNode(node){
        var x = node[0];
        var y = node[1];
        var dir = node[2];
        switch(dir){
            case this.UP:
            if(y - 2 > 0 && this.board[x][y-2] === this.WALL){
                this.board[x][y-1] = this.PATH;
                this.board[x][y-2] = this.PATH;
                return [x,y-2];
            }
            break;
            case this.RIGHT:
            if(x + 2 < this.w-1 && this.board[x+2][y] === this.WALL){
                this.board[x+1][y] = this.PATH;
                this.board[x+2][y] = this.PATH;
                return [x+2,y];
            }
            break;
            case this.DOWN:
            if(y + 2 < this.h-1 && this.board[x][y+2] === this.WALL){
                this.board[x][y+1] = this.PATH;
                this.board[x][y+2] = this.PATH;
                return [x,y+2];
            }
            break;
            case this.LEFT:
            if(x - 2 > 0 && this.board[x-2][y] === this.WALL){
                this.board[x-1][y] = this.PATH;
                this.board[x-2][y] = this.PATH;
                return [x-2,y];
            }
            break;
            default:
            return null;
        }
        return null;  
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
            if(this.board[i][j] === this.PATH){
                this.ctx.fillRect(i*this.cell, j*this.cell, this.cell, this.cell);
            }
            }
        }
    }
}



export default Maze;