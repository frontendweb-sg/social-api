import {Router} from 'express';
import {getLoggedInUserPosts} from '../controllers/profile';
import {auth} from '../middleware/auth';

const route = Router();
route.get('/:userId/posts', auth, getLoggedInUserPosts);

export {route as profileRoute};
