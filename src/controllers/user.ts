import {Request, Response, NextFunction} from 'express';
import {IUser, User} from '../models/user';
import {deleteFile} from '../utils/uploader';
import {hostPrefix} from '../utils';

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
		user.avatar = hostPrefix(user?.avatar!);
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
		const user = req.user?.id;
		const file = req.file as Express.Multer.File;
		const userData = (await User.findById(user)) as IUser;
		if (file.path) {
			deleteFile(userData?.avatar!);
		}

		const result = await User.findByIdAndUpdate(
			user,
			{$set: {avatar: file.path}},
			{new: true},
		);

		return res.status(200).send({avatar: hostPrefix(result?.avatar!)});
	} catch (error) {
		deleteFile(req.file?.path!);
		next(error);
	}
};
