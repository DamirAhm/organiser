import { Item } from "../../types";
import { model, Schema, SchemaTypes } from 'mongoose';

const ItemSchema = new Schema<Item>( {
	files: {
		type: [ String ],
		default: [],
	},
	subItems: {
		type: [ SchemaTypes.ObjectId ],
		ref: "Item",
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
		type: [ String ],
		default: [],
	},
	pinned: {
		type: Boolean,
		default: false,
	},
	section: {
		type: SchemaTypes.ObjectId,
		ref: "Section",
	},
	parent: {
		type: SchemaTypes.ObjectId,
		ref: "Item",
	},
} );

const ItemModel = model( 'Item', ItemSchema );
export default ItemModel;