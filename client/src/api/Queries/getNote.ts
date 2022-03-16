import { SERVER_URL } from '../../constants';
import axios from 'axios';
import headersWithAuth from '../../utils/headersWithAuth';
import { Note } from '../../types';

export const GET_NOTE = 'getNote';

export type getNoteType = Note | null;
type getNoteDataType = { payload: Note | null };

export default async function getNoteQuery(
	authToken: string | null,
	noteId: string
): Promise<getNoteType> {
	const data = await axios
		.get<getNoteDataType>(
			`${SERVER_URL}/notes/${noteId}`,
			headersWithAuth(authToken)
		)
		.then(({ data }) => data.payload);

	return data;
}
