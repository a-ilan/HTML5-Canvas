// Prim algorithm - minimum spanning tree 

const VOID = 0;
const FLOOR = 1;
const WALL = 2;

class Dungeon {
    constructor(name) {
        this.name = name;
        this.cell = 6;
        this.maxRoomSize = 14;
        this.minRoomSize = 6;
        this.maxRooms = 100;
    }

    render() {
        this.canvas = document.getElementById(this.name);
        this.ctx = this.canvas.getContext("2d");
        this.h = Math.floor(this.canvas.height / this.cell);
        this.w = Math.floor(this.canvas.width / this.cell);
        this.board = Utils.makeArray2d(this.w, this.h);
        this.initCells();
        var rooms = this.addRooms();
        var vertices = this.getVertices(rooms);
        var mst = Utils.getMinSpanningTree(vertices);
        this.addCorridors(vertices, mst);
        this.drawGrid();
    }

    randomRoom() {
        var width = Utils.random_int(this.minRoomSize, this.maxRoomSize);
        var height = Utils.random_int(this.minRoomSize, this.maxRoomSize);
        var x = Utils.random_int(0, this.w - width);
        var y = Utils.random_int(0, this.h - height);
        var room = new Room(x, y, width, height);
        return room;
    }

    addRooms() {
        var rooms = [];
        for (var k = 0; k < this.maxRooms; k++) {
            var room = this.randomRoom();
            if (this.isRoomAvailable(room)) {
                rooms.push(room);
                var x = room.x; var y = room.y;
                var x2 = x + room.width; var y2 = y + room.height;
                for (var i = x; i < x2; i++) {
                    for (var j = y; j < y2; j++) {
                        var isWall = i === x || j === y
                            || i === x2 - 1 || j === y2 - 1;
                        if (isWall) this.board[i][j] = WALL;
                        else this.board[i][j] = FLOOR;
                    }
                }
            }
        }
        return rooms;
    }

    initCells() {
        for (var i = 0; i < this.w; i++) {
            for (var j = 0; j < this.h; j++) {
                this.board[i][j] = VOID;
            }
        }
    }

    isRoomAvailable(room) {
        var x = room.x; var y = room.y;
        var x2 = x + room.width; var y2 = y + room.height;
        for (var i = x; i < x2; i++) {
            for (var j = y; j < y2; j++) {
                if (this.board[i][j] !== VOID) return false;
            }
        }
        return true;
    }

    addCorridors(verts, mst) {
        for (let v = 1; v < verts.length; v++) {
            let u = mst[v];
            this.addCorridor(verts[u], verts[v]);
        }
    }

    addCorridor(p1, p2) {
        if (p1.x < p2.x) {
            let min_x = p1.x;
            let max_x = p2.x;
            let min_y = Math.min(p1.y, p2.y);
            let max_y = Math.max(p1.y, p2.y);
            for (let i = min_x; i < max_x; i++) {
                this.board[i][p1.y] = FLOOR;
                this.addWallToCorridor(i, p1.y);
            }
            this.board[max_x][p1.y] = FLOOR;
            this.addWallToCorridor(max_x, p1.y);
            for (let i = min_y; i < max_y; i++) {
                this.board[max_x][i] = FLOOR;
                this.addWallToCorridor(max_x, i);
            }
        } else {
            let min_x = p2.x;
            let max_x = p1.x;
            let min_y = Math.min(p1.y, p2.y);
            let max_y = Math.max(p1.y, p2.y);
            for (let i = min_x; i < max_x; i++) {
                this.board[i][p2.y] = FLOOR;
                this.addWallToCorridor(i, p2.y);
            }
            this.board[max_x][p2.y] = FLOOR;
            this.addWallToCorridor(max_x, p2.y);
            for (let i = min_y; i < max_y; i++) {
                this.board[max_x][i] = FLOOR;
                this.addWallToCorridor(max_x, i);
            }
        }
    }

    addWallToCorridor(x, y) {
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if (x + i < 0 || y + j < 0) continue;
                if (x + i >= this.w || y + j >= this.h) continue;
                if (this.board[x + i][y + j] === VOID)
                    this.board[x + i][y + j] = WALL;
            }
        }
    }

    getVertices(rooms) {
        var vertices = [];
        for (var i = 0; i < rooms.length; i++) {
            vertices.push(rooms[i].center());
        }
        return vertices;
    }

    drawGrid() {
        for (var i = 0; i < this.w; i++) {
            for (var j = 0; j < this.h; j++) {
                if (this.board[i][j] === FLOOR) {
                    this.ctx.fillStyle = "#ffffff";
                } else if (this.board[i][j] === WALL) {
                    this.ctx.fillStyle = "#555555";
                } else { //background
                    this.ctx.fillStyle = "#000000";
                }
                this.ctx.fillRect(i * this.cell, j * this.cell, this.cell, this.cell);
            }
        }
    }
}

