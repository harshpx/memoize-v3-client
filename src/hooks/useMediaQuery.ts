import { useEffect, useState } from "react";

const useMediaQuery = (query: string) => {
	const [active, setActive] = useState<boolean>(false);

	useEffect(() => {
		const mediaQueryList = window.matchMedia(query);
		const listener = (event: MediaQueryListEvent) => {
			setActive(event.matches);
		};
		setActive(mediaQueryList.matches);
		mediaQueryList.addEventListener("change", listener);
		return () => {
			mediaQueryList.removeEventListener("change", listener);
		};
	}, [query]);
	return active;
};

export default useMediaQuery;
