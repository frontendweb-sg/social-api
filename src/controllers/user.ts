import {Request, Response, NextFunction} from 'express';
import {IUser, User} from '../models/user';
import {deleteUploadFile, uploadFile} from '../cloudinary';
import {NotFoundError} from '../errors';

/**
 * Logged in user
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const loggedInUser = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = (await User.findById(req.user?.id)) as IUser;
		return res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

/**
 * Update avatar
 * @param req
 * @param res
 * @param next
 */
export const updateAvatar = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const userId = req.user?.id;
		const file = req.file as Express.Multer.File;
		const user = (await User.findById(userId)) as IUser;

		if (!user) throw new NotFoundError('Invalid user id');

		if (file.path) {
			await deleteUploadFile(user.avatar.public_id);
		}

		const cloudeData = await uploadFile(file.path);
		const data = {
			public_id: cloudeData.public_id,
			secure_url: cloudeData.secure_url,
			resource_type: cloudeData.resource_type,
			access_mode: cloudeData.access_mode,
			folder: cloudeData.folder,
			signature: cloudeData.signature,
			version: cloudeData.version,
		};
		const result = await User.findByIdAndUpdate(
			user,
			{$set: {avatar: data}},
			{new: true},
		);

		return res.status(200).send(result);
	} catch (error) {
		console.log('e', error);

		next(error);
	}
};
