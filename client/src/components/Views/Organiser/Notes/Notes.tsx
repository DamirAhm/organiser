import React from 'react';
import styled from 'styled-components';
import { GoPlus } from 'react-icons/go';
import getNotes, { GET_NOTES } from '../../../../api/Queries/getNotes';
import { useQuery } from 'react-query';
import { useOpenedSection } from '../../../../hooks/useOpenedSection';
import useAuthToken from '../../../../hooks/useAuthToken';

const NotesContainer = styled.div`
	background-color: #eef;
	width: 100%;
	height: 100%;
	display: grid;
	grid-template-rows: 40px 1fr;
	justify-content: flex-start;
	padding: 20px;
`;

const AddButton = styled.button`
	display: flex;
	justify-content: space-between;
	align-notes: center;
	padding: 10px 12px;
	border-radius: 13px;
	font-size: 1.1rem;
	width: 160px;
	color: var(--bold-text-color);
	border: 2px solid var(--border-color);

	&:hover,
	&:focus {
		border-color: transparent;
		background-color: var(--border-color);
		color: white;

		svg {
			fill: white;
		}
	}
`;

const NotesWrapper = styled.div`
	height: 100%;
`;

const NoteElement = styled.div``;

type Props = {};

const Notes: React.FC<Props> = ({}) => {
	const { authToken } = useAuthToken();
	const { openedSectionId } = useOpenedSection();
	const { data } = useQuery(GET_NOTES, () =>
		getNotes(authToken, openedSectionId!)
	);

	return (
		<NotesContainer>
			<AddButton>
				Создать <GoPlus color='var(--border-color)' size={20} />
			</AddButton>

			{data && (
				<NotesWrapper>
					{data.map(({ title }) => (
						<NoteElement>{title}</NoteElement>
					))}
				</NotesWrapper>
			)}
		</NotesContainer>
	);
};

export default Notes;
