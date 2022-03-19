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
	onChange: React.Dispatch<SetStateAction<string>>;
} & Omit<React.HTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'>;

function Select({ options, onChange, value, ...props }: Props) {
	const onSortChange: React.ChangeEventHandler<HTMLSelectElement> =
		useCallback(
			(event) => {
				onChange(event.target.value);
			},
			[onChange]
		);

	return (
		<SortBy {...props} onChange={onSortChange}>
			{options.map((option, i) => (
				<SortByOption key={option.label} value={option.value}>
					{option.label}
				</SortByOption>
			))}
		</SortBy>
	);
}

export default Select;
