import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

const SectionNamingItemContainer = styled.label`
	padding: 20px;
	display: grid;
	align-items: start;
	border-radius: 5px;
	font-size: 1.5rem;
	color: var(--bold-text-color);
	height: fit-content;

	border: 2px solid var(--border-color);
	padding: 15px 15px 20px 15px;
	width: 100%;

	&:hover {
		cursor: initial;
	}
	& form {
		width: 100%;
	}
	& input {
		padding: 5px 10px;
		font-size: 1.2rem;
		width: 100%;
	}
`;

type Props = {
	onSubmit: (value: string) => void;
	defaultValue?: string;
};

const SectionNamingItem: React.FC<Props> = ({
	onSubmit,
	defaultValue = '',
}) => {
	const [name, setName] = useState<string>(defaultValue);

	const handleEnterPress = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();

			onSubmit(name);
		},
		[onSubmit, name]
	);

	return (
		<SectionNamingItemContainer
			onClick={(e: React.MouseEvent) => e.stopPropagation()}
		>
			<form onSubmit={handleEnterPress}>
				<input
					type='text'
					placeholder='Введите название'
					autoFocus
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
			</form>
		</SectionNamingItemContainer>
	);
};

export default SectionNamingItem;
