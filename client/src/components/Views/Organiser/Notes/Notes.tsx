import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { GoPlus } from 'react-icons/go';
import getNotesList, {
	getNotesType,
	GET_NOTES,
} from '../../../../api/Queries/getNotesList';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useOpenedSection } from '../../../../hooks/useOpenedSection';
import useAuthToken from '../../../../hooks/useAuthToken';
import createNote, {
	createNoteArgs,
	createNoteType,
} from '../../../../api/Mutations/createNote';
import NoteEditingModal from './Note/NoteEditingModal';
import { NewNote } from '../../../../types';
import NoteElement, { NoteContainer } from './NoteElement';
import { Route, Routes } from 'react-router-dom';
import NoteModalWrapper from './Note/NoteModalWrapper';

const NotesContainer = styled.div`
	background-color: #eef;
	width: 100%;
	height: 100%;
	display: grid;
	grid-template: 40px 1fr / 1fr;
	grid-gap: 20px;
	justify-content: center;
	padding: 20px;
	font-size: 1.2rem;
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

	transition: 200ms;

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
	width: 100%;
	display: flex;
	align-items: center;
	flex-direction: column;

	& > ${NoteContainer} + ${NoteContainer} {
		margin-top: 20px;
	}
`;

type Props = {};

const Notes: React.FC<Props> = ({}) => {
	const { authToken } = useAuthToken();
	const { openedSectionId } = useOpenedSection();

	const [isCreating, setIsCreating] = useState(false);

	const queryClient = useQueryClient();
	const { data } = useQuery(GET_NOTES, () =>
		getNotesList(authToken, openedSectionId!)
	);

	const { mutateAsync: createNoteAsync } = useMutation<
		createNoteType,
		unknown,
		createNoteArgs
	>(createNote, {
		onMutate: ({ newNoteData }) => {
			queryClient.cancelQueries(GET_NOTES);

			const notesBackup =
				queryClient.getQueryData<getNotesType>(GET_NOTES);

			queryClient.setQueryData<getNotesType>(GET_NOTES, (oldNotes) => {
				return [
					...(oldNotes || []),
					{
						title: newNoteData.title,
						id: `placeholder-${Date.now()}`,
						pinned: false,
					},
				];
			});

			return () => queryClient.setQueryData(GET_NOTES, notesBackup);
		},
		onSuccess: (newNoteData) => {
			if (newNoteData !== null) {
				const { title, id: noteId, pinned } = newNoteData;
				queryClient.cancelQueries(GET_NOTES);

				queryClient.setQueryData<getNotesType>(
					GET_NOTES,
					(oldNotes) => {
						if (oldNotes) {
							return oldNotes.map((note) =>
								note.id === newNoteData?.id
									? { title, id: noteId, pinned }
									: note
							);
						}
						return [];
					}
				);
			}
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
					{data.map((note) => (
						<NoteElement key={note.title} {...note}></NoteElement>
					))}
				</NotesWrapper>
			)}
			{/* //TODO открывать подробности заметки в роуте */}
			{/* <Route path=':noteId' element={NoteModal} /> */}
			{isCreating && (
				<NoteEditingModal onFilled={create} onRejected={stopCreating} />
			)}

			<Routes>
				<Route path=':noteId' element={<NoteModalWrapper />} />
			</Routes>
		</NotesContainer>
	);
};

export default Notes;
