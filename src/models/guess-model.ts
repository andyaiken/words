import GuessState from "./guess-state";
import LetterModel from "./letter-model";

export default interface GuessModel {
	state: GuessState;
	letters: LetterModel[];
}
