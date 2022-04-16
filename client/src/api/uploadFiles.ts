import axios from 'axios';
import { SERVER_URL } from '../constants';
import headersWithAuth from '../utils/headersWithAuth';

export type uploadFileType = File[] | null;
type uploadFileDataType = { payload: uploadFileType | null };

export type uploadFileArgs = {
	authToken: string | null;
	files: FormData;
};

export default async function uploadFiles({
	authToken,
	files,
}: uploadFileArgs): Promise<uploadFileType> {
	const data = await axios
		.post<uploadFileDataType>(
			`${SERVER_URL}/files/upload`,
			files,
			headersWithAuth(authToken)
		)
		.then(({ data }) => data.payload);

	return data;
}
