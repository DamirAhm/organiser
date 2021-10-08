import { User } from "../../types";
import { model, Schema, SchemaTypes } from 'mongoose';

const UserSchema = new Schema<User>( {
	name: {
		type: String,
		required: true,
	},
	photo_url: {
		type: String,
		default: null,
	},
	sections: {
		type: [ SchemaTypes.ObjectId ],
		ref: "Section",
		default: [],
	},
} );

const UserModel = model( 'User', UserSchema );
export default UserModel;