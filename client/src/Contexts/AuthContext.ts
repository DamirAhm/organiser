import React, { SetStateAction } from 'react';
import { useContext } from 'react';

export type authToken = string | null;

const AuthContext = React.createContext<{
	authToken: authToken;
	setAuthToken: (action: SetStateAction<authToken>) => void;
}>({
	authToken: null,
	setAuthToken: (action: SetStateAction<authToken>) => {},
});

export default AuthContext;
export const AuthContextProvider = AuthContext.Provider;
export const useAuthToken = () => {
	const { authToken, setAuthToken } = useContext(AuthContext);

	return {
		authToken,
		setAuthToken,
		authorized: authToken !== null,
	};
};
