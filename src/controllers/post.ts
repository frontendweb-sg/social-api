import path from 'path';
import mongoose from 'mongoose';
import {Request, Response, NextFunction} from 'express';
import {IPostDoc, Post} from '../models/post';
import {BadRequestError, NotFoundError} from '../errors';
import {prefixImgDir, slug} from '../utils';
import {deleteFile, deleteFiles} from '../utils/uploader';
import sharp from 'sharp';
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

		const update = posts.map((post) => ({
			...post.toJSON(),
			id: post.id,
			images: (post.images || []).map((img) => prefixImgDir(img)),
		}));

		return res.status(200).json(update);
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
		post.images = post.images.map((img) => prefixImgDir(img));
		post.videoUrl = prefixImgDir(post.videoUrl!);
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
	try {
		const user = req.user;
		const body = req.body;
		body.user = user?.id;

		const files: {
			images: Express.Multer.File[];
			videoUrl: Express.Multer.File[];
		} = req.files
			? {
					images: req.files['images' as keyof typeof req.file] || [],
					videoUrl: req.files['videoUrl' as keyof typeof req.file] || [],
				}
			: {
					images: [],
					videoUrl: [],
				};

		if (files.videoUrl.length) {
			body.videoUrl = files.videoUrl[0].filename;
		}

		if (files.images.length) {
			body.images = files.images.map((file) => file.filename);
		}

		const newPost = new Post(body);
		const result = await newPost.save();

		result.images = result.images.map((img) => prefixImgDir(img));
		result.videoUrl = prefixImgDir(result.videoUrl!);
		return res.status(201).json(body);
	} catch (error) {
		if (req.files !== undefined) {
			deleteFiles(req.files['images' as keyof typeof req.file]);
			deleteFile(req.files['videoUrl' as keyof typeof req.file]);
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

		if (status) {
		}

		const post = (await Post.findById(postId).lean()) as IPostDoc;
		if (!post) throw new NotFoundError('Post not found!');

		const user = req.user;
		const body = req.body;
		body.slug = slug(body.title);
		body.user = user?.id;

		const files = req.files as Express.Multer.File[];
		if (files.length) {
			body.images = files.map((file) => file.filename);
		}

		const result = (await Post.findByIdAndUpdate(
			postId,
			{$set: body},
			{new: true},
		)) as IPostDoc;
		result.images = result?.images.map((img) => prefixImgDir(img));
		result.videoUrl = prefixImgDir(result.videoUrl!);
		return res.status(200).json(result);
	} catch (error) {
		deleteFiles(req.files as Express.Multer.File[]);
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
			const files = post.images.map((file) => ({
				path: path.resolve(__dirname, '..', 'uploads', 'post', file),
			}));
			deleteFiles(files as Express.Multer.File[]);
		}

		return res.status(200).json({postId});
	} catch (error) {
		next(error);
	}
};

const postActiveInactive = (status: string) => {};

export {getPost, getPosts, addPost, updatePost, deletePost};
