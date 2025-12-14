type ModalAttributes = {
    victory : boolean;
    onReset : () => void;
}

const ModalEndGame = ({ victory, onReset} : ModalAttributes) => {
    return (
        <div className='absolute flex items-center justify-center inset-0'>
            <div className='bg-gray-900/80 backdrop-blur-sm text-center 
                px-20 py-10 border border-red-400/40 rounded-xl 
                shadow-lg animate-fade-in space-y-4'>

                <div className='flex flex-col items-center space-y-8'>
                    <h2 className={`text-5xl font-bold
                        ${victory ? 'text-amber-400' : 'text-red-400'}
                        `}>
                        {victory ? 'Victory' : 'Game Over'}
                    </h2>

                    <p className='text-xl text-gray-300'>
                        {victory ? 'You cleared the board :D' : 'You hit a mine :('}
                    </p>

                    <button onClick={onReset}
                        className='bg-gray-700 text-gray-100 rounded-lg 
                            px-6 py-2 hover:bg-gray-600 transition-colors'>
                        Restart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalEndGame;