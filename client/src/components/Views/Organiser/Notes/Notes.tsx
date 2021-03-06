import React, { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import { GoPlus } from 'react-icons/go';

import { useOpenedSection } from '../../../../hooks/useOpenedSection';
import useAuthToken from '../../../../hooks/useAuthToken';

import NoteEditingModalWrapper from './Note/NoteEditingModalWrapper';
import { NewNote } from '../../../../types';
import NoteElement, { NoteContainer, NoteLink } from './NoteElement';
import NoteModalWrapper from './Note/NoteModalWrapper';

import getNotesListQuery, {
	getNotesType,
	GET_NOTES_LIST,
} from '../../../../api/Queries/getNotesList';

import deleteNoteMutation, {
	deleteNoteArgs,
	deleteNoteType,
} from '../../../../api/Mutations/deleteNote';
import createNoteMutation, {
	createNoteArgs,
	createNoteType,
} from '../../../../api/Mutations/createNote';
import { LoaderPage } from '../../LoaderPage';
import { useOpenedNote } from '../../../../hooks/useOpenedNote';
import changeNoteMutation, {
	changeNoteArgs,
	changeNoteType,
} from '../../../../api/Mutations/changeNote';
import { getNoteType, GET_NOTE } from '../../../../api/Queries/getNote';
import { NotePreview } from '../../../../../../server/types';

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
		margin-top: 10px;
	}
