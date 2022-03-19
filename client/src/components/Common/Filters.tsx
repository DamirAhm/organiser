import React, {
	HTMLAttributes,
	SetStateAction,
	useEffect,
	useState,
} from 'react';
import styled from 'styled-components';
import useNotesTags from '../../hooks/useNotesTags';
import { TagsContainer } from '../Views/Organiser/Notes/Note/NoteModalsStyles';
import Tag from '../Views/Organiser/Notes/Note/Tag';

import Input from './Input';
import Select from './Select';

const FiltersContainer = styled.form`
	display: grid;
	grid-template-columns: 1fr 200px;
	grid-template-rows: 1fr fit-content;
	grid-gap: 10px;

	align-items: center;
	box-sizing: border-box;
	width: 100%;

	& input,
	& select {
		border-radius: 10px;
		height: 100%;
		width: 100%;
	}

	& ${TagsContainer} {
		width: 100%;
	}
`;

const Filter = styled.div`
	color: var(--main);
	display: flex;
	max-width: 250px;
	min-width: 100px;
`;

const SearchContainer = styled(Filter)``;

const SelectContainer = styled(Filter)`
	flex-direction: row-reverse;
	& * {
		color: var(--main);
		font-size: 1.2rem;
	}
`;

interface Props extends HTMLAttributes<HTMLFormElement> {
	defaultSort?: string;
	sortsList: string[];
	onSortChange: React.Dispatch<SetStateAction<string>>;
	onSearchChange: React.Dispatch<SetStateAction<string>>;
	onTagsChange: React.Dispatch<SetStateAction<string[]>>;
	usedTags: string[];
	inputProps?: HTMLAttributes<HTMLDivElement>;
	sortProps?: HTMLAttributes<HTMLDivElement>;
}

const Filters: React.FC<Props> = ({
	sortsList,
	onSearchChange,
	onSortChange,
	onTagsChange,
	defaultSort,
	usedTags,
	inputProps,
	sortProps,
	...props
}) => {
	const [text, setText] = useState('');

	const { tags } = useNotesTags();

	const optionsList = sortsList.map((sort) => ({ value: sort, label: sort }));

	const addTag = () => {
		debugger;
		if (text.startsWith('#')) {
			const tag = text.slice(1);

			if (usedTags.every((usedTag) => usedTag !== tag) && tag != '') {
				onTagsChange([...usedTags, tag]);
			}
			setText('');
		}
	};
	const removeTag = (tagToRemove: string) => {
		onTagsChange(usedTags.filter((tag) => tag !== tagToRemove));
	};

	useEffect(() => {
		if (!text.startsWith('#')) {
			onSearchChange(text);
		}
	}, [text]);

	return (
		<FiltersContainer
			{...props}
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				addTag();
			}}
		>
			<SearchContainer {...inputProps}>
				<Input
					onChange={(text: string) => {
						setText(text);
					}}
					placeholder={'Поиск'}
					value={text}
					list='tagsSuggestions'
				/>
				{text.startsWith('#') && (
					<datalist id='tagsSuggestions'>
						{tags.map((tag) => (
							<option key={tag} value={'#' + tag}>
								{tag}
							</option>
						))}
					</datalist>
				)}
			</SearchContainer>
			<SelectContainer {...sortProps}>
				<Select
					options={optionsList}
					value={defaultSort}
					onChange={onSortChange}
					placeholder={'Выбрать'}
				/>
			</SelectContainer>
			<TagsContainer>
				{usedTags.map((tag) => (
					<Tag onRemove={() => removeTag(tag)} key={tag} name={tag} />
				))}
			</TagsContainer>
		</FiltersContainer>
	);
};

export default Filters;
