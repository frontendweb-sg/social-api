import {Request, Response, NextFunction} from 'express';
import {IUser, User} from '../models/user';
import {deleteFile} from '../utils/uploader';
import {deleteImage, deleteUploadFile, uploadImage} from '../cludinary';
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

		if (file.path && user?.avatar?.public_id) {
			await deleteUploadFile(user.avatar?.public_id, {
				resource_type: user.avatar.resource_type,
				type: user.avatar.access_mode,
			});
		}

		const cloudeData = await uploadImage(file.path, {
			folder: 'avatar',
			resource_type: 'image',
			transformation: {
				width: 150,
				height: 150,
				crop: 'crop',
			},
		});

		const result = await User.findByIdAndUpdate(
			userId,
			{
				$set: {
					avatar: {
						public_id: cloudeData.public_id,
						url: cloudeData.secure_url,
						resource_type: cloudeData.resource_type,
						access_mode: cloudeData.access_mode,
						folder: cloudeData.folder,
						signature: cloudeData.signature,
						version: cloudeData.version,
					},
				},
			},
			{new: true},
		);

		return res.status(200).json(result?.avatar);
	} catch (error) {
		if (req.file) {
			await deleteImage(req.file.path, {
				resource_type: 'image',
				type: 'authenticated',
			});
		}

		next(error);
	}
};
