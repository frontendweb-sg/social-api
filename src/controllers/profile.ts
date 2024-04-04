import {NextFunction, Request, Response} from 'express';
import {IUser, User} from '../models/user';
import {prefixImgDir} from '../utils';
import {deleteFile} from '../utils/uploader';
import {Post} from '../models/post';

/**
 * Get logged in user
 * @param req
 * @param res
 * @param next
 */
export const getLoggedInUser = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = req.user?.id;
		const result = await User.findById(user);
		return res
			.status(200)
			.send({avatar: prefixImgDir(result?.avatar!, 'avatar')});
	} catch (error) {
		next(error);
	}
};

/**
 * Get logged in user posts
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const getLoggedInUserPosts = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = req.user?.id;
		const posts = await Post.find({user});
		return res.status(200).json(posts);
	} catch (error) {
		next(error);
	}
};
