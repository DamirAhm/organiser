import React, { useCallback, useState, useMemo } from 'react';
import { useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import getNoteQuery, { GET_NOTE } from '../../../../api/Queries/getNote';
import useAuthToken from '../../../../hooks/useAuthToken';
import { NotePreview } from '../../../../types';
import { TagsContainer } from './Note/NoteModalsStyles';
import Tag from './Note/Tag';
import highlightOverlap from '../../../../utils/highlightOverlap';
import { ColloredButton } from '../../../CommonStyled';
import { GoTrashcan } from 'react-icons/go';

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
	grid-template-rows: 1fr auto;
	grid-gap: 5px;

	width: 100%;

	& ${TagsContainer} {
		grid-row: 2;
		width: 100%;
	}

	& .used > * {
		background-color: var(--border-color);
		color: white;
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
	onTagClick: (tag: string) => void;
	search: string;
	usedTags: string[];
} & NotePreview;

const NoteElement: React.FC<Props> = ({
	title,
	pinned,
	id,
	tags,
	search,
	usedTags,
	onDeleteRequest,
	onTagClick,
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

	const titleWithHightlight = useMemo(
		() => highlightOverlap(title, search),
		[search, title]
	);

	return (
		<NoteContainer>
			<NoteLink
				as={Link}
				to={id}
				onMouseEnter={prefetchNote}
				tabIndex={0}
			>
				<span>{titleWithHightlight}</span>
				<CloseButton
					color='var(--negative)'
					onClick={deleteButtonHandler}
				>
					<GoTrashcan size={24} viewBox='0 0 13 16' />
				</CloseButton>
			</NoteLink>
			<TagsContainer>
				{tags.map((tag) => (
					<div
						className={
							usedTags.some((usedTag) => usedTag === tag)
								? 'used'
								: ''
						}
						key={title + tag}
					>
						<Tag onClick={onTagClick} name={tag} />
					</div>
				))}
			</TagsContainer>
		</NoteContainer>
	);
};

export default NoteElement;
