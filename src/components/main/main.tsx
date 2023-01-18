import { Component } from 'react';

import GameLogic from '../../logic/game-logic';
import GameModel from '../../models/game-model';
import LetterModel from '../../models/letter-model';
import LetterState from '../../models/letter-state';
import Candidates from '../candidates/candidates';
import Game from '../game/game';
import OptionsBar from '../options-bar/options-bar';

import './main.css';

interface Props {
	//
}

interface State {
	answers: string[];
	guesses: string[];
	game: GameModel | null;
	showCandidates: boolean;
}

export default class Main extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			answers: [],
			guesses: [],
			game: null,
			showCandidates: false
		};
	}

	setGame = (game: GameModel) => {
		this.setState({
			game: game
		});
	}

	toggleCandidates = () => {
		this.setState({
			showCandidates: !this.state.showCandidates
		});
	}

	componentDidMount(): void {
		document.addEventListener('keydown', this.onKeyDown);

		let answers: string[];
		let guesses: string[];
		fetch('data/answers.txt').then(responseAnswers => {
			responseAnswers.text().then(textAnswers => {
				answers = textAnswers.split('\n');

				fetch('data/guesses.txt').then(responseGuesses => {
					responseGuesses.text().then(textGuesses => {
						guesses = textGuesses.split('\n');

						this.setState({
							answers: answers,
							guesses: answers.concat(guesses).sort(),
							game: GameLogic.createGame(answers)
						});
					});
				});		
			})
		});
	}

	componentWillUnmount(): void {
		document.removeEventListener('keydown', this.onKeyDown);
	}

	onKeyDown = (e: KeyboardEvent) => {
		if (!this.state.game) {
			return;
		}

		if ((e.key === 'Backspace') || (e.key === 'Delete')) {
			GameLogic.removeLetter(this.state.game);
			this.setGame(this.state.game);
		} else {
			// Is it a letter?
			const letter = e.key.toLowerCase();
			if ((letter.length === 1) && !!letter.match(/[a-z]/)) {
				GameLogic.addLetter(this.state.game, this.state.guesses, letter);
				this.setGame(this.state.game);
			}
		}
	}

	onNewGame = () => {
		this.setState({
			game: GameLogic.createGame(this.state.answers)
		});
	}

	onNewSolver = () => {
		this.setState({
			game: GameLogic.createGame(null)
		});
	}

	onLetterStateSelected = (letter: LetterModel, state: LetterState) => {
		letter.state = state;
		this.setState({
			game: this.state.game
		});
	}	

	onSelectGuess = (guess: string) => {
		const game = this.state.game;
		if (game) {
			GameLogic.addGuess(game, guess);
			this.setState({
				game: game
			});
		}
	}

	render() {
		if (this.state.game) {
			const options = (
				<div className='options-container'>
					<OptionsBar
						newGame={this.onNewGame}
						newSolver={this.onNewSolver}
						toggleCandidates={this.toggleCandidates}
					/>
				</div>
			);
			const game = (
				<div className='game-container'>
					<Game
						game={this.state.game}
						letterStateSelected={this.onLetterStateSelected}
					/>
				</div>
			);
			const candidates = (
				<div className='candidates-container'>
					<Candidates
						candidates={GameLogic.getCandidates(this.state.answers, this.state.game)}
						select={this.onSelectGuess}
					/>
				</div>
			);

			return (
				<div className='main'>
					{ options }
					{ game }
					{ this.state.showCandidates ? candidates : null }
				</div>
			);
		} else {
			return (
				<div className='loading'>
					Loading...
				</div>
			);
		}
	};
}
