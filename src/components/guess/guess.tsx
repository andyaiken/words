import GuessModel from '../../models/guess-model';
import Letter from '../letter/letter';

import './guess.css';

interface Props {
	guess: GuessModel;
}

const Guess = (props: Props) => {
	const letters = props.guess.letters.map((letter, n) => {
		return <Letter key={n} letter={letter} />;
	});

	const className = `guess ${props.guess.state}`;
	return (
		<div className={className}>
			{ letters }
		</div>
	);
}

export default Guess;
