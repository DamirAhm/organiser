import { useNavigate, useMatch } from 'react-router-dom';

export type noteId = string | null;

type useOpenedNoteType = {
	openedNoteId: string | null;
	setOpenedNoteId: (newNoteId: string | null) => void;
	closeOpenedNote: () => void;
};

export const useOpenedNote = (): useOpenedNoteType => {
	const navigate = useNavigate();

	const match = useMatch('/:sectionId/:noteId/*');

	const openedNoteId = match?.params.noteId || null;
	const openedSectionId = match?.params.sectionId || null;

	return {
		openedNoteId,
		setOpenedNoteId: (newNoteId: string | null) =>
			navigate(`../${newNoteId || ''}`),
		closeOpenedNote: () =>
			openedSectionId && navigate(`/${openedSectionId}`),
	};
};
