import { SectionDocument } from '../../types';

export const populateItems = (section: SectionDocument) =>
	section.populate('items');
export const populateUser = (section: SectionDocument) =>
	section.populate('user');
export default (section: SectionDocument) =>
	section.populate(['user', 'items']);
