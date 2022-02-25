import { NoteDocument } from '../../types';

export const populateSubNotes = (note: NoteDocument) =>
	note.populate('subNotes');
export const populateSection = (note: NoteDocument) => note.populate('section');
export const populateParent = (note: NoteDocument) => note.populate('parent');
export default (note: NoteDocument) =>
	note.populate(['subNotes', 'section', 'parent']);
