import React, { useCallback, useRef } from 'react';
import { MdClose } from 'react-icons/md';
import styled from 'styled-components';

type Props = {
	onChange: (e: string) => void;
	value: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>;

const ClearButton = styled.button`
	position: absolute;
	background-color: transparent;
	color: var(--main);
	right: 0.5rem;
	top: calc(50% - 18px / 2);
	display: none;
	fill: var(--negative);
	cursor: pointer;
	border-radius: 50%;

	&:hover {
		transform: scale(1.3);
	}
`;

const InputContainer = styled.div`
	position: relative;
	width: 100%;
	height: 100%;

	&:hover ${ClearButton}, &:focus-within ${ClearButton} {
		display: flex;
	}
`;

const StyledInput = styled.input`
	box-shadow: 0px 1px 2px -1px black;
	padding: calc(10px - 0.3rem / 2) 15px;
	border-radius: 10px;
	height: 100%;
	color: var(--main);
	box-sizing: border-box;
	width: 100%;
	font-size: 1.1rem;
`;

const Input: React.FC<Props> = ({ onChange, value, ...props }) => {
	const InputRef = useRef<HTMLInputElement>(null);

	const clear = useCallback(() => {
		onChange('');
		InputRef.current?.focus();
	}, [InputRef]);

	const changeHandler = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			onChange(e.target.value);
		},
		[]
	);

	return (
		<InputContainer onClick={(e) => e.stopPropagation()}>
			<StyledInput
				ref={InputRef}
				type='text'
				value={value}
				onChange={changeHandler}
				{...props}
			/>
			<ClearButton tabIndex={0} onClick={clear}>
				<MdClose color='var(--negative)' size={18} />
			</ClearButton>
		</InputContainer>
	);
};

export default React.memo(Input);
