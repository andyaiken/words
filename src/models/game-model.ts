import GuessModel from "./guess-model";

export default interface GameModel {
	target: string | null;
	guesses: GuessModel[];
}
