import { NewNote } from '../types';
import { Router } from 'express';
import { NoteModel, SectionModel } from '../database/models';
import { Deleted, Id, Note } from '../types';
import { populateNotes, populateSubNotes } from '../database/population';
import { STATUS_CODES } from '../constants';
import auth from '../auth';

export const notesRouter = Router();

notesRouter.post('/', auth.required, (req, res, next) => {
	(async () => {
		try {
			const { title, description, tags, parent, section, files } =
				req.body as NewNote;

			//@ts-ignore
			const { id: userId } = req.payload as authJSON;

			if (!title) {
				return res
					.status(STATUS_CODES.BAD)
					.json({ error: 'You must put title in your request' });
			} else if (!parent && !section) {
				return res.status(STATUS_CODES.BAD).json({
					error: 'You must put one of parentId or sectionId in your request',
				});
			}

			const newNote = await NoteModel.create({
				title,
				description,
				tags,
				parent,
				section,
				files,
				user: userId,
			});
			await newNote.save();

			if (parent) {
				const parentNote = await NoteModel.findById(parent);

				if (parentNote === null) {
					return res
						.status(STATUS_CODES.BAD)
						.json({ error: "Can't find parent" });
				} else if (parentNote.user.toString() !== userId) {
					return res.status(403).send({ error: 'Unauthorized' });
				}

				parentNote.subNotes.push(newNote.id);
				await parentNote.save();
			}
			if (section) {
				const parentSection = await SectionModel.findById(section);

				if (parentSection === null) {
					return res
						.status(STATUS_CODES.BAD)
						.json({ error: "Can't find section" });
				} else if (parentSection.user.toString() !== userId) {
					return res.status(403).send({ error: 'Unauthorized' });
				}

				parentSection.notes.push(newNote.id);
				await parentSection.save();
			}

			return res.json({
				payload: { ...newNote.toJSON(), id: newNote.id },
			});
		} catch (e) {
			if (e instanceof Error) {
				res.status(STATUS_CODES.BAD).json({ error: e.message });
				next(e);
			}
			console.log(e);
		}
	})();
});

notesRouter.delete('/:noteId', auth.required, (req, res, next) => {
	(async () => {
		try {
			const { noteId } = req.params as { noteId: string };
			//@ts-ignore
			const { id: userId } = req.payload as authJSON;

			const noteToDelete = await NoteModel.findById(noteId);

			if (noteToDelete === null) return res.json({});

			const { title, id } = noteToDelete;

			//@ts-ignore
			if (noteToDelete.user.toString() !== userId) {
				return res.status(403).send({ error: 'Unauthorized' });
			}

			if (noteToDelete.parent !== null) {
				const parentNote = await NoteModel.findById(
					noteToDelete.parent
				);

				if (parentNote) {
					parentNote.subNotes = parentNote.subNotes.filter(
						(id) => id.toString() !== noteId
					);
					await parentNote.save();
				}
			}
			if (noteToDelete.section !== null) {
				const section = await SectionModel.findById(
					noteToDelete.section
				);

				if (section) {
					section.notes = section.notes.filter(
						(id) => id.toString() !== noteId
					);
					await section.save();
				}
			}
			if (noteToDelete.subNotes.length !== 0) {
				for (const subNoteId of noteToDelete.subNotes) {
					await NoteModel.deleteOne({ _id: subNoteId });
				}
			}

			await noteToDelete.delete();

			res.json({ payload: { id, title } });
		} catch (e) {
			if (e instanceof Error) {
				res.status(STATUS_CODES.BAD).json({ error: e.message });
				next(e);
			} else {
				next(e);
			}
		}
	})();
});

notesRouter.get('/', auth.required, (req, res, next) => {
	(async () => {
		try {
			const { sectionId } = req.query as {
				sectionId: string;
			};
			//@ts-ignore
			const { id: userId } = req.payload as authJSON;

			if (!sectionId) {
				return res.status(STATUS_CODES.BAD).json({
					error: 'You must pass sectionId into query string',
				});
			}

			const parentSection = await SectionModel.findById(sectionId);

			//@ts-ignore
			if (parentSection.user.toString() !== userId) {
				return res.status(403).send({ error: 'Unauthorized' });
			} else if (parentSection !== null) {
				const notes = await NoteModel.find({
					_id: { $in: parentSection.notes },
				});

				return res.json({ payload: notes });
			}

			return res.json({ payload: null });
		} catch (e) {
			if (e instanceof Error) {
				res.status(STATUS_CODES.BAD).send({ error: e.message });
				next(e);
			} else {
				next(e);
			}
		}
	})();
});

