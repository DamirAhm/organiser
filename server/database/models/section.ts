import { Section, SectionDocument } from '../../types';
import { model, Schema, SchemaTypes } from 'mongoose';

const SectionSchema = new Schema<SectionDocument>({
	name: {
		type: String,
		required: true,
		unique: true,
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
	notes: {
		type: [SchemaTypes.ObjectId],
		ref: 'Note',
		default: [],
	},
});

const SectionModel = model('Section', SectionSchema);
export default SectionModel;
