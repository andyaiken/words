import LetterModel from '../../models/letter-model';
import './letter.css';

interface Props {
	letter: LetterModel;
}

const Letter = (props: Props) => {
	const className = `letter ${props.letter.state}`;
	return (
		<div className={className}>
			{ props.letter.text }
		</div>
	);
}

export default Letter;
