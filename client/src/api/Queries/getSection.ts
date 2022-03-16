import { SERVER_URL } from '../../constants';
import axios from 'axios';
import headersWithAuth from '../../utils/headersWithAuth';
import { Section } from '../../types';

export const GET_SECTION = 'getSection';

export type getSectionType = Section | null;
type getSectionDataType = { payload: Section | null };

export default async function getSectionQuery(
	authToken: string | null,
	sectionId: string
): Promise<getSectionType> {
	const data = await axios
		.get<getSectionDataType>(
			`${SERVER_URL}/sections/${sectionId}`,
			headersWithAuth(authToken)
		)
		.then(({ data }) => data.payload);

	return data;
}
