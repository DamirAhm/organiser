import React, { useCallback, useState } from 'react';
import { useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import getNote, { GET_NOTE } from '../../../../api/Queries/getNote';
import useAuthToken from '../../../../hooks/useAuthToken';
import { NotePreview } from '../../../../types';

export const NoteContainer = styled.div`
	width: 100%;
	border: 1px solid var(--border-color);
	border-radius: 10px;
	padding: 10px;
	height: fit-content;
	text-align: center;
	font-size: 1.3rem;
	color: var(--text-color);
	cursor: pointer;

	transition: 200ms;

	&:hover,
	&:focus {
		transform: scale(1.02);
	}
`;

type Props = {} & NotePreview;

const NoteElement: React.FC<Props> = ({ title, pinned, id }) => {
	const { authToken } = useAuthToken();
	const QueryClient = useQueryClient();

	const [prefetched, setPrefetched] = useState(false);

	const prefetchNote = useCallback(() => {
		if (!prefetched) {
			QueryClient.prefetchQuery({
				queryFn: () => getNote(authToken, id),
				queryKey: [GET_NOTE, id],
			});
			setPrefetched(true);
		}
	}, [id, authToken, getNote, QueryClient, prefetched]);

	return (
		<NoteContainer
			as={Link}
			to={id}
			onMouseEnter={prefetchNote}
			tabIndex={0}
		>
			{title}
		</NoteContainer>
	);
};

export default NoteElement;
