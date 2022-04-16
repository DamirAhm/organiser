import React, { useCallback, useReducer } from 'react';
import ReactModal from 'react-modal';
import { NewNote, File } from '../../../../../types';
import Input from '../../../../Common/Input';
import {
	StyledReactModal,
	HeaderTitle,
	PoleName,
	Section,
} from './NoteModalsStyles';
import NoteEditingReducer, {
	ActionType,
	ActionTypes,
} from './NoteEditingReducer';
import Textarea from '../../../../Common/TextArea';
import TagsSection from './TagsSection';
import styled from 'styled-components';
import { ColloredButton } from '../../../../CommonStyled';
import useNotesTags from '../../../../../hooks/useNotesTags';
import FileUploader from '../../../../Common/FileUploader';
import uploadFiles from '../../../../../api/uploadFiles';
import useAuthToken from '../../../../../hooks/useAuthToken';
import { SERVER_URL } from '../../../../../constants';
import Files from '../../../../Common/Files';

const InputContainer = styled.div`
	width: min(80%, 240px);
`;

const TextAreaContainer = styled.div`
	width: min(80%, 360px);
	height: 120px;
`;

const CreationControls = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-around;
`;

const ControlButton = styled(ColloredButton)`
	padding: 10px;
	font-size: 1.2rem;
	border: 1px solid ${({ color }) => color};
	border-radius: 10px;
	color: var(--text-color);
`;

type Props = {
	onFilled: (newNote: NewNote) => void;
	onRejected: () => void;
	initialState?: NewNote;
	confirmButtonName?: string;
};

const NoteEditingModalContent: React.FC<Props> = ({
	onFilled,
	onRejected,
	initialState,
	confirmButtonName = 'Изменить',
}) => {
	const { authToken } = useAuthToken();

	const [newNote, dispatch] = useReducer<React.Reducer<NewNote, ActionType>>(
		NoteEditingReducer,
		{
			title: initialState?.title ?? '',
			description: initialState?.description ?? '',
			tags: initialState?.tags ?? [],
			files: initialState?.files ?? [],
		}
	);

	const confirm = useCallback(() => {
		if (newNote.title.trim() == '') {
			alert('Заполните поле заголовок');
			return;
		}

		onFilled(newNote);
	}, [newNote, onFilled]);

	const onFilesAdded = useCallback(async (files: FileList | null) => {
		if (files !== null) {
			const formData = new FormData();

			for (let file of files) formData.append('files', file);

			const fileUris = await uploadFiles({
				authToken,
				files: formData,
			});

			if (fileUris !== null) {
				dispatch({ type: ActionTypes.ADD_FILES, payload: fileUris });
			}
		}
	}, []);

	const onFileRemoved = useCallback((removedFile: File) => {
		dispatch({
			type: ActionTypes.REMOVE_FILE,
			payload: removedFile.fileName,
		});
	}, []);

	return (
		<>
			<HeaderTitle>Заполните поля для создания заметки</HeaderTitle>
			<Section>
				<PoleName>Заголовок</PoleName>
				<InputContainer>
					<Input
						autoFocus
						value={newNote.title}
						placeholder='Введите заголовок'
						onChange={(newTitle) =>
							dispatch({
								type: ActionTypes.CHANGE_TITLE,
								payload: newTitle,
							})
						}
					/>
				</InputContainer>
			</Section>
			<Section>
				<PoleName>Описание</PoleName>
				<TextAreaContainer>
					<Textarea
						placeholder='Уточните вашу заметку'
						value={newNote.description}
						onChange={(newDescription) =>
							dispatch({
								type: ActionTypes.CHANGE_DESCRIPTION,
								payload: newDescription,
							})
						}
					/>
				</TextAreaContainer>
			</Section>
			<Section>
				<PoleName>Теги</PoleName>
				{/* //TODO Refactor dispatches (map them to functions with useCallback) */}
				<TagsSection
					tags={newNote.tags}
					onCreated={(newTag) =>
						dispatch({ type: ActionTypes.ADD_TAG, payload: newTag })
					}
					onRemoved={(tagToRemove) =>
						dispatch({
							type: ActionTypes.REMOVE_TAG,
							payload: tagToRemove,
						})
					}
				/>
			</Section>
			<Section>
				<PoleName>Файлы</PoleName>
				<Files files={newNote.files} onFileRemoved={onFileRemoved} />
				<FileUploader onChange={onFilesAdded} />
			</Section>

			<CreationControls>
				<ControlButton
					color='var(--negative)'
					onClick={() => onRejected()}
				>
					Отмена
				</ControlButton>
				<ControlButton color='var(--positive)' onClick={confirm}>
					{confirmButtonName}
				</ControlButton>
			</CreationControls>
		</>
	);
};

export default NoteEditingModalContent;
