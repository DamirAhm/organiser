import React from 'react';
import styled from 'styled-components';

const Spinner = styled.div<{ size: number | string }>`
	position: relative;
	width: ${({ size }) => (typeof size === 'number' ? `${size}px` : size)};
	height: ${({ size }) => (typeof size === 'number' ? `${size}px` : size)};
`;

const Bar = styled.div<{
	animationDelay: string;
	transform: string;
	color: string;
}>`
	-webkit-animation: react-spinner_spin 1.2s linear infinite;
	-moz-animation: react-spinner_spin 1.2s linear infinite;
	animation: react-spinner_spin 1.2s linear infinite;
	border-radius: 5px;
	background-color: ${(props) => props.color};
	position: absolute;
	width: 20%;
	height: 10%;
	top: 44%;
	left: 40%;
	-webkit-animation-delay: ${(props) => props.animationDelay};
	animation-delay: ${(props) => props.animationDelay};
	-webkit-transform: ${(props) => props.transform};
	transform: ${(props) => props.transform};
`;

const Loader: React.FC<{ size?: number | string; color?: string }> = React.memo(
	({ size = 30, color = 'var(--border-color, blue)' }) => {
		let bars = Array.from({ length: 12 }, (_, i) => (
			<Bar
				color={color}
				animationDelay={(i - 12) / 10 + 's'}
				transform={`rotate(${i * 30}deg) translate(150%)`}
				key={i}
			/>
		));

		return <Spinner size={size}>{bars}</Spinner>;
	}
);

export default Loader;
