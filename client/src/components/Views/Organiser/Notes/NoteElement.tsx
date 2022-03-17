import React, { useCallback, useState } from 'react';
import { useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import getNoteQuery, { GET_NOTE } from '../../../../api/Queries/getNote';
import useAuthToken from '../../../../hooks/useAuthToken';
import { NotePreview } from '../../../../types';
import { GoTrashcan } from 'react-icons/go';
import { ColloredButton } from '../../../CommonStyled';
import { TagsContainer } from './Note/NoteModalsStyles';
import Tag from './Note/Tag';

const CloseButton = styled(ColloredButton)`
	grid-column: 3;
	display: none;
	border-radius: 50%;
	width: 30px;
	height: 30px;
	background-color: transparent;
	padding: 3px;
`;

export const NoteContainer = styled.div`
	display: grid;
	grid-template-rows: 1fr 2rem;
	grid-gap: 5px;

	width: 100%;

	& ${TagsContainer} {
		grid-row: 2;
		width: 100%;
	}
`;

export const NoteLink = styled.div`
	width: 100%;
	height: 52px;
	border: 1px solid var(--border-color);
	border-radius: 10px;
	padding: 10px;
	text-align: center;
	font-size: 1.3rem;
	color: var(--text-color);
	cursor: pointer;
	align-items: center;
	transition: 200ms;

	display: grid;
	grid-template-columns: 50px 1fr 50px;

	&:hover,
	&:focus {
		transform: scale(1.02);
	}

	& span {
		grid-column: 2;
	}

	&:hover ${CloseButton}, &:focus ${CloseButton} {
		display: flex;
		justify-content: center;
		align-items: center;
	}
`;

type Props = {
	onDeleteRequest: (noteId: string) => void;
} & NotePreview;

const NoteElement: React.FC<Props> = ({
	title,
	pinned,
	id,
	tags,
	onDeleteRequest,
}) => {
	const { authToken } = useAuthToken();
	const QueryClient = useQueryClient();

	const [prefetched, setPrefetched] = useState(false);

	const prefetchNote = useCallback(() => {
		if (!prefetched && !id.startsWith('placeholder')) {
			QueryClient.prefetchQuery({
				queryFn: () => getNoteQuery(authToken, id),
				queryKey: [GET_NOTE, id],
			});
			setPrefetched(true);
		}
	}, [id, authToken, getNoteQuery, QueryClient, prefetched]);

	const deleteButtonHandler = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			e.preventDefault();
			onDeleteRequest(id);
		},
		[onDeleteRequest, id]
	);

	return (
		<NoteContainer>
			<NoteLink
				as={Link}
				to={id}
				onMouseEnter={prefetchNote}
				tabIndex={0}
			>
				<span>{title}</span>
				<CloseButton
					color='var(--negative)'
					onClick={deleteButtonHandler}
				>
					<GoTrashcan size={24} viewBox='0 0 13 16' />
				</CloseButton>
			</NoteLink>
			<TagsContainer>
				{tags.map((tag) => (
					<Tag key={tag} name={tag} />
				))}
			</TagsContainer>
		</NoteContainer>
	);
};

export default NoteElement;
