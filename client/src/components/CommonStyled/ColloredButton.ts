import styled from 'styled-components';

export const ColloredButton = styled.button<{ color: string }>`
	transition: 200ms;

	& > * {
		fill: ${({ color }) => color};
	}

	&:hover,
	&:focus {
		background-color: ${({ color }) => color};

		svg {
			fill: white;
		}
	}
`;
