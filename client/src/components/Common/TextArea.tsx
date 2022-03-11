import React, { useCallback, useRef } from 'react';
import { MdClose } from 'react-icons/md';
import styled from 'styled-components';

type Props = {
	onChange: (e: string) => void;
	value: string;
} & Omit<React.InputHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value'>;

const ClearButton = styled.button`
	position: absolute;
	background-color: transparent;
	color: var(--main);
	right: 0.5rem;
	top: 0.5rem;
	display: none;
	fill: var(--negative);
	cursor: pointer;
	border-radius: 50%;

	&:hover {
		transform: scale(1.3);
	}
`;

const TextAreaContainer = styled.div`
	position: relative;
	width: 100%;
	height: 100%;

	&:hover ${ClearButton}, &:focus-within ${ClearButton} {
		display: flex;
	}
`;

const StyledTextArea = styled.textarea`
	box-shadow: 0px 1px 2px -1px black;
	padding: calc(10px - 0.3rem / 2) 15px;
	border-radius: 10px;
	height: 100%;
	color: var(--main);
	width: 100%;
	font-size: 1.1rem;
	resize: none;
`;

const TextArea: React.FC<Props> = ({ onChange, value, ...props }) => {
	const TextAreaRef = useRef<HTMLTextAreaElement>(null);

	const clear = useCallback(() => {
		onChange('');
		TextAreaRef.current?.focus();
	}, [TextAreaRef]);

	const changeHandler = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			onChange(e.target.value);
		},
		[]
	);

	return (
		<TextAreaContainer onClick={(e) => e.stopPropagation()}>
			<StyledTextArea
				ref={TextAreaRef}
				type='text'
				value={value}
				onChange={changeHandler}
				{...props}
			/>
			<ClearButton tabIndex={0} onClick={clear}>
				<MdClose size={18} color='var(--negative)' />
			</ClearButton>
		</TextAreaContainer>
	);
};

export default React.memo(TextArea);