notesRouter.get('/list', auth.required, (req, res, next) => {
	(async () => {
		try {
			const { sectionId } = req.query as {
				sectionId: string;
			};
			//@ts-ignore
			const { id: userId } = req.payload as authJSON;

			if (!sectionId) {
				return res.status(STATUS_CODES.BAD).json({
					error: 'You must pass sectionId into query string',
				});
			}

			const parentSection = await SectionModel.findById(sectionId);

			//@ts-ignore
			if (parentSection.user.toString() !== userId) {
				return res.status(403).send({ error: 'Unauthorized' });
			} else if (parentSection !== null) {
				const notes = await NoteModel.find({
					_id: { $in: parentSection.notes },
				});

				return res.json({
					payload: notes.map(({ title, id, pinned }) => ({
						title,
						id,
						pinned,
					})),
				});
			}

			return res.json({ payload: null });
		} catch (e) {
			if (e instanceof Error) {
				res.status(STATUS_CODES.BAD).send({ error: e.message });
				next(e);
			} else {
				next(e);
			}
		}
	})();
});

notesRouter.get('/:noteId', auth.required, (req, res, next) => {
	(async () => {
		try {
			const { noteId } = req.params as { noteId: string };
			//@ts-ignore
			const { id: userId } = req.payload as authJSON;

			const note = await NoteModel.findById(noteId);

			if (note !== null) {
				if (note.user.toString() !== userId) {
					return res.status(403).send({ error: 'Unauthorized' });
				}
				return res.json({ payload: await populateSubNotes(note) });
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

notesRouter.put('/:noteId', auth.required, (req, res, next) => {
	(async () => {
		try {
			const { noteId } = req.params as { noteId: string };
			//@ts-ignore
			const { id: userId } = req.payload as authJSON;

			const note = await NoteModel.findById(noteId);

			if (note === null) {
				return res
					.status(STATUS_CODES.BAD)
					.json({ error: 'Can`t find note' });
			} else if (note.user.toString() !== userId) {
				return res.status(403).send({ error: 'Unauthorized' });
			}

			const { update } = req.body as { update: Partial<Note> | null };

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
					} else if (key === 'subNotes') {
						return res
							.status(STATUS_CODES.BAD)
							.json({ error: "You can't change subNotes" });
					}

					if (key === 'parent') {
						const parentNote = await NoteModel.findById(
							note.parent
						);

						if (parentNote !== null) {
							parentNote.subNotes = parentNote.subNotes.filter(
								(id) => id.toString() === noteId
							);
							await parentNote.save();
						}

						if (update[key] !== null) {
							const newParentNote = await NoteModel.findById(
								update[key]
							);

							if (newParentNote !== null) {
								newParentNote.subNotes.push(note._id);
								await newParentNote.save();
							} else {
								update[key] = null;
							}
						}
					}
					if (key === 'section') {
						const section = await SectionModel.findById(
							note.section
						);

						if (section !== null) {
							section.notes = section.notes.filter(
								(id) => id.toString() === noteId
							);
							await section.save();
						}

						if (update[key] !== null) {
							const newSection = await SectionModel.findById(
								update[key]
							);

							if (newSection !== null) {
								newSection.notes.push(note._id);
								await newSection.save();
							} else {
								update[key] = null;
							}
						}
					}

					//@ts-ignore
					note[key] = update[key];
				}
			}

			await note.save();

			return res.json({ payload: note });
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

notesRouter.post('/addSubNote', auth.required, (req, res, next) => {
	(async () => {
		try {
			const { to, note: newSubNote } = req.body as {
				to?: Id;
				note?: NewNote;
			};
			//@ts-ignore
			const { id: userId } = req.payload as authJSON;

			if (!to || !newSubNote) {
				return res
					.status(STATUS_CODES.BAD)
					.json({ error: 'You must pass both id and note to body' });
			}

			const parentNote = await NoteModel.findById(to);

			if (!parentNote) {
				return res
					.status(STATUS_CODES.BAD)
					.json({ error: "Can't find parent note" });
			} else if (parentNote.user !== userId) {
				return res.status(403).send({ error: 'Unauthorized' });
			}
			const newNote = await NoteModel.create({
				...newSubNote,
				user: userId,
			});
			await newNote.save();

			parentNote.subNotes.push(newNote._id);
			await parentNote.save();

			return res.json({ payload: newNote });
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

export default notesRouter;
