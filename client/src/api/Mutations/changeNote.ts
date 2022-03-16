import { NewNote } from '../../types';
import { Note } from '../../types';
import axios from 'axios';
import headersWithAuth from '../../utils/headersWithAuth';
import { SERVER_URL } from '../../constants';

export type changeNoteType = Note | null;
type changeNoteDataType = { payload: changeNoteType };

export type changeNoteArgs = {
	authToken: string;
	noteUpdate: Partial<Note>;
	noteId: string;
};

export default async function changeNoteMutation({
	authToken,
	noteUpdate,
	noteId,
}: changeNoteArgs): Promise<changeNoteType> {
	if (!noteId) {
		throw new Error('You must pass noteId to change note');
	}

	const data = await axios
		.put<changeNoteDataType>(
			`${SERVER_URL}/notes/${noteId}`,
			{ update: noteUpdate },
			headersWithAuth(authToken)
		)
		.then(({ data }) => data.payload);

	return data;
}
