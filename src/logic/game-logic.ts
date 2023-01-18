import GameModel from '../models/game-model';
import GuessModel from '../models/guess-model';
import GuessState from '../models/guess-state';
import LetterModel from '../models/letter-model';
import LetterState from '../models/letter-state';
import Utilities from './utilities';

export default class GameLogic {
	static createGame = (answers: string[] | null): GameModel => {
		let target = null;
		if (answers) {
			const index = Utilities.randomNumber(answers.length);
			target = answers[index];
		}

		return {
			target: target,
			guesses: [ GameLogic.createGuess('', GuessState.current) ],
		};
	}

	static createGuess = (text: string, state: GuessState): GuessModel => {
		return {
			state: state,
			letters: [
				text ? GameLogic.createLetter(text[0], LetterState.active) : GameLogic.createLetter('', LetterState.active),
				text ? GameLogic.createLetter(text[1], LetterState.active) : GameLogic.createLetter('', LetterState.pending),
				text ? GameLogic.createLetter(text[2], LetterState.active) : GameLogic.createLetter('', LetterState.pending),
				text ? GameLogic.createLetter(text[3], LetterState.active) : GameLogic.createLetter('', LetterState.pending),
				text ? GameLogic.createLetter(text[4], LetterState.active) : GameLogic.createLetter('', LetterState.pending)
			]
		};
	}

	static createLetter = (text: string, state: LetterState): LetterModel => {
		return {
			text: text,
			state: state
		};
	}

	static getGuessText = (guess: GuessModel) => {
		return guess.letters.map(letter => letter.text).join('').trim();
	}

	static isGameSolved = (game: GameModel) => {
		return game.guesses.some(guess => guess.state === GuessState.correct);
	}

	static addLetter = (game: GameModel, guesses: string[], letter: string) => {
		// Get the current guess
		let guess = game.guesses.find(guess => guess.state === GuessState.current);
		if (!guess) {
			return;
		}

		// Set the new letter
		const lm = guess.letters.find(l => l.text === '');
		if (lm) {
			lm.text = letter;
			GameLogic.setLetterStates(game, guess);
		}

		const text = GameLogic.getGuessText(guess);
		if (text.length >= 5) {
			// Update the guess state
			if (text === game.target) {
				// A correct guess
				guess.state = GuessState.correct;
				GameLogic.setLetterStates(game, guess);
			} else if (guesses.includes(text)) {
				// An incorrect but valid guess
				guess.state = GuessState.former;
				GameLogic.setLetterStates(game, guess);

				// Start a new guess
				guess.state = GuessState.former;
				game.guesses.push(GameLogic.createGuess('', GuessState.current));
			} else {
				// Not a valid guess
				guess.state = GuessState.gibberish;
			}
		}
	}

	static removeLetter = (game: GameModel) => {
		// Get the current guess
		let guess = game.guesses.find(guess => guess.state === GuessState.current);
		if (!guess) {
			return;
		}
		const text = GameLogic.getGuessText(guess);
		if (text === '') {
			return;
		}

		// Remove the last letter
		const lm = guess.letters.slice().reverse().find(l => l.text !== '');
		if (lm) {
			lm.text = '';
			GameLogic.setLetterStates(game, guess);
		}
	}

	static addGuess = (game: GameModel, text: string) => {
		if (GameLogic.isGameSolved(game)) {
			// We've already solved this game
			return;
		}

		if (text === game.target) {
			const guess = GameLogic.createGuess(text, GuessState.correct);
			GameLogic.setLetterStates(game, guess);
			game.guesses[game.guesses.length - 1] = guess;
		} else {
			const guess = GameLogic.createGuess(text, GuessState.former);
			GameLogic.setLetterStates(game, guess);
			game.guesses[game.guesses.length - 1] = guess;

			// Start a new guess
			game.guesses.push(GameLogic.createGuess('', GuessState.current));
		}
	}

	static setLetterStates = (game: GameModel, guess: GuessModel) => {
		const text = GameLogic.getGuessText(guess);
		if (guess.state === GuessState.current) {
			// Active or pending
			for (let n = 0; n < 5; ++n) {
				guess.letters[n].state = text.length >= n ? LetterState.active : LetterState.pending;
			}
		} else if (guess.state === GuessState.correct) {
			// Correct
			guess.letters.forEach(letter => {
				letter.state = LetterState.correct;
			});
		} else {
			// Correct, partial, or incorrect
			guess.letters.forEach((letter, n) => {
				if (game.target) {
					if (letter.text === game.target[n]) {
						letter.state = LetterState.correct;
					} else if (game.target.includes(letter.text)) {
						letter.state = LetterState.partial;
					} else {
						letter.state = LetterState.incorrect;
					}
				} else {
					// We're in solver mode
					letter.state = LetterState.incorrect;
				}
			});
		}
	}

	static getCandidates = (answers: string[], game: GameModel) => {
		const correct = [ '.', '.', '.', '.', '.' ];
		const elsewhere = [ '', '', '', '', '' ];
		const present: string[] = [];
		const absent: string[] = [];

		game.guesses
			.filter(guess => guess.state === GuessState.former)
			.forEach(guess => {
				guess.letters.forEach((letter, n) => {
					switch (letter.state) {
						case LetterState.correct:
							correct[n] = letter.text;
							break;
						case LetterState.partial:
							elsewhere[n] += letter.text;
							if (!present.includes(letter.text)) {
								present.push(letter.text);
							}
							break;
						case LetterState.incorrect:
							if (!absent.includes(letter.text)) {
								absent.push(letter.text);
							}
							break;
					}
				});
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

	static getLetterSignificance = (candidates: string[], letter: string, n: number) => {
		// Get the percentage of candidates which have this letter in position n
		const pc = candidates
			.map(str => str[n])
			.filter(ch => ch === letter)
			.length / candidates.length;

		// Get the relevance of this letter - closer to 50% is best
		if (pc <= 0.5) {
			return pc * 2;
		} else {
			return (1 - pc) * 2;
		}
	}
}
