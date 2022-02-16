import { Router } from 'express';
import { SectionModel, UserModel } from '../database/models';
import { Deleted, RegisterUser, User } from '../types';
import { STATUS_CODES } from '../constants';
import auth from '../auth';

export const usersRouter = Router();

usersRouter.post('/', auth.required, (req, res) => {
	(async () => {
		try {
			const { user } = req.body as { user?: Partial<RegisterUser> };

			if (!user?.name) {
				return res.status(STATUS_CODES.BAD).json({
					error: 'Name is required',
				});
			} else if (!user.email) {
				return res.status(STATUS_CODES.BAD).json({
					error: 'Email is required',
				});
			} else if (!user.password) {
				return res.status(STATUS_CODES.BAD).json({
					error: 'Password is required',
				});
			} else if (!user.photo_url) {
				return res.status(STATUS_CODES.BAD).json({
					error: 'Photo url is required',
				});
			}

			const finalUser = new UserModel(user);

			finalUser.setPassword(user.password);

			await finalUser.save();
			res.json({ user: finalUser.toAuthJSON() });
		} catch (e) {
			if (e instanceof Error) {
				res.status(STATUS_CODES.BAD).json({ error: e.message });
				throw e;
			} else {
				console.log(e);
			}
		}
	})();
});

usersRouter.delete('/', auth.required, (req, res) => {
	(async () => {
		try {
			//@ts-ignore
			const { id: userId } = req.payload as { id: string };

			if (!userId || typeof userId !== 'string') {
				return res
					.status(STATUS_CODES.BAD)
					.json({ error: 'You must pass id with type string' });
			}

			const UserToDelete = await UserModel.findByIdAndDelete(userId);

			if (UserToDelete === null) return res.json({});

			const deleted: Deleted = { users: [UserToDelete.id] };

			if (UserToDelete.sections.length !== 0) {
				deleted.sections = [];
				for (const sectionId of UserToDelete.sections) {
					await SectionModel.deleteOne({ _id: sectionId });
					deleted.sections.push(sectionId);
				}
			}

			return res.json({ payload: deleted });
		} catch (e) {
			if (e instanceof Error) {
				res.status(STATUS_CODES.BAD).json({ error: e.message });
				throw e;
			} else {
				console.log(e);
			}
		}
	})();
});

usersRouter.get('/authorized', auth.optional, (req, res) => {
	res.send({ authorized: (req as any).payload != undefined ? true : false });
});

usersRouter.put('/:id', auth.required, (req, res) => {
	(async () => {
		try {
			//@ts-ignore
			const { id: userId } = req.payload as { id: string };

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
							.json({ error: 'You can`t change item id' });
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
				throw e;
			} else {
				console.log(e);
			}
		}
	})();
});

usersRouter.get('/:id', auth.required, (req, res) => {
	(async () => {
		try {
			const { id } = req.query as { id: string };

			const user = await UserModel.findById(id);

			res.send(user);
		} catch (e) {
			console.log(e);
			throw e;
		}
	})();
});

usersRouter.get('/', auth.required, (req, res) =>
	//@ts-ignore
	res.send((req as any).user ?? req.payload)
);
