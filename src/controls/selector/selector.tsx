import './selector.css';

interface Props {
	options: { id: string; text: string; }[];
	selectedID: string | null;
	selectionChanged: (id: string) => void;
}

const Selector = (props: Props) => {
	const selectionChanged = (e: MouseEvent, id: string) => {
		e.preventDefault();
		e.stopPropagation();

		props.selectionChanged(id);
	}

	const options = props.options.map(option => {
		const className = (props.selectedID === option.id) ? 'selector-option selected' : 'selector-option';
		return (
			<div key={option.id} className={className} onClick={e => selectionChanged(e.nativeEvent, option.id)}>
				{ option.text }
			</div>
		);
	})

	return (
		<div className='selector'>
			{ options }
		</div>
	);
}

export default Selector;
