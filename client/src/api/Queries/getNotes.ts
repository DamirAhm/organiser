import { SERVER_URL } from '../../constants';
import axios from 'axios';
import headersWithAuth from '../../utils/headersWithAuth';
import { Note } from '../../types';

export const GET_NOTES = 'getNotes';

export type getNotesType = Note[];
type getNotesDataType = { payload: getNotesType };

export default async function getNotes(
	authToken: string | null,
	sectionId: string
): Promise<getNotesType> {
	const data = await axios
		.get<getNotesDataType>(
			`${SERVER_URL}/notes?sectionId=${sectionId}`,
			headersWithAuth(authToken)
		)
		.then(({ data }) => data.payload);

	return data;
}
