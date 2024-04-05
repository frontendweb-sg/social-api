import mongoose from 'mongoose';
import {Request, Response, NextFunction} from 'express';
import {IPost, IPostDoc, Post} from '../models/post';
import {BadRequestError, NotFoundError} from '../errors';
import {slug} from '../utils';
import {deleteFiles} from '../utils/uploader';
import {deleteUploadFile, uploadFile} from '../cloudinary';
import {PostFileType} from '../types';

const getFileObj = (files: any) =>
	files
		? {
				images: files['images' as keyof typeof File] || [],
				videoUrl: files['videoUrl' as keyof typeof File] || [],
			}
		: {images: [], videoUrl: []};

/**
 * Get all posts
 * @param req
 * @param res
 * @param next
 */
const getPosts = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const posts = (await Post.find().populate('user').sort({
			createdAt: -1,
		})) as IPostDoc[];
		return res.status(200).json(posts);
	} catch (error) {
		next(error);
	}
};

/**
 *
 * @param req
 * @param res
 * @param next
 */
const getPost = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const {postId} = req.params;
		const post = (await Post.findById(postId).lean()) as IPostDoc;
		if (!post) throw new NotFoundError('Post not found!');
		return res.status(200).json(post);
	} catch (error) {
		if (error instanceof mongoose.MongooseError) {
			error = new BadRequestError(error.message);
		}
		next(error);
	}
};

/**
 *
 * @param req
 * @param res
 * @param next
 */
const addPost = async (req: Request, res: Response, next: NextFunction) => {
	const body = req.body as IPost;
	body.user = req.user?.id!;
	const files: PostFileType = getFileObj(req.files);

	let images = [];
	if (files.images.length) {
		for (let image of files.images) {
			const file = await uploadFile(image.path, {
				resource_type: 'image',
				folder: 'post',
				transformation: {width: 450, height: 250, crop: 'crop'},
			});
			images.push({
				public_id: file.public_id,
				url: file.secure_url,
				resource_type: file.resource_type,
				access_mode: file.access_mode,
				folder: file.folder,
				signature: file.signature,
				version: file.version.toString(),
			});
		}
	}

	if (files.videoUrl.length) {
		const video = files.videoUrl[0];
		const file = await uploadFile(video.path, {
			resource_type: 'video',
			folder: 'post',
			transformation: {width: 150, height: 150, crop: 'crop'},
		});

		body.videoUrl = {
			public_id: file.public_id,
			url: file.secure_url,
			resource_type: file.resource_type,
			access_mode: file.access_mode,
			folder: file.folder,
			signature: file.signature,
			version: file.version.toString(),
		};
	}

	body.images = images;
	try {
		const newPost = new Post(body);
		const result = await newPost.save();
		return res.status(201).json(result);
	} catch (error) {
		if (req.files !== undefined) {
			for (let image of body.images) {
				await deleteUploadFile(image?.public_id, {
					resource_type: image.resource_type,
					type: image.access_mode,
				});
			}

			if (body.videoUrl) {
				await deleteUploadFile(body.videoUrl?.public_id, {
					resource_type: body.videoUrl.resource_type,
					type: body.videoUrl.access_mode,
				});
			}
		}
		next(error);
	}
};

/**
 *
 * @param req
 * @param res
 * @param next
 */
const updatePost = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const {postId} = req.params;
		const user = req.user;
		const body = req.body;
		body.user = user?.id;

		const post = (await Post.findById(postId).lean()) as IPostDoc;
		if (!post) throw new NotFoundError('Post not found!');

		const result = (await Post.findByIdAndUpdate(
			postId,
			{$set: body},
			{new: true},
		)) as IPostDoc;
		return res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
/**
 *
 * @param req
 * @param res
 * @param next
 */
const deletePost = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const {postId} = req.params;

		const post = (await Post.findById(postId).lean()) as IPostDoc;
		if (!post) throw new NotFoundError('Post not found!');

		const result = await Post.findByIdAndDelete(postId);

		if (result) {
			for (let image of post.images) {
				await deleteUploadFile(image?.public_id, {
					resource_type: image.resource_type,
					type: image.access_mode,
				});
			}

			if (post.videoUrl) {
				await deleteUploadFile(post.videoUrl?.public_id, {
					resource_type: post.videoUrl.resource_type,
					type: post.videoUrl.access_mode,
				});
			}
		}
		return res.status(200).json({postId});
	} catch (error) {
		next(error);
	}
};

export {getPost, getPosts, addPost, updatePost, deletePost};
