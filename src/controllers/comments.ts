import {Request, Response, NextFunction} from 'express';
import {User} from '../models/user';
import {IPostDoc, Post} from '../models/post';
import {BadRequestError, NotFoundError} from '../errors';

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

		const post = (await Post.findById(postId)) as IPostDoc;

		if (!post) {
			throw new NotFoundError('Post not found!');
		}

		const {message} = req.body;
		const status = message.includes('sex') ? 'rejected' : 'approved';

		const result = await Post.findByIdAndUpdate(
			postId,
			{
				$set: {
					message,
					user,
					status,
				},
			},
			{new: true},
		);
		return res.status(201).json(result);
	} catch (error) {
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

		const result = await Post.findOneAndUpdate(
			{_id: postId, comments: {$elemMatch: {_id: commentId, user: user}}},
			{$pull: {comments: {_id: commentId}}},
			{new: true},
		);

		return res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
