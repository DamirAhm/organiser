import React from 'react';
import styled from 'styled-components';

const Placeholder = styled.div`
	background-color: var(--border-color);
	border-radius: 50%;
	width: 50px;
	height: 50px;
	margin-right: 10px;
`;

const PhotoPlaceholder: React.FC = () => {
	return <Placeholder />;
};

export default PhotoPlaceholder;
