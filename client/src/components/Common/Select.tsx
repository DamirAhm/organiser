import React, { SetStateAction, useCallback } from 'react';
import styled from 'styled-components';
import { optionType } from '../../types';

const SortBy = styled.select`
	grid-column: 3;
	padding: 6px 10px;
	box-shadow: 0px 1px 2px -1px black;
`;
const SortByOption = styled.option``;

type Props = {
	options: optionType[];
	value?: string;
	onChange: React.Dispatch<SetStateAction<string | undefined>>;
} & Omit<React.HTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'>;

function Select({ options, onChange, value, ...props }: Props) {
	const onSortChange: React.ChangeEventHandler<HTMLOptionElement> =
		useCallback((event) => {
			onChange(event.target.value);
		}, []);

	return (
		<SortBy {...props}>
			<SortByOption onChange={onSortChange} value={undefined}>
				{'Без сортировки'}
			</SortByOption>
			{options.map((option, i) => (
				<SortByOption
					key={option.label}
					onChange={onSortChange}
					value={option.value}
				>
					{option.label}
				</SortByOption>
			))}
		</SortBy>
	);
}

export default Select;
