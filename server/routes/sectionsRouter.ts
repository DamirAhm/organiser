import { Router } from 'express';
import { NoteModel, SectionModel, UserModel } from '../database/models';
import { authJSON, Section } from '../types';
import { populateNotes, populateSections } from '../database/population';
import { STATUS_CODES } from '../constants';
import auth from '../auth';

export const sectionsRouter = Router();

sectionsRouter.post('/', auth.required, (req, res, next) => {
	(async () => {
		try {
			const { name: sectionName } = req.body as Partial<Section>;
			//@ts-ignore
			const { id: userId } = req.payload as { id: string };

			if (!sectionName) {
				return res
					.status(STATUS_CODES.BAD)
					.json({ error: 'You must pass name in your request' });
			}

			const parentUser = await UserModel.findById(userId);

			if (parentUser === null) {
				return res
					.status(STATUS_CODES.BAD)
					.json({ error: 'Can`t find user' });
			}

			const newSection = await SectionModel.create({
				name: sectionName,
				user: userId,
			});
			await newSection.save();

			parentUser.sections.push(newSection.id);
			await parentUser.save();

			const id = newSection.id;
			return res.json({
				payload: { name: sectionName, pinned: false, id },
			});
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

sectionsRouter.delete('/:sectionId', auth.required, (req, res, next) => {
	(async () => {
		try {
			const { sectionId } = req.params as { sectionId: string };
			//@ts-ignore
			const { id: userId } = req.payload as authJSON;

			const sectionToDelete = await SectionModel.findById(sectionId);

			if (sectionToDelete === null) return res.json({ payload: null });

			const { name, id } = sectionToDelete;

			//@ts-ignore
			if (sectionToDelete.user.toString() !== userId) {
				return res.status(403).send({ error: 'Unauthorized' });
			}

			const user = await UserModel.findById(sectionToDelete.user);

			if (user) {
				user.sections = user.sections.filter(
					(id) => id.toString() !== sectionId
				);
				await user.save();
			}

			if (sectionToDelete.notes.length !== 0) {
				for (const noteId of sectionToDelete.notes) {
					await NoteModel.deleteOne({ _id: noteId });
				}
			}

			await sectionToDelete.delete();

			return res.json({ payload: { name, id } });
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

sectionsRouter.get('/', auth.required, (req, res, next) => {
	(async () => {
		try {
			//@ts-ignore
			const { id: userId } = req.payload as authJSON;

			const user = await UserModel.findById(userId);

			if (user !== null) {
				const populatedUser = await populateSections(user);

				return res.json({ payload: populatedUser.sections });
			}

			return res.status(STATUS_CODES.BAD).json({ payload: null });
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

sectionsRouter.get('/list', auth.required, (req, res, next) => {
	(async () => {
		try {
			//@ts-ignore
			const { id: userId } = req.payload as authJSON;

			//@ts-ignore
			const sections = await SectionModel.find({ user: userId });

			res.send({
				payload: sections.map(({ name, id, pinned }) => ({
					name,
					id,
					pinned,
				})),
			});
		} catch (e) {
			if (e instanceof Error) {
				res.status(STATUS_CODES.BAD).json({ error: e.message });
				next(e);
			} else {
				res.end();
				console.log(e);
			}
		}
	})();
});

sectionsRouter.get('/:sectionId', auth.required, (req, res, next) => {
	(async () => {
		try {
			const { sectionId } = req.params as { sectionId: string };
			//@ts-ignore
			const { id: userId } = req.payload as authJSON;

			const section = await SectionModel.findById(sectionId);

			if (section !== null) {
				if (section.user.toString() !== userId) {
					return res.status(403).send({ error: 'Unauthorized' });
				}

				return res.status(STATUS_CODES.GOOD).json({
					payload: await populateNotes(section),
				});
			}

			return res.json({ payload: null });
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

sectionsRouter.put('/:sectionId', auth.required, (req, res, next) => {
	(async () => {
		try {
			const { sectionId } = req.params as { sectionId: string };
			//@ts-ignore
			const { id: userId } = req.payload as authJSON;

			const section = await SectionModel.findById(sectionId);

			if (section === null) {
				return res
					.status(STATUS_CODES.BAD)
					.json({ error: 'Can`t find section' });
			} else if (section.user.toString() !== userId) {
				return res.status(403).send({
					error: 'Unauthorized',
				});
			}

			const update = req.body as Partial<Section>;

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
							.json({ error: 'You can`t change note`s id' });
					} else if (key === 'notes') {
						return res
							.status(STATUS_CODES.BAD)
							.json({ error: "You can't change notes" });
					} else if (key === 'user') {
						return res.status(STATUS_CODES.BAD).json({
							error: "You can't change section's owner",
						});
					}

					//@ts-ignore
					section[key] = update[key];
				}
			}

			await section.save();

			const id = section.id;
			return res.json({ payload: { ...section, id } });
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
