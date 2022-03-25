import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import auth from '../auth';
import { writeFile } from 'fs/promises';
import { NoteModel } from '../database/models';

const getFileExtension = (fileName: string) =>
	fileName.match(/(.*)\.[^.]+$/)?.[0];

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, 'uploads'));
	},
	filename: function (req, file, cb) {
		//@ts-ignore
		const { id: userId } = req.payload as authJSON;

		const uniqueSuffix = `${userId}:${Date.now()}`;
		cb(
			null,
			`${file.fieldname}-${uniqueSuffix}${getFileExtension(
				file.originalname
			)}`
		);
	},
});

var upload = multer({ storage: storage });

export const filesRouter = Router();

filesRouter.post(
	'/upload',
	auth.required,
	upload.array('files'),
	(req, res, next) => {
		(async () => {
			try {
				if (req.files && Array.isArray(req.files)) {
					const { noteId } = req.body as { noteId: string };

					const note = await NoteModel.findById(noteId);

					//@ts-ignore
					const { id: userId } = req.payload as authJSON;

					if (!note) {
						return res
							.status(400)
							.send({ error: 'Can`t find note' });
					} else if (note.user.toString() !== userId) {
						res.status(404).send({ error: 'Unauthorized' });
					}

					const filePaths = req.files.map(({ path }) => path);

					note.files = note.files.concat(filePaths);

					await note.save();

					res.send({ payload: filePaths });
				} else {
					return res
						.status(400)
						.send({ error: 'You must send a list of files' });
				}
			} catch (err) {
				res.status(400).send({ error: err });
				next(err);
			}
		})();
	}
);
