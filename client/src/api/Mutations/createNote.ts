import { NewNote } from '../../../../server/types';
import { Note } from '../../types';
import axios from 'axios';
import headersWithAuth from '../../utils/headersWithAuth';
import { SERVER_URL } from '../../constants';

export type createNoteType = Note | null;
type createNoteDataType = { payload: createNoteType };

export default async function createSection({
	authToken,
	newSectionData,
}: {
	authToken: string | null;
	newSectionData: NewNote;
}): Promise<createNoteType> {
	const data = await axios
		.post<createNoteDataType>(
			`${SERVER_URL}/notes`,
			newSectionData,
			headersWithAuth(authToken)
		)
		.then(({ data }) => data.payload);

	return data;
}
