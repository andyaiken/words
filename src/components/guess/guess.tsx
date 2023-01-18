import GuessModel from '../../models/guess-model';
import GuessState from '../../models/guess-state';
import LetterModel from '../../models/letter-model';
import LetterState from '../../models/letter-state';
import Letter from '../letter/letter';

import './guess.css';

interface Props {
	guess: GuessModel;
	letterStateSelected: ((letter: LetterModel, state: LetterState) => void) | null;
}

const Guess = (props: Props) => {
	const letters = props.guess.letters.map((letter, n) => {
		return (
			<Letter
				key={n}
				letter={letter}
				letterStateSelected={(props.letterStateSelected !== null) && (props.guess.state === GuessState.former) ? props.letterStateSelected : null}
			/>
		);
	});

	const className = `guess ${props.guess.state}`;
	return (
		<div className={className}>
			{ letters }
		</div>
	);
}

export default Guess;
