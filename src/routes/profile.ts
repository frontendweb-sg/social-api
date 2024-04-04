import {Router} from 'express';
import {getLoggedInUserPosts, getLoggedInUser} from '../controllers/profile';
import {auth} from '../middleware/auth';

const route = Router();

route.get('/me', auth, getLoggedInUser);
route.get('/:userId/posts', auth, getLoggedInUserPosts);

export {route as profileRoute};
