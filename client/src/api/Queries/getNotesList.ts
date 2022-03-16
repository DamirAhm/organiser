import { NotePreview } from './../../../../server/types';
import { SERVER_URL } from '../../constants';
import axios from 'axios';
import headersWithAuth from '../../utils/headersWithAuth';

export const GET_NOTES_LIST = 'getNotes';

export type getNotesType = NotePreview[];
type getNotesDataType = { payload: getNotesType };

export default async function getNotesListQuery(
	authToken: string | null,
	sectionId: string
): Promise<getNotesType> {
	const data = await axios
		.get<getNotesDataType>(
			`${SERVER_URL}/notes/list?sectionId=${sectionId}`,
			headersWithAuth(authToken)
		)
		.then(({ data }) => data.payload);

	return data;
}
