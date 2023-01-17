import GameModel from '../models/game-model';
import GuessState from '../models/guess-state';
import LetterState from '../models/letter-state';
import Utilities from './utilities';

export default class GameLogic {
	static createGame = (answers: string[]) => {
		const index = Utilities.randomNumber(answers.length);
		const game: GameModel = {
			target: answers[index],
			guesses: [ '' ]
		};
		return game;
	}

	static addLetter = (game: GameModel, guesses: string[], letter: string) => {
		if (game.guesses.length === 0) {
			return;
		}

		// Get the current guess
		let guess = game.guesses[game.guesses.length - 1];

		// Add the new letter
		guess = `${guess}${letter}`;
		game.guesses[game.guesses.length - 1] = guess;

		// Have we finished a guess?
		if (guess.length >= 5) {
			// Is it a real guess?
			if (guesses.includes(guess)) {
				// Is it right?
				if (game.target === guess) {
					// It's right!
				} else {
					// Start a new guess
					game.guesses.push('');
				}
			}
		}
	}

	static removeLetter = (game: GameModel) => {
		if (game.guesses.length === 0) {
			return;
		}

		// Get the current guess
		let guess = game.guesses[game.guesses.length - 1];

		if (guess === '') {
			return;
		}

		// Remove the last letter
		guess = guess.substring(0, guess.length - 1);
		game.guesses[game.guesses.length - 1] = guess;
	}

	static getGuessState = (game: GameModel, n: number) => {
		const guess = game.guesses[n];

		if (guess === game.target) {
			return GuessState.correct;
		}

		if (n === game.guesses.length - 1) {
			if (guess.length === 5) {
				return GuessState.gibberish;
			}

			return GuessState.current;
		}

		return GuessState.former;
	}

	static getLetterState = (guess: string, target: string, n: number) => {
		if (guess.length < 5) {
			return LetterState.active;
		}

		// If letters at this position are the same, correct
		const guessLetter = guess[n];
		const targetLetter = target[n];
		if (guessLetter === targetLetter) {
			return LetterState.correct;
		}

		// If this letter exists in target, partial
		if (target.includes(guessLetter)) {
			return LetterState.partial;
		}

		// Otherwise, incorrect
		return LetterState.incorrect;
	}

	static getCandidates = (answers: string[], guesses: string[], game: GameModel) => {
		const correct = [ '.', '.', '.', '.', '.' ];
		const elsewhere = [ '', '', '', '', '' ];
		const present: string[] = [];
		const absent: string[] = [];

		game.guesses
			.filter(guess => guess.length === 5)
			.filter(guess => guesses.includes(guess))
			.forEach(guess => {
				for (let n = 0; n < 5; ++n) {
					switch (GameLogic.getLetterState(guess, game.target, n)) {
						case LetterState.correct:
							correct[n] = guess[n];
							break;
						case LetterState.partial:
							elsewhere[n] += guess[n];
							if (!present.includes(guess[n])) {
								present.push(guess[n]);
							}
							break;
						case LetterState.incorrect:
							if (!absent.includes(guess[n])) {
								absent.push(guess[n]);
							}
							break;
					}
				}
			});
		const correctRegex = correct.join('');
		const elsewhereRegex = elsewhere.map(str => str === '' ? '.' : `[^${str}]`).join('');

		return answers
			.filter(answer => answer.match(correctRegex) != null)
			.filter(answer => answer.match(elsewhereRegex) != null)
			.filter(answer => present.every(ch => answer.includes(ch)))
			.filter(answer => absent.every(ch => !answer.includes(ch)));
	}

	static getLetterCounts = (guesses: string[]) => {
		const counts = new Map<string, number>();
		guesses.forEach(guess => {
			guess.split('').forEach(letter => {
				const count = (counts.get(letter) ?? 0) + 1;
				counts.set(letter, count);
			});
		});
		return counts;
	}

	static getFitness = (guess: string, candidates: string[]) => {
		return [ 0, 1, 2, 3, 4 ]
			.map(n => {
				// Get the percentage of candidates which share the letter in position n with the guess
				const pc = candidates.map(str => str[n]).filter(letter => letter === guess[n]).length / candidates.length;

				// Get the relevance of this letter - closer to 50% is best
				if (pc <= 0.5) {
					return pc * 2;
				} else {
					return (1 - pc) * 2;
				}
			})
			.reduce((prev, current) => prev + current, 0);
	}
}
