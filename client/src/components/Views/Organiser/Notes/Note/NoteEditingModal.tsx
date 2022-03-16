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
import { ColloredButton } from '../../../../CommonStyled';

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

//TODO сохранять прошлый стейт в LocalStorage
const NoteEditingModalContent: React.FC<Props> = ({
	onFilled,
	onRejected,
	initialState,
	confirmButtonName = 'Изменить',
}) => {
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

	return (
		<>
			<HeaderTitle>Заполните поля для создания заметки</HeaderTitle>
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
					{confirmButtonName}
				</ControlButton>
			</CreationControls>
		</>
	);
};

export default NoteEditingModalContent;
