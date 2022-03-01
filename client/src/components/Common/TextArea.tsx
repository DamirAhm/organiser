import React, { useCallback } from 'react';
import { MdClose } from 'react-icons/md';
import styled from 'styled-components';

type Props = {
	onChange: (e: string) => void;
	value: string;
} & Omit<React.InputHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value'>;

const TextAreaContainer = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
`;
const ClearButton = styled.button`
	position: absolute;
	background-color: transparent;
	color: var(--main);
	right: 0.5rem;
	top: 0.5rem;
	display: flex;
	fill: var(--negative);
	cursor: pointer;

	&:hover {
		transform: scale(1.3);
	}
`;

const StyledTextArea = styled.textarea`
	padding: calc(10px - 0.3rem / 2) 15px;
	border-radius: 10px;
	height: 100%;
	color: var(--main);
	width: 100%;
	font-size: 1.1rem;
	resize: none;
`;

const TextArea: React.FC<Props> = ({ onChange, value, ...props }) => {
	const clear = useCallback(() => {
		onChange('');
	}, []);
	const changeHandler = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			onChange(e.target.value);
		},
		[]
	);

	return (
		<TextAreaContainer onClick={(e) => e.stopPropagation()}>
			<StyledTextArea
				type='text'
				value={value}
				onChange={changeHandler}
				{...props}
			/>
			<ClearButton
				as={MdClose}
				onClick={clear}
				className={`clear`}
				size={18}
			/>
		</TextAreaContainer>
	);
};

export default React.memo(TextArea);
