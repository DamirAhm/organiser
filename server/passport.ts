import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { UserModel } from './database/models';

import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { GOOGLE_AUTH_LINK } from './constants';

passport.use(
	new LocalStrategy(
		{
			usernameField: 'user[email]',
			passwordField: 'user[password]',
		},
		async (
			email: string,
			password: string,
			done: (...rest: any[]) => void
		) => {
			try {
				const user = await UserModel.findOne({ email });

				if (!user || !user.validatePassword(password)) {
					return done(null, false, {
						errors: { 'email or password': 'is invalid' },
					});
				}

				return done(null, user);
			} catch (err) {
				done();
			}
		}
	)
);

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			callbackURL: GOOGLE_AUTH_LINK,
			passReqToCallback: true,
		},
		(
			accessToken,
			refreshToken,
			params,
			{ displayName, photos, emails, id },
			done
		) => {
			(async () => {
				try {
					const user = await UserModel.findOne({ googleId: id });
					if (user !== null) {
						done(null, user);
					} else {
						const newUser = await UserModel.create({
							name: displayName,
							photo_url: photos?.[0].value,
							email: emails?.[0].value,
							googleId: id,
						});
						await newUser.save();
						done(null, newUser);
					}
				} catch (e) {
					if (e instanceof Error) {
						console.log(e);
						done(e);
					}
				}
			})();
		}
	)
);

passport.serializeUser((user, done) => {
	//@ts-ignore
	done(null, user.id);
});
passport.deserializeUser((id, done) => {
	(async () => {
		try {
			const user = await UserModel.findById(id);
			done(null, user);
		} catch (e) {
			console.log(e);
			done(e);
		}
	})();
});
