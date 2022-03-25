import { filesRouter } from './routes/filesRouter';
import mongoose from 'mongoose';
import config from './database/config/config';
import cors from 'cors';
import express from 'express';
import expressSession from 'express-session';
import cookieParser from 'cookie-parser';
import { notesRouter } from './routes/notesRouter';
import { sectionsRouter } from './routes/sectionsRouter';
import { userRouter } from './routes/userRouter';
import { googleAuthRouter } from './routes/googleAuthRouter';
import passport from 'passport';

import './passport';

export const app = express();

(async () => {
	try {
		await mongoose.connect(config.MONGODB_URI);
		console.log('DataBase connected');

		app.use(cors());
		app.use(express.json());
		app.use(
			expressSession({
				secret: process.env.SECRET!,
				resave: false,
				saveUninitialized: false,
			})
		);
		app.use(cookieParser());
		app.use(passport.initialize());
		app.use(passport.session());

		app.use('/notes', notesRouter);
		app.use('/sections', sectionsRouter);
		app.use('/user', userRouter);
		app.use('/google', googleAuthRouter);
		app.use('/files', filesRouter);

		app.get('/*', (req, res) => {
			console.log('Error', req);
		});

		const PORT = process.env.PORT ?? 8080;
		app.listen(PORT, () => console.log(`Server is listening at ${PORT}`));
	} catch (e) {
		if (e instanceof Error) console.log('Unexpected error occurred', e);
	}
})();
