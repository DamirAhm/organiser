import { NotePreview } from '../../types';
import { SERVER_URL } from '../../constants';
import axios from 'axios';
import headersWithAuth from '../../utils/headersWithAuth';

export type deleteNoteType = NotePreview | null;
type deleteNoteDataType = { payload: deleteNoteType };

export type deleteNoteArgs = {
	authToken: string | null;
	noteId: string;
};

export default async function deleteNoteMutation({
	authToken,
	noteId,
}: deleteNoteArgs): Promise<deleteNoteType> {
	const data = await axios
		.delete<deleteNoteDataType>(
			`${SERVER_URL}/notes/${noteId}`,
			headersWithAuth(authToken)
		)
		.then(({ data }) => data.payload);

	return data;
}
