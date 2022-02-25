import { SERVER_URL } from '../../constants';
import axios from 'axios';
import headersWithAuth from '../../utils/headersWithAuth';
import { Item } from '../../types';

export const GET_ITEMS = 'getItems';

export type getItemsType = Item[];
type getItemsDataType = { payload: getItemsType };

export default async function getItems(
	authToken: string | null,
	sectionId: string
): Promise<getItemsType> {
	const data = await axios
		.get<getItemsDataType>(
			`${SERVER_URL}/items?sectionId=${sectionId}`,
			headersWithAuth(authToken)
		)
		.then(({ data }) => data.payload);

	return data;
}
