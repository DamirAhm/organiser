import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

const SectionNamingNoteContainer = styled.label`
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
		outline: none;
		box-shadow: 0px 1px 2px -1px black;
		border-radius: 3px;
	}
`;

type Props = {
	onSubmit: (value: string) => void;
	defaultValue?: string;
};

const SectionNamingElement: React.FC<Props> = ({
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
		<SectionNamingNoteContainer
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
		</SectionNamingNoteContainer>
	);
};

export default SectionNamingElement;
