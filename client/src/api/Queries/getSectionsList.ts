import { SERVER_URL } from '../../constants';
import axios from 'axios';
import headersWithAuth from '../../utils/headersWithAuth';
import { sectionsList } from '../../types';

export const GET_SECTIONS_LIST = 'getSectionsList';

export type getSectionsListType = sectionsList;
type getSectionsListDataType = { payload: getSectionsListType };

export default async function getSectionsList(
	authToken: string | null
): Promise<getSectionsListType> {
	const data = await axios
		.get<getSectionsListDataType>(
			`${SERVER_URL}/sections/list`,
			headersWithAuth(authToken)
		)
		.then(({ data }) => data.payload);

	return data;
}
