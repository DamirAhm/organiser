import { Item, ItemDocument } from '../../types';
import { model, Schema, SchemaTypes } from 'mongoose';

const ItemSchema = new Schema<ItemDocument>({
	files: {
		type: [String],
		default: [],
	},
	subItems: {
		type: [SchemaTypes.ObjectId],
		ref: 'Item',
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
		ref: 'Item',
		default: null,
	},
});

const ItemModel = model('Item', ItemSchema);
export default ItemModel;
