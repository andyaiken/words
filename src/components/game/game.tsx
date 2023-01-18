import GameModel from '../../models/game-model';
import LetterModel from '../../models/letter-model';
import LetterState from '../../models/letter-state';
import Guess from '../guess/guess';

import './game.css';

interface Props {
	game: GameModel;
	letterStateSelected: (letter: LetterModel, state: LetterState) => void;
}

const Game = (props: Props) => {
	const content = props.game.guesses.map((guess, n) => {
		return (
			<Guess
				key={n}
				guess={guess}
				letterStateSelected={props.game.target ? null : props.letterStateSelected}
			/>
		);
	});

	return (
		<div className='game'>
			{ content }
		</div>
	);
}

export default Game;
