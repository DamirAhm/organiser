import { Section } from '../../types';
import { model, Schema, SchemaTypes } from 'mongoose';

const SectionSchema = new Schema<Section>( {
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
		ref: "User",
		required: true,
	},
	items: {},
} );

const SectionModel = model( 'Section', SectionSchema );
export default SectionModel;