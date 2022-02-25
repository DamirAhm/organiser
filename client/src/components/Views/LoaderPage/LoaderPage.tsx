import React from 'react';
import styled from 'styled-components';
import Loader from '../../Common/Loader';

const Wrapper = styled.div<{ imbedded: boolean }>`
	${({ imbedded }) =>
		imbedded
			? `width: 100%;`
			: `width: min(100vw, var(--container-width));`}
	height: 100vh;
	display: flex;
	grid-column: 2;
	justify-content: center;
	align-items: center;
	background-color: var(--background-color);
`;

type Props = {
	imbedded?: boolean;
};

const LoaderPage: React.FC<Props> = ({ imbedded = false }) => {
	return (
		<Wrapper imbedded={imbedded}>
			<Loader size={100} />
		</Wrapper>
	);
};

export default LoaderPage;
