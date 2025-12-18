import { useState } from 'react';
import { MinesweeperGame, boardStates } from '../../utils/minesweeper/MinesweeperGame';
import type { MatrixSize, MatrixIndex } from '../../types/board-types';
import GameSquare from './GameSquare';
import ModalEndGame from './ModalEndGame';

const Minesweeper = ({ rows, cols } : MatrixSize) => {
    const [game, setGame] = useState<MinesweeperGame | null>(null);
    const [visibleBoard, setVisibleBoard] = useState<number[][]>(() => Array.from({ length: rows },
                                                () => Array(cols).fill(boardStates.NONE)));
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [victory, setVictory] = useState<boolean>(false);

    const peek = (row : number, col : number) : void => {
        let currentGame : MinesweeperGame | null = game;

        if(currentGame === null) {
            // creation of the game after first click
            currentGame = new MinesweeperGame(rows, cols, { row, col });
            setGame(currentGame);
        }
        
        if(currentGame !== null && !gameOver) {
            let copy : number[][] = [...visibleBoard];
            let posQueue : MatrixIndex[] = [];

            posQueue.push({ row, col });
            
            while(posQueue.length > 0) {
                let elem : MatrixIndex | undefined = posQueue.shift();

                if(elem !== undefined) {
                    // position has not been processed
                    let result : number = currentGame.peekPosition(elem.row, elem.col);

                    copy[elem.row][elem.col] = result;

                    if(result === 0 || result === flagsAround(elem.row, elem.col)) {
                        // all squares around are not mines
                        const startR : number = (elem.row === 0 ? elem.row : elem.row-1);
                        const startC : number = (elem.col === 0 ? elem.col : elem.col-1);
                        const endR : number = (elem.row === rows-1 ? elem.row : elem.row+1);
                        const endC : number = (elem.col === cols-1 ? elem.col : elem.col+1);

                        for(let r : number = startR; r <= endR; r++) {
                            for(let c : number = startC; c <= endC; c++) {
                                if(copy[r][c] === boardStates.NONE && !posQueue.some(pos => pos.row === r && pos.col === c)) {
                                    // not already processed nor in the queue
                                    posQueue.push({ row : r, col : c});
                                }
                            }
                        }


                    } else if(result === boardStates.MINE) {
                        // lost the game, stop processing squares
                        setGameOver(true);
                        posQueue = [];
                    }
                }
            }

            setVisibleBoard(copy);

            if(currentGame.isViscory()) {
                setVictory(true);
            }
        }
    };

    const flagsAround = (row : number, col : number) : number => {
        let count : number = 0;
        const startR : number = (row === 0 ? row : row-1);
        const startC : number = (col === 0 ? col : col-1);
        const endR : number = (row === rows-1 ? row : row+1);
        const endC : number = (col === cols-1 ? col : col+1);

        for(let r : number = startR; r <= endR; r++) {
            for(let c : number = startC; c <= endC; c++) {
                if(visibleBoard[r][c] === boardStates.FLAG) {
                    // not already processed
                    count++;
                }
            }
        }

        return count;
    };

    const flag = (row : number, col : number) : void => {
        const current : number = visibleBoard[row][col];

        if(!gameOver) {
            if(current === boardStates.NONE || current === boardStates.FLAG) {
                const newState : number = current === boardStates.NONE ? boardStates.FLAG : boardStates.NONE;

                setVisibleBoard((prev : number[][]) => {
                    let copy : number[][] = [ ...prev ];
                    copy[row][col] = newState;
                    return copy;
                });
            }
        }
    };

    const resetGame = () : void => {
        setGame(null);
        setGameOver(false);
        setVictory(false);
        setVisibleBoard(Array.from({ length: rows }, () => Array(cols).fill(boardStates.NONE)));
    };

    return (
        <main className='flex flex-col items-center mt-20'>
            <h1 className={`text-6xl font-extrabold tracking-wide
                transition-colors duration-300
                ${victory
                    ? 'bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(250,204,21,0.6)]'
                        : gameOver ? 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]'
                            : 'bg-gradient-to-r from-gray-200 via-gray-400 to-gray-100 bg-clip-text text-transparent'}
                `}>
                Minesweeper
            </h1>
            
            <div className='relative'>
                <div className='p-8 m-5 grid'
                    style={{ gridTemplateColumns: `repeat(${rows}, minmax(0, 1fr))` }}>
                    {Array.from({ length: rows }).map((_, rowIndex) => {
                        return Array.from({ length: cols }).map((_, colIndex) => {
                            return (
                                <GameSquare key={`${rowIndex}-${colIndex}`}
                                    value={visibleBoard[rowIndex][colIndex]}
                                    peek={() => peek(rowIndex, colIndex)}
                                    flag={() => flag(rowIndex, colIndex)} />
                            );
                        });
                    })}
                </div>
            
                {gameOver && <ModalEndGame victory={false} onReset={resetGame} />}
                {victory && <ModalEndGame victory={true} onReset={resetGame} />}

            </div>
        </main>
    );
};

export default Minesweeper;