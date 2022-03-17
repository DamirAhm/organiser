import styled, { StyledComponent } from 'styled-components';

const DefaultHighlight = styled.span`
	color: var(--negative);
`;

const highlightOverlap = (
	text: string,
	search: string,
	HighlightingElement: StyledComponent<
		'span',
		any,
		{},
		never
	> = DefaultHighlight
): (string | JSX.Element)[] => {
	const index = text.toLowerCase().search(search.toLowerCase());

	if (index !== -1) {
		const textStart = text.slice(0, index);
		const overlap = text.slice(index, index + search.length);
		const textEnd = text.slice(index + search.length);

		return [
			textStart,
			<HighlightingElement>{overlap}</HighlightingElement>,
			textEnd,
		];
	}

	return [text];
};

export default highlightOverlap;
