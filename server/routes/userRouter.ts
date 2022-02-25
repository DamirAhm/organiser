import { authJSON } from './../types';
import { Router } from 'express';
import { SectionModel, UserModel } from '../database/models';
import { Deleted, RegisterUser, User } from '../types';
import { STATUS_CODES } from '../constants';
import auth from '../auth';

export const userRouter = Router();

userRouter.get('/authorized', auth.optional, (req, res) => {
	res.send({ authorized: (req as any).payload != undefined ? true : false });
});

userRouter.put('/', auth.required, (req, res, next) => {
	(async () => {
		try {
			//@ts-ignore
			const { id: userId } = req.payload as authJSON;

			const user = await UserModel.findById(userId);

			if (user === null) {
				return res
					.status(STATUS_CODES.BAD)
					.json({ error: 'Can`t find user' });
			}

			const { update } = req.body as { update: Partial<User> | null };

			if (update === null) {
				return res
					.status(STATUS_CODES.BAD)
					.json({ error: 'You must pass updates object to body' });
			}

			for (const key in update) {
				if (update.hasOwnProperty(key)) {
					if (key === 'id' || key === '_id') {
						return res
							.status(STATUS_CODES.BAD)
							.json({ error: 'You can`t change note id' });
					} else if (key === 'sections') {
						return res
							.status(STATUS_CODES.BAD)
							.json({ error: "You can't change sections" });
					}

					//@ts-ignore
					user[key] = update[key];
				}
			}

			await user.save();

			return res.json({ payload: user });
		} catch (e) {
			if (e instanceof Error) {
				res.status(STATUS_CODES.BAD).json({ error: e.message });
				next(e);
			} else {
				console.log(e);
			}
		}
	})();
});

userRouter.get('/', auth.required, (req, res, next) => {
	(async () => {
		try {
			//@ts-ignore
			const { id } = req.payload as authJSON;

			const user = await UserModel.findById(id);

			res.send({ payload: user });
		} catch (e) {
			console.log(e);
			next(e);
		}
	})();
});
