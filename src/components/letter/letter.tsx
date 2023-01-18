import LetterModel from '../../models/letter-model';
import LetterState from '../../models/letter-state';
import './letter.css';

interface Props {
	letter: LetterModel;
	letterStateSelected: ((letter: LetterModel, state: LetterState) => void) | null;
}

const Letter = (props: Props) => {
	const callback = (state: LetterState) => {
		if (props.letterStateSelected) {
			props.letterStateSelected(props.letter, state);
		}
	}

	let options = null;
	if (props.letterStateSelected !== null) {
		options = (
			<div className='selector'>
				<button onClick={() => callback(LetterState.correct)}>Y</button>
				<button onClick={() => callback(LetterState.partial)}>?</button>
				<button onClick={() => callback(LetterState.incorrect)}>N</button>
			</div>
		)
	}
	const className = `box ${props.letter.state}`;
	return (
		<div className='letter'>
			<div className={className}>
				{ props.letter.text }
			</div>
			{ options }
		</div>
	);
}

export default Letter;
