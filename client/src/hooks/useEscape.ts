import { useCallback, useEffect } from 'react';

const useEscape = (
	cb: () => void,
	captureElement: HTMLElement = document.body
) => {
	//On key press checks whether pressed Escape or not
	const onKeyPressed = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				cb();
			}
		},
		[cb]
	);
	//Add event listener to Escape press
	useEffect(() => {
		captureElement.addEventListener('keydown', onKeyPressed);

		return () => {
			captureElement.removeEventListener('keydown', onKeyPressed);
		};
	}, [onKeyPressed]);
};

export default useEscape;