class Utils {
    static seed = Date.now();

    static makeArray2d(width, height) {
        let arr = new Array(width);
        for (let i = 0; i < width; i++) {
            arr[i] = new Array(height);
        }
        return arr;
    }

    static random(min, max) {
        max = max || 1;
        min = min || 0;
        this.seed = (this.seed * 9301 + 49297) % 233280;
        let rnd = this.seed / 233280;
        return min + rnd * (max - min);
    }

    static random_int(min, max) {
        return Math.floor(Utils.random(min, max + 1));
    }

    //prim - minimum spanning tree for complete graphs
    static getMinSpanningTree(vertices) {
        let tree = {};
        let dist = new Array(vertices.length);
        let inQueue = new Array(vertices.length);
        for (let i = 1; i < vertices.length; i++) {
            dist[i] = Infinity;
            inQueue[i] = false;
        }
        let startingIndex = 0;
        dist[startingIndex] = 0;
        let queue = new Heap();

        for (let i = 0; i < vertices.length; i++) {
            queue.push(i, dist[i]);
            inQueue[i] = true;
        }

        while (!queue.empty()) {
            let u = queue.pop();
            inQueue[u] = false;

            for (let v = 0; v < vertices.length; v++) {
                if (v === u) continue;
                let weight = Point.distance(vertices[u], vertices[v]);
                if (inQueue[v] && weight < dist[v]) {
                    dist[v] = weight;
                    tree[v] = u;
                    queue.decreaseKey(v, weight);
                }
            }
        }
        return tree;
    }
}

class Room {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    center() {
        var x = Math.floor(this.x + this.width / 2);
        var y = Math.floor(this.y + this.height / 2);
        return new Point(x, y);
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static distance(p1, p2) {
        let dist_sqr = Math.pow(p2.x - p1.x, 2)
            + Math.pow(p2.y - p1.y, 2);
        return Math.floor(Math.sqrt(dist_sqr));
    }
}

class Heap {
    constructor() {
        this.keys = [null];
        this.items = [null];
    }

    //O(n)
    static build(items, keys) {
        let heap = new Heap();
        if (keys.length === 0) return heap;
        heap.keys = heap.keys.concat(keys);
        heap.items = heap.items.concat(items);
        let first = Math.floor(heap.size() / 2);
        for (let i = first; i >= 1; i--)
            heap.minHeapify(i);
        return heap;
    }

    push(item, key) {
        this.items.push(item);
        this.keys.push(key);
        let i = this.size();
        this.bubbleUp(i);
    }

    bubbleUp(i) {
        let key = this.keys[i];
        while (i >= 1) {
            let j = this.parent(i);
            if (j === -1) return;

            if (key < this.keys[j]) {
                this.swap(i, j);
                i = j;
            }
            else return;
        }
    }

    peek() {
        if (this.empty()) return null;
        return this.items[1];
    }

    pop() {
        if (this.empty()) return null;
        if (this.size() === 1) {
            this.keys.pop();
            return this.items.pop();
        }
        var min = this.items[1];
        this.items[1] = this.items.pop();
        this.keys[1] = this.keys.pop();
        this.minHeapify(1);
        return min;
    }

    //O(logn)
    //shift down
    minHeapify(i) {
        var left = this.left(i);
        var right = this.right(i);
        if (left === -1 && right === -1) return; //if no children
        if (right === -1) { //if one child
            if (this.keys[left] < this.keys[i]) {
                this.swap(i, left);
                this.minHeapify(left);
            }
        }
        else if (this.keys[left] < this.keys[i] || this.keys[right] < this.keys[i]) {
            if (this.keys[left] < this.keys[right]) {
                this.swap(i, left);
                this.minHeapify(left);
            }
            else {
                this.swap(i, right);
                this.minHeapify(right);
            }
        }
    }

    empty() {
        return this.size() === 0;
    }

    size() {
        return this.keys.length - 1;
    }

    parent(i) {
        var parent = Math.floor(i / 2);
        if (parent > this.size() || parent < 1)
            return -1;
        return parent;
    }

    left(i) {
        var left = 2 * i;

        if (left > this.size() || left < 1)
            return -1;

        return left;
    }

    right(i) {
        var right = 2 * i + 1;

        if (right > this.size() || right < 1)
            return -1;

        return right;
    }

    decreaseKey(item, newKey) {
        var index = this.findItem(item);
        this.keys[index] = newKey;
        this.bubbleUp(index);
    }

    findItem(item) {
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i] === item) return i;
        }
        return -1;
    }

    swap(i, j) {
        var tmp = this.keys[i];
        this.keys[i] = this.keys[j];
        this.keys[j] = tmp;

        tmp = this.items[i];
        this.items[i] = this.items[j];
        this.items[j] = tmp;
    }
}

export default Dungeon;