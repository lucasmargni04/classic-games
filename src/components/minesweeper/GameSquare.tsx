import { boardStates } from '../../utils/minesweeper/MinesweeperGame';
import flagImage from '../../assets/flag.png';
import mineImage from '../../assets/mine.png';

type SquareAttributes = {
    value : number;
    peek : () => void;
    flag : () => void;
}

const getSquareContent = (value : number) => {
    switch(value) {
        case boardStates.NONE:
            return '';
        case boardStates.FLAG:
            return (<img src={flagImage} className="w-8 h-8 mx-auto" />);
        case boardStates.MINE:
            return (<img src={mineImage} className="w-8 h-8 mx-auto" />);
        default:
            return value;
    }
}

const GameSquare = ({ value, peek, flag } : SquareAttributes) => {
    return (
        <button onClick={peek}
            onContextMenu={(e) => {e.preventDefault(); flag()}}
            className={`h-12 w-12 border-1 border-gray-800 text-2xl
            ${value === boardStates.NONE ? 'bg-gray-500' : 'bg-gray-600'}
            `}>
            {getSquareContent(value)}
        </button>
    );
}

export default GameSquare;