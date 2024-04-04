import {Router} from 'express';
import {body, oneOf} from 'express-validator';
import {signin, signup} from '../controllers/auth';
import {requestValidator} from '../middleware/request-validator';
import {User} from '../models/user';
import {BadRequestError} from '../errors';
import {regExp} from '../utils/regex';

const route = Router();

route.post(
	'/',
	[
		oneOf([
			body('email').isEmail().withMessage('Invalid email'),
			body('email').isMobilePhone('en-IN'),
		]),
		body('password', 'Password is required!').notEmpty(),
	],
	requestValidator,
	signin,
);

route.post(
	'/signup',
	[
		body('name', 'Name is required!').notEmpty(),
		body('email', 'Email is required!')
			.isEmail()
			.custom(async (email) => {
				const user = await User.findOne({email});
				if (user) throw new BadRequestError('Email already existed!');
				return user;
			}),
		body('password', 'Password is required!')
			.isLength({min: 8, max: 16})
			.withMessage('Password must be 8 to 16 char long')
			.matches(regExp.password)
			.withMessage(
				'Password must be one uppercase, one lowercase, one digit and one symbol.',
			),
		body('mobile', 'Mobile is required!')
			.isLength({min: 10, max: 10})
			.withMessage('Password must be 10 char')
			.matches(regExp.mobile)
			.withMessage('Invalid mobile')
			.custom(async (mobile) => {
				const user = await User.findOne({mobile});
				if (user) throw new BadRequestError('Mobile already existed!');
				return user;
			}),
	],
	requestValidator,
	signup,
);

export {route as authRoute};
