import axios from 'axios';
import { SERVER_URL } from '../../constants';
import headersWithAuth from '../../utils/headersWithAuth';

export const GET_AUTHORIZED = 'getAutorized';

export type getAuthorizedDataType = { payload: boolean };

export default async function getAuthorized(
	authToken: string | null
): Promise<boolean> {
	const data = await axios
		.get<getAuthorizedDataType>(
			`${SERVER_URL}/user/authorized`,
			headersWithAuth(authToken)
		)
		.then(({ data }) => data.payload);

	return data;
}
