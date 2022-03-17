import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import useNotesTags from '../../../../../hooks/useNotesTags';
import Input from '../../../../Common/Input';
import { ColloredButton } from '../../../../CommonStyled';
import { TagsContainer } from './NoteModalsStyles';
import Tag from './Tag';

const Container = styled.div``;
const NewTagControls = styled.form`
	display: grid;
	width: min(80%, 310px);
	grid-template-columns: 1fr 80px;
	grid-gap: 20px;
	margin-bottom: 20px;
`;
const SubmitButton = styled(ColloredButton)`
	border: 1px solid var(--positive);
	border-radius: 10px;
	padding: 10px;
	color: var(--text-color);
`;

type Props = {
	onCreated: (newTag: string) => void;
	onRemoved: (removedTag: string) => void;
	tags: string[];
};

const TagsSection: React.FC<Props> = ({ onCreated, onRemoved, tags }) => {
	const { tags: usedTags } = useNotesTags();
	const [newTag, setNewTag] = useState('');

	const inputRef = useRef<HTMLInputElement>(null);

	const create = useCallback(() => {
		if (tags.every((tag) => tag !== newTag)) {
			onCreated(newTag);
		} else {
			alert('Такой тег уже существует');
		}
	}, [newTag, onCreated]);

	const removeTag = useCallback(
		(name: string) => {
			onRemoved(name);
		},
		[onRemoved]
	);

	const onTagClick = useCallback(
		(tag: string) => {
			removeTag(tag);
			setNewTag(tag);
			inputRef.current?.focus();
		},
		[removeTag, setNewTag]
	);

	return (
		<Container>
			<NewTagControls
				onSubmit={(e) => {
					e.preventDefault();
					create();
					setNewTag('');
				}}
			>
				<Input
					placeholder='Новый тег'
					value={newTag}
					onChange={setNewTag}
					list='editingTagsSuggestions'
					ref={inputRef}
				/>
				<datalist id='editingTagsSuggestions'>
					{usedTags.map((usedTag) => (
						<option key={usedTag} value={usedTag}>
							#{usedTag}
						</option>
					))}
				</datalist>
				<SubmitButton color='var(--positive)' type='submit'>
					Добавить
				</SubmitButton>
			</NewTagControls>
			<TagsContainer>
				{tags.map((tag) => (
					<Tag
						key={tag}
						name={tag}
						onClick={onTagClick}
						onRemove={removeTag}
					/>
				))}
			</TagsContainer>
		</Container>
	);
};

export default TagsSection;
