export default class Utilities {
	static distinct = (list: any[], key: (item: any) => any = item => JSON.stringify(item)): any[] => {
		const seen = new Set();
		return list.filter(item => {
			const k = key(item);
			return seen.has(k) ? false : seen.add(k);
		});
	}

	static debounce = (func: () => void, delay = 500) => {
		let timeout: NodeJS.Timeout;
		return () => {
			clearTimeout(timeout);
			timeout = setTimeout(func, delay);
		};
	}
	
	static randomNumber = (max: number) => {
		if (max <= 0) {
			return 0;
		}

		return Math.floor(Math.random() * max);
	}

	static randomBoolean = () => {
		return Utilities.randomNumber(2) === 0;
	}

	static randomDecimal = () => {
		return Utilities.randomNumber(100) / 100;
	}
}
