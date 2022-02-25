import React, { HTMLAttributes, SetStateAction, useState } from 'react';
import styled from 'styled-components';

import Searcher from './Search';
import Select from './Select';

const FiltersContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-sizing: border-box;
	width: 100%;

	& input,
	& select {
		border-radius: 10px;
		/* padding: 5px 10px; */
		height: 100%;
		width: 100%;
	}
`;

const Filter = styled.div`
	color: var(--main);
	width: 40%;
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

interface Props extends HTMLAttributes<HTMLDivElement> {
	sortsList: string[];
	onSortChange: React.Dispatch<SetStateAction<string | undefined>>;
	searchText: string;
	onSearchChange: React.Dispatch<SetStateAction<string>>;
	defaultSort?: string;
	inputProps?: HTMLAttributes<HTMLDivElement>;
	sortProps?: HTMLAttributes<HTMLDivElement>;
}

const Filters: React.FC<Props> = ({
	sortsList,
	onSearchChange,
	onSortChange,
	defaultSort,
	inputProps,
	sortProps,
	...props
}) => {
	const [text, setText] = useState('');

	const optionsList = sortsList.map((sort) => ({ value: sort, label: sort }));

	return (
		<FiltersContainer {...props}>
			<SearchContainer {...inputProps}>
				<Searcher
					onChange={(text: string) => {
						setText(text);
						onSearchChange(text);
					}}
					placeholder={'Поиск'}
					value={text}
				/>
			</SearchContainer>
			<SelectContainer {...sortProps}>
				<Select
					options={optionsList}
					value={defaultSort}
					onChange={onSortChange}
					placeholder={'Выбрать'}
				/>
			</SelectContainer>
		</FiltersContainer>
	);
};

export default Filters;
