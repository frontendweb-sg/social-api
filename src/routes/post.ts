import {Router} from 'express';
import {
	addPost,
	deletePost,
	getPost,
	getPosts,
	updatePost,
} from '../controllers/post';
import {body, check, query, validationResult} from 'express-validator';
import {requestValidator} from '../middleware/request-validator';
import {uploader} from '../utils/uploader';
import {auth} from '../middleware/auth';
import {addComment, deleteComment} from '../controllers/comments';
import {addLike, removeLike} from '../controllers/likes';

const route = Router();
const upload = uploader('post');

route.get('/', getPosts);
route.get('/:postId', auth, getPost);
route.post(
	'/',
	auth,
	upload.fields([
		{name: 'images', maxCount: 5},
		{name: 'videoUrl', maxCount: 1},
	]),
	[body('content', 'Content is required!').notEmpty()],
	requestValidator,
	addPost,
);

route.post(
	'/:postId/comment',
	auth,
	upload.array('images', 5),
	[body('message', 'Field is required!').notEmpty()],
	requestValidator,
	addComment,
);
route.put('/:postId/like', auth, addLike);
route.put('/:postId/dislike', auth, removeLike);

route.put(
	'/:postId',
	auth,
	[body('title', 'Title is required!').notEmpty()],
	requestValidator,
	updatePost,
);

route.delete('/:postId', auth, deletePost);
route.delete('/:postId/comment/:commentId', auth, deleteComment);
export {route as postRoute};
