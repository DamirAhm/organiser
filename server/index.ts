import mongoose from 'mongoose'
import config from './database/config/config'
import cors from 'cors';
import express from 'express';
import expressSession from 'express-session';
import cookieParser from 'cookie-parser';
import { apiRouter } from './routes/apiRouter';
import { itemsRouter } from './routes/itemsRouter';
import { sectionsRouter } from './routes/sectionsRouter';
import { usersRouter } from './routes/usersRouter';
import passport from 'passport';

import './passport';
import { googleAuthRouter } from './routes/googleAuthRouter';
import auth from './routes/auth';

export const app = express();

(async () => {
	try {
		await mongoose.connect( config.MONGODB_URI )
		console.log( 'DataBase connected' );

		app.use( cors() );
		app.use(express.json())
		app.use(expressSession({secret: process.env.SECRET as string, resave: false, saveUninitialized: false}))
		app.use(cookieParser());
		app.use(passport.initialize());
		app.use(passport.session());

		app.get("/", auth.required, (req,res) => res.send("Hello"));
		//TODO remove
		// app.use("/api", apiRouter);
		app.use("/items", itemsRouter);
		app.use("/sections", sectionsRouter);
		app.use("/users", usersRouter);
		app.use("/google", googleAuthRouter);

		const PORT = process.env.PORT ?? 8080;
		app.listen( PORT, () => console.log( `Server is listening at ${ PORT }` ));
	} catch ( e ) {
		if ( e instanceof Error ) console.log( "Unexpected error occurred", e );
		throw e;
	}
})();
