import multer from 'multer';
import {Request} from 'express';
import type {FileFilterCallback} from 'multer';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export const uploader = (
	dir: string,
	fileFilter?: (
		req: Request,
		file: Express.Multer.File,
		callback: FileFilterCallback,
	) => void,
) => {
	const storage = multer.diskStorage({
		filename(req, file, cb) {
			// sharp(file.filename).resize(400, 200);
			const name =
				req.user!.id +
				'-' +
				Date.now().toString() +
				'-' +
				file.originalname.replace(/\s+/, '-').toLowerCase();
			cb(null, name);
		},
		destination(req, file, cb) {
			const folder = path.resolve(__dirname, '..', 'uploads', dir);
			if (!fs.existsSync(folder)) {
				fs.mkdirSync(folder);
			}
			cb(null, folder);
		},
	});

	return multer({storage, fileFilter});
};

// delete file
export const deleteFile = (file: Express.Multer.File) => {
	if (fs.existsSync(file.path)) {
		fs.unlink(file.path, (err: any) => {
			if (err) new Error(err);
		});
	}
};

export const deleteFiles = (files: Express.Multer.File[]) => {
	if (!files.length) return;
	for (let file of files) {
		if (fs.existsSync(file.path)) {
			fs.unlink(file.path, (err: any) => {
				if (err) new Error(err);
			});
		}
	}
};
