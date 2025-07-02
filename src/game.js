export const Player = {
    RED: 'R',
    BLUE: 'B',
    WILD: 'W'
};

export class GameState {
    constructor() {
        // 3x3x3 board, initialize to null
        this.board = Array(27).fill(null); // board[z*9 + y*3 + x]
        // center space acts as wildcard counted for both players
        this.board[this.index(1,1,1)] = Player.WILD;
        this.current = Player.RED;
    }

    clone() {
        const gs = new GameState();
        gs.board = [...this.board];
        gs.current = this.current;
        return gs;
    }

    index(x, y, z) {
        return z * 9 + y * 3 + x;
    }

    get(x, y, z) {
        return this.board[this.index(x,y,z)];
    }

    set(x, y, z, player) {
        this.board[this.index(x,y,z)] = player;
    }

    isValidMove(x,y,z) {
        // center is wildcard and cannot be played
        if (x===1 && y===1 && z===1) return false;
        return this.get(x,y,z) === null;
    }

    makeMove(x,y,z) {
        if (!this.isValidMove(x,y,z)) return false;
        this.set(x,y,z,this.current);
        this.current = this.current === Player.RED ? Player.BLUE : Player.RED;
        return true;
    }

    checkWin() {
        const lines = [];
        // Generate all lines
        for (let i=0;i<3;i++) {
            for (let j=0;j<3;j++) {
                lines.push([[0,i,j],[1,i,j],[2,i,j]]); // rows x
                lines.push([[i,0,j],[i,1,j],[i,2,j]]); // columns y
                lines.push([[i,j,0],[i,j,1],[i,j,2]]); // stacks z
            }
            lines.push([[0,0,i],[1,1,i],[2,2,i]]); // diag xy plane
            lines.push([[0,2,i],[1,1,i],[2,0,i]]);
            lines.push([[0,i,0],[1,i,1],[2,i,2]]); // diag xz
            lines.push([[0,i,2],[1,i,1],[2,i,0]]);
            lines.push([[i,0,0],[i,1,1],[i,2,2]]); // diag yz
            lines.push([[i,0,2],[i,1,1],[i,2,0]]);
        }
        lines.push([[0,0,0],[1,1,1],[2,2,2]]); // major diag
        lines.push([[0,0,2],[1,1,1],[2,2,0]]);
        lines.push([[0,2,0],[1,1,1],[2,0,2]]);
        lines.push([[0,2,2],[1,1,1],[2,0,0]]);

        for (const line of lines) {
            for (const player of [Player.RED, Player.BLUE]) {
                if (line.every(p => {
                    const v = this.get(...p);
                    return v === player || v === Player.WILD;
                })) {
                    return player;
                }
            }
        }
        return null;
    }
}
