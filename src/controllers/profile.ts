import {Request, Response, NextFunction} from 'express';
import {IProfileDoc, Profile} from '../models/profile';
import {BadRequestError} from '../errors';

export const getProfile = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = req.user?.id;
		const profile = (await Profile.findOne({user})) as IProfileDoc;

		return res.status(200).json(profile);
	} catch (error) {}
};

/**
 * Create user profile
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const addProfile = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = req.user?.id;
		const body = req.body;
		body.user = user;

		const profile = await Profile.findOne({
			user,
		});

		if (profile) {
			throw new BadRequestError('Profile already existed, please update');
		}

		const newProfile = new Profile(body);
		const result = await newProfile.save();
		return res.status(201).json(result);
	} catch (error) {
		console.log('E', error);
		next(error);
	}
};

/**
 * Update user profile
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const updateProfile = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = req.user?.id;
		const profileId = req.params.profileId;
		const body = req.body;

		const profile = await Profile.findOne({
			user,
		});

		if (!profile)
			throw new BadRequestError('Profile not existed!, pelase create');

		const result = await Profile.findOneAndUpdate(
			{user, _id: profileId},
			{$set: body},
			{new: true},
		);
		return res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const getGithubProfile = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = req.user?.id;
		const profileId = req.params.profileId;
		const body = req.body;
	} catch (error) {
		next(error);
	}
};
