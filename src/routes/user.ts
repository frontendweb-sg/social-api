import {Router} from 'express';
import {auth} from '../middleware/auth';

import {loggedInUser, updateAvatar} from '../controllers/user';
import {multerUploader} from '../utils/multer';

const uploader = multerUploader();
const route = Router();

route.get('/me', auth, loggedInUser);
route.put('/avatar', auth, uploader.single('avatar'), updateAvatar);

export {route as userRoute};
