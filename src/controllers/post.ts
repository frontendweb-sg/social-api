import path from "path";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { IPostDoc, Post } from "../models/post";
import { BadRequestError, NotFoundError } from "../errors";
import { slug } from "../utils";
import { deleteFiles } from "../utils/uploader";

/**
 * Get all posts
 * @param req
 * @param res
 * @param next
 */
const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = (await Post.find()) as IPostDoc[];

    const update = posts.map((post) => ({
      ...post,
      id: post.id,
      images: (post.images || []).map(
        (img) => `${res.locals.baseUrl}/uploads/post/${img}`
      ),
    }));

    return res.status(200).json(update);
  } catch (error) {
    console.log("hi", error);
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
    const { postId } = req.params;

    const post = (await Post.findById(postId).lean()) as IPostDoc;
    if (!post) throw new NotFoundError("Post not found!");

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
    console.log(req.body, "body");
    const user = req.user;
    const body = req.body;
    body.slug = slug(body.title);
    body.user = user?.id;

    const files = (req.files as Express.Multer.File[]) ?? [];
    if (files.length) {
      body.images = files.map((file) => file.filename);
    }

    const post = (await Post.findOne({ slug: body.slug }).lean()) as IPostDoc;
    if (post) throw new NotFoundError("Post already existed!");

    const newPost = new Post(body);
    const result = await newPost.save();

    return res.status(201).json(result);
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
const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params;
    const status = req.query.status;

    if (status) {
    }

    const post = (await Post.findById(postId).lean()) as IPostDoc;
    if (!post) throw new NotFoundError("Post not found!");

    const user = req.user;
    const body = req.body;
    body.slug = slug(body.title);
    body.user = user?.id;

    const files = req.files as Express.Multer.File[];
    if (files.length) {
      body.images = files.map((file) => file.filename);
    }

    const result = await Post.findByIdAndUpdate(
      postId,
      { $set: body },
      { new: true }
    );

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
    const { postId } = req.params;

    const post = (await Post.findById(postId).lean()) as IPostDoc;
    if (!post) throw new NotFoundError("Post not found!");

    const result = await Post.findByIdAndDelete(postId);
    if (result) {
      const files = post.images.map((file) => ({
        path: path.resolve(__dirname, "..", "uploads", "post", file),
      }));
      deleteFiles(files as Express.Multer.File[]);
    }

    return res.status(200).json({ postId });
  } catch (error) {
    next(error);
  }
};

const postActiveInactive = (status: string) => {};

export { getPost, getPosts, addPost, updatePost, deletePost };