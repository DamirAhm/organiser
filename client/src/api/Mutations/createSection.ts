import { SectionPreview } from '../../types';
import { SERVER_URL } from '../../constants';
import axios from 'axios';
import headersWithAuth from '../../utils/headersWithAuth';

export type createSectionType = SectionPreview | null;
type createSectionDataType = { payload: createSectionType };

export type createSectionArgs = {
	authToken: string | null;
	name: string;
};

export default async function createSection({
	authToken,
	name,
}: createSectionArgs): Promise<createSectionType> {
	const data = await axios
		.post<createSectionDataType>(
			`${SERVER_URL}/sections`,
			{ name },
			headersWithAuth(authToken)
		)
		.then(({ data }) => data.payload);

	return data;
}
