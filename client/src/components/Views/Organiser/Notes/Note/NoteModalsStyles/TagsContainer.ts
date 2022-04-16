import { TagContainer } from './../Tag';
import styled from 'styled-components';

export const TagsContainer = styled.ul`
	width: min(80%, 500px);
	display: flex;
	flex-wrap: wrap;
	list-style: none;

	& ${TagContainer} {
		margin-right: 10px;
	}
`;
