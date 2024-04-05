import multer from 'multer';
import {Request} from 'express';
import type {FileFilterCallback} from 'multer';
import fs from 'fs';
import path from 'path';

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
			const name =
				req.user!.id +
				'-' +
				Date.now().toString() +
				'-' +
				file.originalname.replace(/\s+/, '-').toLowerCase();
			cb(null, name);
		},
		destination(req, file, cb) {
			const folder = `uploads/${dir}`;
			if (!fs.existsSync(folder)) {
				fs.mkdirSync(folder);
			}
			cb(null, folder);
		},
	});

	return multer({storage, fileFilter});
};

// delete file
export const deleteFile = (path: string) => {
	if (fs.existsSync(path)) {
		console.log('PATH', path);
		fs.unlinkSync(path);
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
