import { NewNote } from '../../types';
import { Note } from '../../types';
import axios from 'axios';
import headersWithAuth from '../../utils/headersWithAuth';
import { SERVER_URL } from '../../constants';

export type createNoteType = Note | null;
type createNoteDataType = { payload: createNoteType };

export type createNoteArgs = {
	authToken: string;
	newNoteData: NewNote;
	parent?: string;
	section?: string;
};

export default async function createSection({
	authToken,
	newNoteData,
	parent,
	section,
}: createNoteArgs): Promise<createNoteType> {
	if (!(parent || section)) {
		throw new Error(
			'You must pass one of parent or section to create note'
		);
	}

	const data = await axios
		.post<createNoteDataType>(
			`${SERVER_URL}/notes`,
			{ ...newNoteData, parent, section },
			headersWithAuth(authToken)
		)
		.then(({ data }) => data.payload);

	return data;
}
