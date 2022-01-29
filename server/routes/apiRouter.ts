import passport from 'passport';
import { Router } from 'express';
import auth from '../routes/auth';
import { UserModel } from '../database/models';
import { STATUS_CODES } from '../constants';

export const apiRouter = Router();
//TODO надо сделать хранение токена авторизации как тут, но для авторизации через гугол.
//POST new user route (optional, everyone has access)
apiRouter.post( '/', auth.optional, (req, res) => {
	(async () => {
		try {
			const { body: { user } } = req;

			if ( !user.name ) {
				return res.status( STATUS_CODES.BAD ).json( {
					error: "Name is required",
				} );
			}

			if ( !user.email ) {
				return res.status( STATUS_CODES.BAD ).json( {
					error: "Email is required",
				} );
			}

			if ( !user.password ) {
				return res.status( STATUS_CODES.BAD ).json( {
					error: "Password is required",
				} );
			}

			const finalUser = new UserModel( user );

			finalUser.setPassword( user.password );

			await finalUser.save();
			res.json( { user: finalUser.toAuthJSON() } );
		} catch ( e ) {
			if ( e instanceof Error ) {
				res.status( STATUS_CODES.BAD ).json( { error: e.message } );
				throw e;
			} else {
				console.log( e );
			}
		}
	})();
} );

//POST login route (optional, everyone has access)
apiRouter.post( '/login', auth.optional, (req, res, next) => {
	const { body: { user } } = req;

	if ( !user.email ) {
		return res.status( STATUS_CODES.BAD ).json( {
			error: "Email is required",
		} );
	}

	if ( !user.password ) {
		return res.status( STATUS_CODES.BAD ).json( {
			error: "Password is required",
		} );
	}

	return passport.authenticate( 'local', { session: false }, (err, passportUser, info) => {
		if ( err ) {
			return next( err );
		}

		if ( passportUser ) {
			const user = passportUser;
			user.token = passportUser.generateJWT();

			return res.json( { user: user.toAuthJSON() } );
		}

		//? WTF
		//@ts-ignore
		return res.status( STATUS_CODES.BAD ).info;
	} )( req, res, next );
} );

//GET current route (required, only authenticated users have access)
apiRouter.get( '/current', auth.required, (req, res, next) => {
	(async () => {
		try {
			//@ts-ignore
			const { id } = req.payload as { id: string };

			const user = await UserModel.findById( id )
			if ( !user ) {
				return res.sendStatus( STATUS_CODES.BAD );
			}

			return res.json( { user: user.toAuthJSON() } );
		} catch ( e ) {
			if ( e instanceof Error ) {
				res.status( STATUS_CODES.BAD ).json( { error: e.message } );
				throw e;
			} else {
				console.log( e );
			}
		}
	})();
} );