import { useContext } from 'react';
import AuthContext from '../Contexts/AuthContext';

const useAuthToken = () => {
	const { authToken, setAuthToken } = useContext(AuthContext);

	return {
		authToken,
		setAuthToken,
		authorized: authToken !== null,
	};
};

export default useAuthToken;
