import React from "react";
import { SERVER_URL } from '../../constants';
import styled from "styled-components";

const Auth: React.FC = () => {
	return <div>
		<a target='_' rel={'noopener'} href={ `${ SERVER_URL }/google`}>Авторизироваться</a>
	</div>
}

export default Auth;