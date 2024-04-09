import {Router} from 'express';
import {auth} from '../middleware/auth';
import {multerUploader} from '../utils/uploader';
import {
	loggedInUser,
	loggedInUserPost,
	updateAvatar,
} from '../controllers/user';

const upload = multerUploader();
const route = Router();

route.get('/me', auth, loggedInUser);
route.get('/me/posts', auth, loggedInUserPost);
route.put('/avatar', auth, upload.single('avatar'), updateAvatar);

export {route as userRoute};
