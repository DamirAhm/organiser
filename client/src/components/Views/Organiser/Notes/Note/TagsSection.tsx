import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
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
	const [newTag, setNewTag] = useState('');

	const create = useCallback(() => {
		if (tags.every((tag) => tag !== newTag)) {
			onCreated(newTag);
		} else {
			alert('Такой тег уже существует');
		}
	}, [newTag, onCreated]);

	const remove = useCallback(
		(name: string) => {
			onRemoved(name);
		},
		[onRemoved]
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
				/>
				<SubmitButton color='var(--positive)' type='submit'>
					Добавить
				</SubmitButton>
			</NewTagControls>
			<TagsContainer>
				{tags.map((tag) => (
					<Tag key={tag} name={tag} onRemove={remove} />
				))}
			</TagsContainer>
		</Container>
	);
};

export default TagsSection;