`;

type Props = {
	search: string;
	sort: (a: NotePreview, b: NotePreview) => number;
	usedTags: string[];
	toggleTag: (tag: string) => void;
};

const Notes: React.FC<Props> = ({ usedTags, search, toggleTag, sort }) => {
	const { closeOpenedNote, openedNoteId } = useOpenedNote();
	const { authToken } = useAuthToken();
	const { openedSectionId } = useOpenedSection();

	const [isCreating, setIsCreating] = useState(false);

	const queryClient = useQueryClient();
	const { data: notesData } = useQuery(
		[GET_NOTES_LIST, openedSectionId],
		() => getNotesListQuery(authToken, openedSectionId!)
	);

	const { mutateAsync: createNoteAsync } = useMutation<
		createNoteType,
		unknown,
		createNoteArgs
	>(createNoteMutation, {
		onMutate: ({ newNoteData }) => {
			queryClient.cancelQueries([GET_NOTES_LIST, openedSectionId]);

			const notesBackup = queryClient.getQueryData<getNotesType>([
				GET_NOTES_LIST,
				openedSectionId,
			]);

			queryClient.setQueryData<getNotesType>(
				[GET_NOTES_LIST, openedSectionId],
				(oldNotes) => {
					return [
						...(oldNotes ?? []),
						{
							tags: newNoteData.tags,
							title: newNoteData.title,
							id: `placeholder-${Date.now()}`,
							pinned: false,
						},
					];
				}
			);

			return () =>
				queryClient.setQueryData(
					[GET_NOTES_LIST, openedSectionId],
					notesBackup
				);
		},
		onSuccess: (newNoteData) => {
			if (newNoteData !== null) {
				const { title, id: noteId, pinned, tags } = newNoteData;
				queryClient.cancelQueries([GET_NOTES_LIST, openedSectionId]);

				queryClient.setQueryData<getNotesType>(
					[GET_NOTES_LIST, openedSectionId],
					(oldNotes) => {
						if (oldNotes) {
							return oldNotes.map((note) =>
								note.title === title
									? { title, id: noteId, pinned, tags }
									: note
							);
						}
						return [];
					}
				);

				queryClient.setQueryData<getNoteType>(
					[GET_NOTE, noteId],
					newNoteData
				);
			}
		},
	});

	const { mutateAsync: changeNoteAsync } = useMutation<
		changeNoteType,
		unknown,
		changeNoteArgs
	>(changeNoteMutation, {
		onMutate: ({ noteId, noteUpdate }) => {
			queryClient.cancelQueries([GET_NOTES_LIST, openedSectionId]);
			queryClient.cancelQueries([GET_NOTE, noteId]);

			const notesListBackup = queryClient.getQueryData([
				GET_NOTES_LIST,
				openedSectionId,
			]);
			const noteBackup = queryClient.getQueryData([GET_NOTE, noteId]);

			queryClient.setQueryData<getNotesType>(
				[GET_NOTES_LIST, openedSectionId],
				(oldNotesList) => {
					return oldNotesList
						? oldNotesList.map((note) =>
								note.id === noteId
									? {
											...note,
											title:
												noteUpdate.title ?? note.title,
											tags: noteUpdate.tags ?? note.tags,
									  }
									: note
						  )
						: [];
				}
			);
			queryClient.setQueryData<getNoteType>(
				[GET_NOTE, noteId],
				(oldNote) => (oldNote ? { ...oldNote, ...noteUpdate } : null)
			);

			return () => {
				queryClient.setQueryData(
					[GET_NOTES_LIST, openedSectionId],
					notesListBackup
				);
				queryClient.setQueryData([GET_NOTE, noteId], noteBackup);
			};
		},
	});

	const { mutateAsync: deleteNoteAsync } = useMutation<
		deleteNoteType,
		unknown,
		deleteNoteArgs
	>(deleteNoteMutation, {
		onMutate: ({ noteId }) => {
			queryClient.cancelQueries([GET_NOTES_LIST, openedSectionId]);
			const queriesListBackup = queryClient.getQueryData<getNotesType>([
				GET_NOTES_LIST,
				openedSectionId,
			]);
			queryClient.setQueryData<getNotesType>(
				[GET_NOTES_LIST, openedSectionId],
				(oldQueryList) =>
					oldQueryList?.filter(({ id }) => id !== noteId) ?? []
			);
			return () =>
				queryClient.setQueryData(
					[GET_NOTES_LIST, openedSectionId],
					() => queriesListBackup
				);
		},
	});

	const stopCreating = useCallback(
		() => setIsCreating(false),
		[setIsCreating]
	);

	const createNote = useCallback(
		(newNote: NewNote) => {
			if (newNote.title.trim() === '') {
				alert('?????????????????? ???? ???????????? ???????? ????????????');
				return;
			} else if (
				notesData?.some(({ title }) => title === newNote.title)
			) {
				alert('?????????????????? ???????????? ???????? ????????????????????');
				return;
			}

			stopCreating();
			createNoteAsync({
				authToken: authToken!,
				newNoteData: newNote,
				section: openedSectionId!,
			});
		},
		[createNoteAsync, authToken, stopCreating, openedSectionId]
	);

	const changeNote = useCallback(
		(noteUpdate: NewNote, noteId: string) => {
			changeNoteAsync({ authToken: authToken!, noteUpdate, noteId });
		},
		[changeNoteAsync, authToken]
	);

	const deleteNote = useCallback(
		(noteId: string) => {
			if (openedNoteId !== null) {
				closeOpenedNote();
			}
			deleteNoteAsync({
				authToken,
				noteId,
			});
		},
		[deleteNoteAsync, authToken, openedNoteId, closeOpenedNote]
	);

	const filteredNotes = useMemo(
		() =>
			notesData
				?.filter((note) =>
					usedTags.every((usedTag) =>
						note.tags.some(
							(tag) => tag.toLowerCase() === usedTag.toLowerCase()
						)
					)
				)
				?.filter((note) =>
					note.title.toLowerCase().includes(search.toLowerCase())
				) ?? [],
		[search, usedTags, notesData]
	);
	const sortedNotes = useMemo(
		() => filteredNotes.sort(sort),
		[sort, filteredNotes]
	);

	return (
		<NotesContainer>
			{!isCreating && (
				<AddButton onClick={() => setIsCreating(true)}>
					?????????????? <GoPlus color='var(--border-color)' size={20} />
				</AddButton>
			)}
			{notesData ? (
				<NotesWrapper>
					{sortedNotes.map((note) => (
						<NoteElement
							onDeleteRequest={deleteNote}
							onTagClick={toggleTag}
							search={search}
							usedTags={usedTags}
							key={note.title}
							{...note}
						/>
					))}
				</NotesWrapper>
			) : (
				<LoaderPage imbedded />
			)}

			{isCreating && (
				<NoteEditingModalWrapper
					onFilled={createNote}
					onRejected={stopCreating}
					confirmButtonName={'??????????????'}
				/>
			)}

			<Routes>
				<Route
					path=':noteId'
					element={
						<NoteModalWrapper
							deleteNote={deleteNote}
							changeNote={changeNote}
						/>
					}
				/>
			</Routes>
		</NotesContainer>
	);
};

export default Notes;
