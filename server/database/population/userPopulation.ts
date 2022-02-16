import { UserDocument } from '../../types';

export const populateSections = (user: UserDocument) =>
	user.populate('sections');
export default (user: UserDocument) => user.populate('sections');
