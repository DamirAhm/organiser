import { NewItem } from './../../../../server/types';
import { Item } from './../../types';
import axios from 'axios';
import headersWithAuth from '../../utils/headersWithAuth';
import { SERVER_URL } from '../../constants';

export type createItemType = Item | null;
type createItemDataType = { payload: createItemType };

export default async function createSection({
	authToken,
	newSectionData,
}: {
	authToken: string | null;
	newSectionData: NewItem;
}): Promise<createItemType> {
	const data = await axios
		.post<createItemDataType>(
			`${SERVER_URL}/items`,
			newSectionData,
			headersWithAuth(authToken)
		)
		.then(({ data }) => data.payload);

	return data;
}
