import { useState } from 'react';

import { Selector } from '../../controls';

import GameLogic from '../../logic/game-logic';
import GuessState from '../../models/guess-state';
import Guess from '../guess/guess';

import './candidates.css';

interface Props {
	guesses: string[];
	answers: string[];
	select: (guess: string) => void;
}

const Candidates = (props: Props) => {
	const [ showAnswersOnly, setShowAnswersOnly ] = useState(false);

	const counts = GameLogic.getLetterCounts(props.answers);

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

	// Calculate the significance value for each letter at each position
	const calculations = [
		new Map<string, number>(),
		new Map<string, number>(),
		new Map<string, number>(),
		new Map<string, number>(),
		new Map<string, number>()
	];
	for (let n = 0; n < 5; ++n) {
		letters.forEach(letter => {
			const significance = GameLogic.getLetterSignificance(props.answers, letter, n)
			calculations[n].set(letter, significance);
		});
	};

	// Get the list of candidates
	let candidates = showAnswersOnly ? props.answers : props.guesses;

	// Calculate the fitness for each candidate
	const fitness = new Map<string, number>();
	candidates.forEach(candidate => {
		const f = candidate
			.split('')
			.map((letter, n) => calculations[n].get(letter) ?? 0)
			.reduce((prev, current) => prev + current, 0);
		fitness.set(candidate, f);
	});

	const guesses = candidates
		.sort((a, b) => {
			// Prefer higher fitness
			let value = (fitness.get(b) ?? 0) - (fitness.get(a) ?? 0);
			if (value === 0) {
				// Prefer answers to non-answers
				value = (props.answers.includes(b) ? 1 : 0) - (props.answers.includes(a) ? 1 : 0);
			}
			return value;
		})
		.slice(0, Math.min(candidates.length, 1000))
		.map(candidate => {
			const className = props.answers.includes(candidate) ? 'candidate-container answer' : 'candidate-container';
			const guess = GameLogic.createGuess(candidate, GuessState.candidate);
			return (
				<div key={candidate} className={className} onClick={() => props.select(candidate)}>
					<Guess guess={guess} letterStateSelected={null} />
				</div>
			);
		});

	return (
		<div className='candidates'>
			<div className='heading'>
				<div>Valid guesses</div>
				<div>{props.guesses.length}</div>
			</div>
			<div className='heading'>
				<div>Of which, potential answers</div>
				<div>{props.answers.length}</div>
			</div>
			<hr/>
			<div className='histogram'>
				{ bars }
			</div>
			<hr/>
			<Selector
				options={[ { id: 'all', text: 'Show All' }, { id: 'answers', text: 'Answers Only' } ]}
				selectedID={showAnswersOnly ? 'answers' : 'all'}
				selectionChanged={id => setShowAnswersOnly(id === 'answers')}
			/>
			<div className='list'>
				{guesses}
			</div>
		</div>
	);
}

export default Candidates;
