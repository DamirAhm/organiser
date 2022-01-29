import { ItemDocument } from '../../types';

export const populateSubItems = (item: ItemDocument) => item.populate('subItems');
export const populateSection = (item: ItemDocument) => item.populate('section');
export const populateParent = (item: ItemDocument) => item.populate('parent');
export default (item: ItemDocument) => item.populate(['subItems', 'section', 'parent']);
