import {Router} from 'express';
import {auth} from '../middleware/auth';
import {addProfile, getProfile, updateProfile} from '../controllers/profile';
import {
	addEducation,
	deleteEducation,
	updateEducation,
} from '../controllers/education';
import {
	addEmployment,
	updateEmployment,
	deleteEmployment,
} from '../controllers/employment';

const route = Router();

route.get('/', auth, getProfile);
route.post('/', auth, addProfile);
route.put('/:profileId', auth, updateProfile);

// employment route
route.post('/:profileId/employment', auth, addEmployment);
route.put('/:profileId/employment/:employmentId', auth, updateEmployment);
route.delete('/:profileId/employment/:employmentId', auth, deleteEmployment);

// education route
route.post('/:profileId/education', auth, addEducation);
route.put('/:profileId/education/:educationId', auth, updateEducation);
route.delete('/:profileId/education/:educationId', auth, deleteEducation);

export {route as profileRoute};
