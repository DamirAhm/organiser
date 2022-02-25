import { SectionDocument } from '../../types';

export const populateNotes = (section: SectionDocument) =>
	section.populate('notes');
export const populateUser = (section: SectionDocument) =>
	section.populate('user');
export default (section: SectionDocument) =>
	section.populate(['user', 'notes']);
