import { Router } from 'express';
import passport from 'passport';
import auth from '../auth';
import { CLIENT_URL, STATUS_CODES } from '../constants';
import { UserModel } from '../database/models';
import { UserDocument } from '../types';

export const googleAuthRouter = Router();

googleAuthRouter.get('/failed', auth.optional, (_, res) =>
	res.send('You failed')
);
googleAuthRouter.get(
	'/callback',
	passport.authenticate('google', {
		failureRedirect: '/google/failed',
		scope: ['profile', 'email'],
	}),
	(req, res) => {
		(async () => {
			try {
				if (req.user == null) {
					res.status(STATUS_CODES.BAD);
					res.send({ error: "You aren't authorized" });
				}

				const user = await UserModel.findById(
					(req.user as UserDocument)._id
				);
				if (user != null) {
					const JWT = user.generateJWT();
					req.login(user, (err) => {
						if (err) {
							console.log(err);
							return;
						}

						if (process.env.NODE_ENV === 'production') {
							res.cookie('auth', JWT, {
								httpOnly: true,
								expires: new Date(Date.now() + 999999999),
							});
							res.redirect('/');
						} else {
							res.redirect(`${CLIENT_URL}?auth=${JWT}`);
						}
					});
				} else {
					res.redirect('/google/logout');
				}
			} catch (e) {
				console.log(e);
			}
		})();
	}
);

googleAuthRouter.get(
	'/',
	passport.authenticate('google', { scope: ['profile', 'email'] })
);

googleAuthRouter.get('/logout', (req, res) => {
	//@ts-ignore
	req.session = null;
	req.logout();

	res.redirect('/');
});
