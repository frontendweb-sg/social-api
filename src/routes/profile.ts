import {Router} from 'express';
import {auth} from '../middleware/auth';
import {
	addEmployment,
	addProfile,
	deleteEmployment,
	getProfile,
	updateEmployment,
	updateProfile,
} from '../controllers/profile';

const route = Router();

route.get('/', auth, getProfile);
route.post('/', auth, addProfile);
route.put('/:profileId', auth, updateProfile);
route.post('/:profileId/employment', auth, addEmployment);
route.put('/:profileId/employment/:employmentId', auth, updateEmployment);
route.delete('/:profileId/employment/:employmentId', auth, deleteEmployment);

export {route as profileRoute};
