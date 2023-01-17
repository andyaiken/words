import GameLogic from '../../logic/game-logic';
import GuessState from '../../models/guess-state';
import Guess from '../guess/guess';

import './candidates.css';

interface Props {
	candidates: string[];
	select: (guess: string) => void;
}

const Candidates = (props: Props) => {
	const counts = GameLogic.getLetterCounts(props.candidates);

	const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
	const max = Math.max(...letters.map(letter => counts.get(letter) ?? 0));

	const bars = letters.map(letter => {
		const count = counts.get(letter) ?? 0;
		const height = `${50 * count / max}px`;
		return (
			<div key={letter} className='bar-container'>
				<div className='bar-value' style={{ height: height }}></div>
				<div className='bar-key'>{ letter }</div>
			</div>
		);
	});

	const fitness = new Map<string, number>();
	props.candidates.forEach(candidate => {
		fitness.set(candidate, GameLogic.getFitness(candidate, props.candidates));
	});
	const guesses = props.candidates
		.sort((a, b) => (fitness.get(b) ?? 0) - (fitness.get(a) ?? 0))
		.map(candidate => {
			return (
				<div key={candidate} className='candidate-container' onClick={() => props.select(candidate)}>
					<Guess guess={candidate} target={null} state={GuessState.candidate} />
				</div>
			);
		});

	return (
		<div className='candidates'>
			<div className='heading'>
				<div>Possible answers</div>
				<div>{props.candidates.length}</div>
			</div>
			<hr/>
			<div className='histogram'>
				{ bars }
			</div>
			<hr/>
			<div className='list'>
				{guesses}
			</div>
		</div>
	);
}

export default Candidates;
