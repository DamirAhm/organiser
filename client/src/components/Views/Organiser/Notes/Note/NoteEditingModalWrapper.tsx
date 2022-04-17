import React, { useCallback } from 'react';
import ReactModal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { NewNote } from '../../../../../types';
import NoteEditingModalContent from './NoteEditingModal';
import { StyledReactModal } from '../../../../CommonStyled/StyledReactModal';

type Props = {
	onFilled: (newNote: NewNote) => void;
	onRejected: () => void;
	confirmButtonName?: string;
};

const NoteModalWrapper: React.FC<Props> = ({
	onFilled,
	onRejected,
	confirmButtonName,
}) => {
	const navigate = useNavigate();

	const closeNoteModal = useCallback(() => {
		onRejected();
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
			<NoteEditingModalContent
				onFilled={onFilled}
				onRejected={onRejected}
				confirmButtonName={confirmButtonName}
			/>
		</StyledReactModal>
	);
};

export default NoteModalWrapper;
