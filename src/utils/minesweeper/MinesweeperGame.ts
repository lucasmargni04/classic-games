import type { MatrixIndex } from '../../types/board-types'
import type { enumBoard } from '../../types/minesweeper-types';

const minePercentage : number = 0.2;

export const boardStates : enumBoard = {
    NONE : -2,
    MINE : -1,
    FLAG : -3 // in visible board only
};

export class MinesweeperGame {
    rows : number;
    cols : number;
    board : number[][];
    mines : MatrixIndex[];
    totalMines : number;
    squaresPeeked : number;
    gameOver : boolean;
    victory : boolean;

    constructor(rows : number, cols : number, initialClick : MatrixIndex) {
        this.rows = rows;
        this.cols = cols;
        this.board = new Array(this.rows)
            .fill(null)
            .map(() => new Array(this.cols).fill(boardStates.NONE));

        this.board[initialClick.row][initialClick.col] = 0;

        this.totalMines = Math.floor(this.rows * this.cols * minePercentage);
        this.squaresPeeked = 1; // because of the initial click

        this.mines = [];
        this.getRandomMines(initialClick);

        this.gameOver = false;
        this.victory = false;
    }

    private getRandomMines(initialClick : MatrixIndex) : void {
        // updates this.mines and this.board at the same time
        let count : number = 0;
        let matrixPos : MatrixIndex;

        this.mines = [];

        while(count < this.totalMines) {
            matrixPos = { row : Math.floor(Math.random()*this.rows),  col : Math.floor(Math.random()*this.cols)};

            if(!this.mines.some(pos => pos.row === matrixPos.row && pos.col === matrixPos.col)
                && (Math.abs(initialClick.row - matrixPos.row) > 1 || Math.abs(initialClick.col - matrixPos.col) > 1)) {
                // matrixPos is a new position and is not around the initial click
                this.mines.push(matrixPos);
                this.board[matrixPos.row][matrixPos.col] = boardStates.MINE;
                count++;
            }
        }
    }

    peekPosition(row : number, col : number) : number {
        let result : number = -2;

        if(row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            // position on the board

            if(this.board[row][col] === boardStates.MINE) {
                // it was a mine, game over
                result = boardStates.MINE;
                this.gameOver = true;
            } else if(this.board[row][col] === boardStates.NONE) {
                // it was not a mine, we return the number of mines around
                result = this.countMinesAround(row, col);

                this.board[row][col] = result;
                this.squaresPeeked++;

                if(this.squaresPeeked === this.rows * this.cols - this.totalMines) {
                    // all squares without mines discovered, the game has been won
                    this.victory = true;
                }
            } else {
                // it was already peeked
                result = this.board[row][col];
            }
        }

        return result;
    }

    private countMinesAround(row : number, col : number) : number {
        let count : number = 0;
        const startR : number = (row === 0 ? row : row-1);
        const startC : number = (col === 0 ? col : col-1);
        const endR : number = (row === this.rows-1 ? row : row+1);
        const endC : number = (col === this.cols-1 ? col : col+1);

        for(let r : number = startR; r <= endR; r++) {
            for(let c : number = startC; c <= endC; c++) {
                if(r !== row || c !== col) {
                    // not in current position
                    count += (this.board[r][c] === boardStates.MINE ? 1 : 0);
                }
            }
        }

        return count;
    }

    isViscory() : boolean {
        return this.victory;
    }

    printBoard() : void {
        console.table(this.board);
    }
}

/*const a = new MinesweeperGame(2, 5, {row : 1, col : 1});
a.printBoard();
console.log(a.peekPosition(0, 0));
console.log(a.peekPosition(0, 1));
a.printBoard();*/