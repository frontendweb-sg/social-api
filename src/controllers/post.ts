import mongoose from 'mongoose';
import {Request, Response, NextFunction} from 'express';
import {IPost, IPostDoc, Post} from '../models/post';
import {BadRequestError, NotFoundError} from '../errors';
import type {PostFileType} from '../types';
import {UploadApiOptions, UploadApiResponse} from 'cloudinary';
import {deleteUploadFile, uploadImage} from '../cludinary';
const POST_OPTIONS: UploadApiOptions = {
	folder: 'post',
	transformation: {
		width: 450,
		height: 250,
		crop: 'crop',
	},
};
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
		const posts = (await Post.find()
			.populate('user')
			.populate({
				path: 'comments',
				populate: {
					path: 'user',
				},
			})
			.sort({
				createdAt: -1,
			})) as IPostDoc[];

		return res.status(200).json(posts);
	} catch (error) {
		console.log('error', error);
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
		const allImages = files.images.map((image) =>
			uploadImage(image.path, POST_OPTIONS),
		);

		const response = await Promise.all<UploadApiResponse>(allImages);

		for (let file of response) {
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
		const file = await uploadImage(video.path, {
			resource_type: 'video',
			...POST_OPTIONS,
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
		const result = await newPost.save().then((res) => res.populate('user'));
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
		const status = req.query.status;

		const post = (await Post.findById(postId).lean()) as IPostDoc;
		if (!post) throw new NotFoundError('Post not found!');

		const user = req.user;
		const body = req.body;
		body.user = user?.id;

		const files = req.files as Express.Multer.File[];
		if (files.length) {
			body.images = files.map((file) => file.filename);
		}

		const result = (await Post.findByIdAndUpdate(
			postId,
			{$set: body},
			{new: true},
		)
			.populate('user')
			.populate({
				path: 'comments',
				populate: {
					path: 'user',
				},
			})) as IPostDoc;

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

		if (post.videoUrl?.public_id) {
			await deleteUploadFile(post.videoUrl.public_id, {
				resource_type: post.videoUrl.resource_type,
				type: post.videoUrl.access_mode,
			});
		}
		if (post?.images.length) {
			const files = post?.images.map(
				async (file) =>
					await deleteUploadFile(file.public_id, {
						resource_type: file.resource_type,
						type: file.access_mode,
					}),
			);
			await Promise.all<UploadApiResponse>(files!);
		}
		await Post.findByIdAndDelete(postId);
		return res.status(200).json({postId});
	} catch (error) {
		next(error);
	}
};

export {getPost, getPosts, addPost, updatePost, deletePost};
