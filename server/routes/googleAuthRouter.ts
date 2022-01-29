import { Router } from 'express';
import passport from 'passport';
import auth from './auth';
import { STATUS_CODES } from '../constants';
import { UserModel } from '../database/models';
import { UserDocument } from '../types';

export const googleAuthRouter = Router();

googleAuthRouter.get( '/failed', auth.optional, (_, res) => res.send( "You failed" ) );
googleAuthRouter.get( '/succeed', auth.optional, (req, res) => {
	(async () => {
		try {
			if ( req.user == null ) {
				res.status( STATUS_CODES.BAD );
				res.send( { error: "You aren't authorized" } );
			}

			const user = await UserModel.findById( (req.user as UserDocument)._id );

			if ( user != null ) {
				const JWT = user.generateJWT();
				console.log(JWT)
				res.cookie( 'auth', JWT, { httpOnly: true, expires: new Date(Date.now() + 999999999) } );
				res.send( "You succeed" );
			} else {
				res.redirect( "/google/logout" );
			}
		} catch ( e ) {
			console.log( e );
		}
	})();
} );

googleAuthRouter.get( '/', auth.optional, (req, res, next) => {
	//@ts-ignore
	if(req.payload) {
		res.redirect('/');
		return;
	}
	passport.authenticate( 'google', { scope: [ "profile", "email" ] } )(req,res,next);
} );

googleAuthRouter.get( '/callback', auth.optional, passport.authenticate( 'google', { failureRedirect: "/google/failed" } ), (req, res) => res.redirect( "/google/succeed" ) );

googleAuthRouter.get( '/logout', auth.required, (req, res) => {
	//@ts-ignore
	req.session = null;
	req.logout();

	res.redirect( '/' );
} )