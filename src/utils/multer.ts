import multer, {FileFilterCallback} from 'multer';
import {Request} from 'express';

/**
 * no destination
 * @param fileFilter
 * @returns
 */
export function multerUploader(
	fileFilter?: (
		req: Request,
		file: Express.Multer.File,
		callback: FileFilterCallback,
	) => void,
) {
	const storage = multer.diskStorage({});
	return multer({
		storage,
		limits: {fileSize: 500000},
		fileFilter,
	});
}
