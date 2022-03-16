import { Deleted, SectionPreview } from '../../types';
import { SERVER_URL } from '../../constants';
import axios from 'axios';
import headersWithAuth from '../../utils/headersWithAuth';

export type deleteSectionType = SectionPreview | null;
type deleteSectionDataType = { payload: deleteSectionType };

export type deleteSectionArgs = {
	authToken: string | null;
	sectionId: string;
};

export default async function deleteSectionMutation({
	authToken,
	sectionId,
}: deleteSectionArgs): Promise<deleteSectionType> {
	const data = await axios
		.delete<deleteSectionDataType>(
			`${SERVER_URL}/sections/${sectionId}`,
			headersWithAuth(authToken)
		)
		.then(({ data }) => data.payload);

	return data;
}
