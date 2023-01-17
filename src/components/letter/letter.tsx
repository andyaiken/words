import LetterState from '../../models/letter-state';
import './letter.css';

interface Props {
	letter: string;
	state: LetterState;
}

const Letter = (props: Props) => {
	const className = `letter ${props.state}`;
	return (
		<div className={className}>
			{ props.letter }
		</div>
	);
}

export default Letter;
