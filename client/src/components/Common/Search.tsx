import React, { useCallback } from 'react';
import { MdClose } from 'react-icons/md';
import styled from 'styled-components';

type Props = {
	onChange: (e: string) => void;
	value: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>;

const SearchContainer = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
`;
const ClearButton = styled.button`
	position: absolute;
	background-color: white;
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

const Input = styled.input`
	padding: calc(10px - 0.3rem / 2) 15px;
	border-radius: 10px;
	height: 100%;
	color: var(--main);
	box-sizing: border-box;
	width: 100%;
	font-size: 1.1rem;
`;

const Searcher: React.FC<Props> = ({ onChange, value, ...props }) => {
	const inputRef = React.createRef<HTMLInputElement>();

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
		<SearchContainer onClick={(e) => e.stopPropagation()}>
			<Input
				data-testid='input'
				ref={inputRef}
				className={'input'}
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
		</SearchContainer>
	);
};

export default React.memo(Searcher);
