import { NoteDocument } from '../../types';
import { model, Schema, SchemaTypes } from 'mongoose';

const FileSchema = new Schema<any>(
	{
		fileName: {
			type: String,
			required: true,
			unique: true,
		},
		mimeType: {
			type: String,
			required: true,
		},
		originalName: {
			type: String,
			required: true,
		},
	},
	{ _id: false }
);

const NoteSchema = new Schema<NoteDocument>({
	files: {
		type: [FileSchema],
		default: [],
	},
	subNotes: {
		type: [SchemaTypes.ObjectId],
		ref: 'Note',
		default: [],
	},
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		default: '',
	},
	tags: {
		type: [String],
		default: [],
	},
	pinned: {
		type: Boolean,
		default: false,
	},
	section: {
		type: SchemaTypes.ObjectId,
		ref: 'Section',
		default: null,
	},
	parent: {
		type: SchemaTypes.ObjectId,
		ref: 'Note',
		default: null,
	},
	user: {
		type: SchemaTypes.ObjectId,
		required: true,
		ref: 'User',
	},
});

const NoteModel = model('Note', NoteSchema);
export default NoteModel;
