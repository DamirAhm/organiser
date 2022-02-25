import React, { useEffect } from 'react';
import { SERVER_URL } from '../../../constants';
import styled from 'styled-components';
import { useAuthToken } from '../../../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

const AuthContainer = styled.div`
	width: min(100%, 1400px);
	min-height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	background-color: var(--background-color);
`;

const Title = styled.h1`
	text-align: center;
`;

const AuthLink = styled.a`
	font-size: 1.4rem;
	color: var(--bold-text-color);
	text-decoration: none;

	&:hover {
		text-decoration: underline;
	}
`;

const Auth: React.FC = () => {
	const { authorized } = useAuthToken();
	const navigate = useNavigate();

	useEffect(() => {
		if (authorized) navigate('../');
	}, [authorized]);

	return (
		<AuthContainer>
			<Title>
				Привет, для начала работы <br /> Авторизируйтесь
				{/* с помощью
				одного из вариантов */}
			</Title>
			<AuthLink target='_self' rel='opener' href={`${SERVER_URL}/google`}>
				<FcGoogle size={60} />
			</AuthLink>
		</AuthContainer>
	);
};

export default Auth;
