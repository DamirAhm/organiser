import { useCallback, useEffect } from 'react';

const useEscape = (cb: () => void) => {
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
		document.addEventListener('keydown', onKeyPressed);

		return () => {
			document.removeEventListener('keydown', onKeyPressed);
		};
	}, []);
};

export default useEscape;
