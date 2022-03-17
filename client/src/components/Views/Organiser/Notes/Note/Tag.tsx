import React from 'react';
import styled from 'styled-components';
import { MdClose } from 'react-icons/md';

export const TagContainer = styled.div`
	display: flex;
	justify-content: space-between;
	padding: 5px 10px;
	border: 1px solid var(--border-color);
	border-radius: 10px;
	width: fit-content;
	align-items: center;
	line-height: 1rem;
	font-size: 1rem;
	text-transform: uppercase;
`;
const RemoveButton = styled.button`
	display: flex;
	align-items: center;
	margin-left: 10px;
	outline: none;
	background-color: transparent;
	margin-right: -5px;

	&:hover svg,
	&:focus svg {
		fill: var(--negative);
	}
`;

type Props = {
	name: string;
	onRemove?: (name: string) => void;
};

const Tag: React.FC<Props> = ({ name, onRemove }) => {
	return (
		<TagContainer>
			{name}
			{onRemove && (
				<RemoveButton type='button' onClick={() => onRemove(name)}>
					<MdClose color={'var(--bold-text-color)'} size={20} />
				</RemoveButton>
			)}
		</TagContainer>
	);
};

export default Tag;
