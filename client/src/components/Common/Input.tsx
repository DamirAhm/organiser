import React, { useCallback } from 'react';
import { MdClose } from 'react-icons/md';
import styled from 'styled-components';

type Props = {
	onChange: (e: string) => void;
	value: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>;

const InputContainer = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
`;
const ClearButton = styled.button`
	position: absolute;
	background-color: transparent;
	color: var(--main);
	right: 0.5rem;
	top: calc(50% - 18px / 2);
	display: flex;
	fill: var(--negative);
	cursor: pointer;

	&:hover {
		transform: scale(1.3);
	}
`;

const StyledInput = styled.input`
	padding: calc(10px - 0.3rem / 2) 15px;
	border-radius: 10px;
	height: 100%;
	color: var(--main);
	box-sizing: border-box;
	width: 100%;
	font-size: 1.1rem;
`;

const Input: React.FC<Props> = ({ onChange, value, ...props }) => {
	const clear = useCallback(() => {
		onChange('');
	}, []);
	const changeHandler = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			onChange(e.target.value);
		},
		[]
	);

	return (
		<InputContainer onClick={(e) => e.stopPropagation()}>
			<StyledInput
				type='text'
				value={value}
				onChange={changeHandler}
				{...props}
			/>
			<ClearButton as={MdClose} onClick={clear} size={18} />
		</InputContainer>
	);
};

export default React.memo(Input);
