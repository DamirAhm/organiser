import { User } from '../../types';
import axios from 'axios';
import { SERVER_URL } from '../../constants';
import headersWithAuth from '../../utils/headersWithAuth';

export type getUserType = User;
type getUserDataType = { payload: User };

export default async function getUser(
	authToken: string | null
): Promise<getUserType> {
	const data = await axios
		.get<getUserDataType>(`${SERVER_URL}/user`, headersWithAuth(authToken))
		.then(({ data }) => data.payload);

	return data;
}

export const GET_USER = 'getUser';
