import { SectionPreview } from '../../types';
import { SERVER_URL } from '../../constants';
import axios from 'axios';
import headersWithAuth from '../../utils/headersWithAuth';

export type renameSectionType = SectionPreview | null;
type renameSectionDataType = { payload: SectionPreview | null };

export default async function renameSection({
	authToken,
	sectionId,
	name,
}: {
	authToken: string | null;
	sectionId: string;
	name: string;
}): Promise<renameSectionType> {
	const data = await axios
		.put<renameSectionDataType>(
			`${SERVER_URL}/sections/${sectionId}`,
			{ name },
			headersWithAuth(authToken)
		)
		.then(({ data }) => data.payload);

	return data;
}
