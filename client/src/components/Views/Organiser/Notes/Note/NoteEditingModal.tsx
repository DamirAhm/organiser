import React, { useCallback, useReducer } from 'react';
import ReactModal from 'react-modal';
import { NewNote } from '../../../../../types';
import Input from '../../../../Common/Input';
import { StyledReactModal, HeaderTitle, PoleName } from './NoteModalsStyles';
import NoteEditingReducer, {
	ActionType,
	ActionTypes,
} from './NoteEditingReducer';
import Textarea from '../../../../Common/TextArea';
import TagsSection from './TagsSection';
import styled from 'styled-components';

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
	onFilled: (newNote: NewNote) => void;
	onRejected: () => void;
};

//TODO сохранять прошлый стейт в LocalStorage
const NoteEditingModal: React.FC<Props> = ({ onFilled, onRejected }) => {
	const [newNote, dispatch] = useReducer<React.Reducer<NewNote, ActionType>>(
		NoteEditingReducer,
		{
			title: '',
			description: '',
			tags: [],
			files: [],
		}
	);

	const confirm = useCallback(() => {
		if (newNote.title.trim() == '') {
			alert('Заполните поле заголовок');
			return;
		}

		onFilled(newNote);
	}, [newNote, onFilled]);

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
			<HeaderTitle>Заполните поля для создания заметки</HeaderTitle>
			<PoleName>Заголовок</PoleName>
			<InputContainer>
				<Input
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
			<PoleName>Теги</PoleName>
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
			<PoleName>Файлы</PoleName>
			<span>В разработке....</span>

			<CreationControls>
				<ControlButton
					color='var(--negative)'
					onClick={() => onRejected()}
				>
					Отмена
				</ControlButton>
				<ControlButton color='var(--positive)' onClick={confirm}>
					Создать
				</ControlButton>
			</CreationControls>
		</StyledReactModal>
	);
};

export default NoteEditingModal;
