import React from 'react';
import { useParams } from 'react-router-dom';
import NoteModal from './NoteModal';

const NoteModalWrapper: React.FC = () => {
	const { noteId } = useParams<{ noteId: string }>();

	return <NoteModal noteId={noteId!} />;
};

export default NoteModalWrapper;
