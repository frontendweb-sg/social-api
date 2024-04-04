import {Request, Response, NextFunction} from 'express';
import {Profile} from '../models/profile';

/**
 * Add education
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const addEducation = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = req.user?.id;
		const profileId = req.params.profileId;
		console.log(user, profileId, '----');
		const result = await Profile.findOneAndUpdate(
			{user, _id: profileId},
			{$push: {education: req.body}},
			{new: true},
		);

		return res.status(201).json(result?.education);
	} catch (error) {
		console.log('error', error);
		next(error);
	}
};

/**
 * Update education
 * @param req
 * @param res
 * @param next
 */
export const updateEducation = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = req.user?.id;
		const profileId = req.params.profileId;
		const educationId = req.params.educationId;

		const result = await Profile.findOneAndUpdate(
			{user, _id: profileId, 'education._id': educationId},
			{$set: {'education.$': req.body}},
			{new: true},
		);

		return res.status(200).json(result?.education);
	} catch (error) {
		next(error);
	}
};

/**
 * Education delete
 * @param req
 * @param res
 * @param next
 */
export const deleteEducation = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = req.user?.id;
		const profileId = req.params.profileId;
		const educationId = req.params.educationId;

		const result = await Profile.findOneAndUpdate(
			{user, _id: profileId, 'education._id': educationId},
			{
				$pull: {
					education: {
						_id: educationId,
					},
				},
			},
			{new: true},
		);

		return res.status(200).json(result?.education);
	} catch (error) {
		next(error);
	}
};
