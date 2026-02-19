import { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useDebounce = (value: any, delay: number) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => clearTimeout(timeout);
	}, [value, delay]);

	return debouncedValue;
};

export default useDebounce;
