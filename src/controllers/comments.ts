import {Request, Response, NextFunction} from 'express';
import {User} from '../models/user';
import {IComment, IPostDoc, Post} from '../models/post';
import {BadRequestError, NotFoundError} from '../errors';
import {Status} from '../utils/enum';
import {Schema} from 'mongoose';
import {deleteFiles} from '../utils/uploader';

/**
 * Add comment
 * @param req
 * @param res
 * @param next
 */
export const addComment = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const postId = req.params.postId;
		const user = req.user?.id;
		const body = req.body;

		const post = (await Post.findById(postId)) as IPostDoc;
		if (!post) {
			throw new NotFoundError('Post not found!');
		}

		body.status = req.body.message.includes('sex')
			? Status.Rejected
			: Status.Approved;

		body.user = user!;
		const files = (req.files ?? []) as Express.Multer.File[];
		if (files.length) {
			body.images = (files ?? []).map(
				(file: Express.Multer.File) => file.filename,
			);
		}

		const result = await Post.findOneAndUpdate(
			{_id: postId},
			{
				$push: {
					comments: req.body,
				},
			},
			{new: true},
		);
		return res.status(201).json(result?.comments);
	} catch (error) {
		if (req.files?.length) {
			deleteFiles(req.files['images' as keyof typeof req.file]);
		}
		next(error);
	}
};

/**
 * Delete comment
 * @param req
 * @param res
 * @param next
 */
export const deleteComment = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const postId = req.params.postId;
		const commentId = req.params.commentId;
		const user = req.user?.id;
		const post = (await Post.findById(postId)) as IPostDoc;

		if (!post) {
			throw new NotFoundError('Post not found!');
		}

		const userComments = post.comments?.find(
			(comment) =>
				comment.user.toString() === user &&
				comment._id!.toString() === commentId,
		);

		if (!userComments)
			throw new BadRequestError('You can not other user comment');

		await Post.findOneAndUpdate(
			{_id: postId, comments: {$elemMatch: {_id: commentId, user: user}}},
			{$pull: {comments: {_id: commentId}}},
			{new: true},
		);

		return res.status(200).json({
			commentId,
			postId,
		});
	} catch (error) {
		next(error);
	}
};
