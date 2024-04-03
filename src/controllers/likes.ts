import {Request, Response, NextFunction} from 'express';

import {ILike, IPostDoc, Post} from '../models/post';
import {BadRequestError, NotFoundError} from '../errors';
import mongoose, {ObjectId, Schema} from 'mongoose';

/**
 * add comment
 */
export const addLike = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const userId = req.user?.id; // userId
		const postId = req.params.postId; // postId
		const post = (await Post.findById(postId)) as IPostDoc;

		// get all likes
		const Likes = post.likes?.filter(
			(like: ILike) => like.user.toString() === userId,
		) as ILike[];

		if (Likes.length > 0) {
			const like = <ILike>(
				post.likes?.find((like: ILike) => like.user.toString() === userId)
			);
			if (like.active) {
				throw new BadRequestError('You have already liked this post!');
			}
			updateLikes(post, userId!, true);
		} else {
			post.likes?.unshift({
				user: userId!,
				active: true,
			});
		}

		await post.save();
		return res.status(200).send(post.likes);
	} catch (err) {
		throw next(err);
	}
};
/**
 * Remove like from post
 */
export const removeLike = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const userId = req.user?.id;
		const postId = req.params.postId;

		// get post by post id
		const post = (await Post.findById(postId)) as IPostDoc;
		if (!post) {
			throw new NotFoundError('Post not found!');
		}
		// all likes
		const postLikes = post.likes?.filter(
			(like) => like.user.toString() === userId,
		) as ILike[];

		if (postLikes.length > 0) {
			const dislike = post.likes?.find(
				(like: ILike) => like.user.toString() === userId,
			) as ILike;

			if (!dislike.active) {
				throw new BadRequestError('You have already dislike this post!');
			}
			updateLikes(post, userId!, false);
		} else {
			post.likes?.unshift({
				user: userId!,
				active: false,
			});
		}

		await post.save();
		return res.status(200).send(post.likes);
	} catch (err) {
		throw next(err);
	}
};

// update like
function updateLikes(post: IPostDoc, userId: string, value: boolean) {
	const existLikes = post.likes as ILike[];
	const index = existLikes.findIndex(
		(like: ILike) => like.user.toString() === userId,
	);
	const existLike = existLikes[index];
	existLike.active = value;
	existLikes[index] = existLike;
	post.likes = existLikes;
}
