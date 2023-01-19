import { Selector } from '../../controls';

import LetterModel from '../../models/letter-model';
import LetterState from '../../models/letter-state';

import './letter.css';

interface Props {
	letter: LetterModel;
	letterStateSelected: ((letter: LetterModel, state: LetterState) => void) | null;
}

const Letter = (props: Props) => {
	const callback = (state: string) => {
		if (props.letterStateSelected) {
			props.letterStateSelected(props.letter, state as LetterState);
		}
	}

	let selector = null;
	if (props.letterStateSelected !== null) {
		const options = [
			{ id: LetterState.correct, text: 'Y' },
			{ id: LetterState.partial, text: '?' },
			{ id: LetterState.incorrect, text: 'N' }
		]
		selector = <Selector options={options} selectedID={props.letter.state} selectionChanged={id => callback(id)} />;
	}

	const className = `box ${props.letter.state}`;
	return (
		<div className='letter'>
			<div className={className}>
				{ props.letter.text }
			</div>
			{ selector }
		</div>
	);
}

export default Letter;
