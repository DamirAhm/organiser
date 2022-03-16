import React, { memo, useCallback } from 'react';
import ReactModal from 'react-modal';
import { useNavigate, useParams } from 'react-router-dom';
import { NewNote } from '../../../../../types';
import NoteModalContent from './NoteModal';
import { StyledReactModal } from './NoteModalsStyles';

type Props = {
	deleteNote: (noteId: string) => void;
	changeNote: (changedNote: NewNote, noteId: string) => void;
};

const NoteModalWrapper: React.FC<Props> = ({ changeNote, deleteNote }) => {
	const navigate = useNavigate();
	const { noteId } = useParams<{ noteId: string }>();

	if (noteId?.startsWith('placeholder')) {
		navigate('..');
	}

	const closeNoteModal = useCallback(() => {
		navigate('..');
	}, [navigate]);

	return (
		<StyledReactModal
			as={ReactModal}
			onRequestClose={closeNoteModal}
			isOpen={true}
			style={{
				overlay: {
					backgroundColor: 'rgba(0,0,0,0.5)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				},
			}}
		>
			<NoteModalContent
				deleteNote={() => deleteNote(noteId!)}
				changeNote={changeNote}
				noteId={noteId!}
			/>
		</StyledReactModal>
	);
};

export default memo(NoteModalWrapper);
