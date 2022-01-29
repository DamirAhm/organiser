import { User, UserDocument } from "../../types";
import { model, Schema, SchemaTypes } from 'mongoose';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const emailRegEx = /.+@.+/;

const UserSchema = new Schema<UserDocument>( {
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		validate: {
			validator: (email: string) => emailRegEx.test(email),
			message: "Invalid email"
		}
	},
	googleId: String,
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

UserSchema.methods.setPassword = function (password: string) {
	this.salt = crypto.randomBytes( 16 ).toString( 'hex' );
	this.hash = crypto.pbkdf2Sync( password, this.salt, 10000, 512, 'sha512' ).toString( 'hex' );
};

UserSchema.methods.validatePassword = function (password: string) {
	if (this.salt) {
		const hash = crypto.pbkdf2Sync( password, this.salt, 10000, 512, 'sha512' ).toString( 'hex' );
		return this.hash === hash;
	} else {
		throw new Error("You are trying to validate password without having salt");
	}
};

UserSchema.methods.generateJWT = function () {
	const today = new Date();
	const expirationDate = new Date( today );
	expirationDate.setDate( today.getDate() + 60 );

	return jwt.sign( {
		email: this.email,
		id: this._id,
		exp: expirationDate.getTime(),
	}, process.env.SECRET as string );
}

UserSchema.methods.toAuthJSON = function () {
	return {
		_id: this._id,
		email: this.email,
		name: this.name,
		token: this.generateJWT(),
	};
};

const UserModel = model( 'User', UserSchema );
export default UserModel;