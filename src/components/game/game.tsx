import GameLogic from '../../logic/game-logic';
import GameModel from '../../models/game-model';
import Guess from '../guess/guess';

import './game.css';

interface Props {
	game: GameModel;
}

const Game = (props: Props) => {
	const content = props.game.guesses.map((guess, n) => {
		const highlight = (n < props.game.guesses.length - 1) || (guess === props.game.target);
		const state = GameLogic.getGuessState(props.game, n);
		return <Guess key={n} guess={guess} target={highlight ? props.game.target : null} state={state} />;
	});

	return (
		<div className='game'>
			{ content }
		</div>
	);
}

export default Game;
