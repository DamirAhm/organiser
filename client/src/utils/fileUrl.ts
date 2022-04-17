import { SERVER_URL } from '../constants';
import { File } from '../types';

export const fileUrl = ({ fileName }: File) =>
	`${SERVER_URL}/uploads/${fileName}`;
