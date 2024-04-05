import {Request, Response, NextFunction} from 'express';
import {IUserDoc, User} from '../models/user';
import {Password} from '../utils/password';
import {Jwt} from '../utils/jwt';
import {AuthError, BadRequestError, NotFoundError} from '../errors';
import {hostPrefix} from '../utils';

/**
 * Sign in controller
 * @param req
 * @param res
 * @param next
 */
const signin = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const {email, password} = req.body;

		const user = (await User.findOne({
			$or: [{email}, {mobile: email}],
		})) as IUserDoc;
		if (!user)
			throw new NotFoundError(
				'No account associated with us, please register!',
			);

		const verify = Password.compare(password, user.password);
		if (!verify) throw new AuthError('Invalid password!');

		const token = Jwt.genToken({email: user.email, id: user._id});
		user.accessToken = token;

		const result = (await User.findByIdAndUpdate(
			user.id,
			{$set: {accessToken: token}},
			{new: true},
		)) as IUserDoc;

		// result.avatar = hostPrefix(result.avatar!);
		return res.status(200).json({
			accessToken: token,
			expireIn: 3600,
			user: result,
		});
	} catch (error) {
		next(error);
	}
};
/**
 * Sign up controller
 * @param req
 * @param res
 * @param next
 */
const signup = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = (await User.findOne({email: req.body.email})) as IUserDoc;
		if (user) throw new BadRequestError('Email already existed!');
		const newUser = new User(req.body);
		const result = await newUser.save();
		return res.status(201).json(result);
	} catch (error) {
		next(error);
	}
};

export {signin, signup};
