import { SectionPreview } from '../../types';
import { SERVER_URL } from '../../constants';
import axios from 'axios';
import headersWithAuth from '../../utils/headersWithAuth';

export type createSectionType = SectionPreview | null;
type createSectionDataType = { payload: createSectionType };

export default async function createSection({
	authToken,
	name,
}: {
	authToken: string | null;
	name: string;
}): Promise<createSectionType> {
	const data = await axios
		.post<createSectionDataType>(
			`${SERVER_URL}/sections`,
			{ name },
			headersWithAuth(authToken)
		)
		.then(({ data }) => data.payload);

	return data;
}
