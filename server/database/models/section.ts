import { Section, SectionDocument } from '../../types';
import { model, Schema, SchemaTypes } from 'mongoose';

const SectionSchema = new Schema<SectionDocument>({
	name: {
		type: String,
		required: true,
	},
	pinned: {
		type: Boolean,
		default: false,
	},
	user: {
		type: SchemaTypes.ObjectId,
		ref: 'User',
		required: true,
	},
	items: {
		type: [SchemaTypes.ObjectId],
		ref: 'Item',
		default: [],
	},
});

const SectionModel = model('Section', SectionSchema);
export default SectionModel;
