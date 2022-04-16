import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import auth from '../auth';
import { writeFile } from 'fs/promises';

const getFileExtension = (fileName: string) => fileName.match(/\..+$/)![0];

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '../uploads'));
	},
	filename: function (req, file, cb) {
		//@ts-ignore
		const { id: userId } = req.payload as authJSON;

		const uniqueSuffix = `${userId}-${Date.now()}`;
		const fileName = `${uniqueSuffix}-${file.fieldname}${getFileExtension(
			file.originalname
		)}`;

		cb(null, fileName);
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
					const filePaths = req.files.map(
						({ filename, mimetype, originalname }) => ({
							fileName: filename,
							mimeType: mimetype,
							originalName: originalname,
						})
					);

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
