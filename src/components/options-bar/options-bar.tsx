import './options-bar.css';

interface Props {
	newGame: () => void;
	newSolver: () => void;
	toggleCandidates: () => void;
}

const OptionsBar = (props: Props) => {
	return (
		<div className='options-bar'>
			<button className='option' onClick={props.newGame}>New Game</button>
			<button className='option' onClick={props.newSolver}>New Solver</button>
			<hr/>
			<button className='option' onClick={props.toggleCandidates}>Helper</button>
		</div>
	);
}

export default OptionsBar;
