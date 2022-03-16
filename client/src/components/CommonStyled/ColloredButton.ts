import styled from 'styled-components';

export const ColloredButton = styled.button<{ color: string }>`
	transition: 200ms;

	& > * {
		fill: ${({ color }) => color};
		background-color: transparent;
	}

	&:hover,
	&:focus {
		background-color: ${({ color }) => color};
		color: white;
		svg {
			fill: white;
		}
	}
`;
