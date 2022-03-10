import React from 'react';
import ReactModal from 'react-modal';
import { Note } from '../../../../../types';
import Input from '../../../../Common/Input';
import { StyledReactModal, HeaderTitle, PoleName } from './NoteModalsStyles';
import Textarea from '../../../../Common/TextArea';
import TagsSection from './TagsSection';
import styled from 'styled-components';
import Tag from './Tag';
import { useQuery } from 'react-query';
import getNote, {
	getNoteType,
	GET_NOTE,
} from '../../../../../api/Queries/getNote';
import useAuthToken from '../../../../../hooks/useAuthToken';
import { LoaderPage } from '../../../LoaderPage';
import useEscape from '../../../../../hooks/useEscape';
import { useNavigate } from 'react-router-dom';

const InputContainer = styled.div`
	width: min(80%, 240px);
`;

const TextAreaContainer = styled.div`
	width: min(80%, 360px);
	height: 120px;
`;

const CreationControls = styled.div`
	margin-top: auto;
	width: 100%;
	display: flex;
	justify-content: space-around;
`;

const ControlButton = styled.button<{ color: string }>`
	padding: 10px;
	font-size: 1.2rem;
	border: 1px solid ${({ color }) => color};
	border-radius: 10px;
	color: var(--text-color);

	&:hover,
	&:focus {
		background-color: ${({ color }) => color};
		color: white;
	}
`;

type Props = {
	noteId: string;
};

const NoteModal: React.FC<Props> = ({ noteId }) => {
	const navigate = useNavigate();

	const { authToken } = useAuthToken();
	const { data, isLoading } = useQuery<getNoteType>([GET_NOTE, noteId], () =>
		getNote(authToken, noteId)
	);

	useEscape(() => {
		navigate('../');
	});

	return (
		<StyledReactModal
			as={ReactModal}
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
			{isLoading ? (
				<LoaderPage imbedded />
			) : (
				<>
					{data && (
						<>
							<HeaderTitle>{data.title}</HeaderTitle>
							<PoleName>Описание</PoleName>
							<span>{data.description}</span>
							<PoleName>Теги</PoleName>
							{data.tags.map((tag) => (
								<Tag name={tag} onRemove={() => {}} /> //TODO remove onRemove
							))}
							<PoleName>Файлы</PoleName>
							<span>В разработке....</span>
						</>
					)}
				</>
			)}
		</StyledReactModal>
	);
};

export default NoteModal;
