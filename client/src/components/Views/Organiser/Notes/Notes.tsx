import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { GoPlus } from 'react-icons/go';
import getNotes, {
	getNotesType,
	GET_NOTES,
} from '../../../../api/Queries/getNotes';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useOpenedSection } from '../../../../hooks/useOpenedSection';
import useAuthToken from '../../../../hooks/useAuthToken';
import createNote, {
	createNoteArgs,
	createNoteType,
} from '../../../../api/Mutations/createNote';
import NoteEditingModal from './Note/NoteEditingModal';
import { NewNote } from '../../../../types';

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
	align-items: center;
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

	const [isCreating, setIsCreating] = useState(false);

	const queryClient = useQueryClient();
	const { data } = useQuery(GET_NOTES, () =>
		getNotes(authToken, openedSectionId!)
	);

	const { mutateAsync: createNoteAsync } = useMutation<
		createNoteType,
		unknown,
		createNoteArgs
	>(createNote, {
		onMutate: ({ newNoteData }) => {
			queryClient.cancelQueries(GET_NOTES);

			const oldNotes = queryClient.getQueryData<getNotesType>(GET_NOTES);

			queryClient.setQueryData<getNotesType>(GET_NOTES, (oldNotes) => {
				return [
					...(oldNotes || []),
					{
						...newNoteData,
						files: [],
						id: `placeholder-${Date.now()}`,
						pinned: false,
						subNotes: [],
						user: `placeholder-${Date.now()}`,
						section: openedSectionId,
					},
				];
			});

			return () => queryClient.setQueryData(GET_NOTES, oldNotes);
		},
	});

	const stopCreating = useCallback(
		() => setIsCreating(false),
		[setIsCreating]
	);
	const create = useCallback(
		(newNote: NewNote) => {
			stopCreating();
			createNoteAsync({
				authToken: authToken!,
				newNoteData: newNote,
				section: openedSectionId!,
			});
		},
		[createNoteAsync, authToken, stopCreating]
	);

	return (
		<NotesContainer>
			{!isCreating && (
				<AddButton onClick={() => setIsCreating(true)}>
					Создать <GoPlus color='var(--border-color)' size={20} />
				</AddButton>
			)}

			{data && (
				<NotesWrapper>
					{data.map(({ title }) => (
						<NoteElement key={title}>{title}</NoteElement>
					))}
				</NotesWrapper>
			)}

			{isCreating && (
				<NoteEditingModal onFilled={create} onRejected={stopCreating} />
			)}
		</NotesContainer>
	);
};

export default Notes;
