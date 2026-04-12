import { useEffect, type RefObject } from "react";

export const useOutsideClick = (
	refs: RefObject<HTMLElement | null>[],
	callback: () => void,
) => {
	useEffect(() => {
		const handleClick = (e: TouchEvent | MouseEvent) => {
			let clickedOutside = true;
			for (const ref of refs) {
				if (ref.current && ref.current.contains(e.target as Node)) {
					clickedOutside = false;
					break;
				}
			}
			if (clickedOutside) {
				callback();
			}
		};

		document.addEventListener("mousedown", handleClick);
		document.addEventListener("touchstart", handleClick);

		return () => {
			document.removeEventListener("mousedown", handleClick);
			document.removeEventListener("touchstart", handleClick);
		};
	}, [refs, callback]);
};
