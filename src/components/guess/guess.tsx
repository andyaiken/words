import GameLogic from '../../logic/game-logic';
import GuessState from '../../models/guess-state';
import LetterState from '../../models/letter-state';
import Letter from '../letter/letter';

import './guess.css';

interface Props {
	guess: string;
	target: string | null;
	state: GuessState;
}

const Guess = (props: Props) => {
	const letters = props.guess.split('').map((letter, n) => {
		const state = props.target ? GameLogic.getLetterState(props.guess, props.target, n) : LetterState.active;
		return <Letter key={n} letter={letter} state={state} />;
	});

	while (letters.length < 5) {
		letters.push(<Letter key={letters.length} letter='' state={LetterState.active} />);
	}

	const className = `guess ${props.state}`;
	return (
		<div className={className}>
			{ letters }
		</div>
	);
}

export default Guess;
