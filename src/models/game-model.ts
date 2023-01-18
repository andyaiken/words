import GuessModel from "./guess-model";

export default interface GameModel {
	target: string;
	guesses: GuessModel[];
}

