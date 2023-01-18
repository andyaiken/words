import GameModel from '../../models/game-model';
import Guess from '../guess/guess';

import './game.css';

interface Props {
	game: GameModel;
}

const Game = (props: Props) => {
	const content = props.game.guesses.map((guess, n) => {
		return (
			<Guess
				key={n}
				guess={guess}
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
