import {Request, Response, NextFunction} from 'express';
import {Profile} from '../models/profile';

/**
 * Add employment
 * @constructor
 * @param {req} req - Express request object
 * @param {res} res - Express response object
 * @param {next} next - Express NextFunctoion object
 */
export const addEmployment = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = req.user?.id;
		const profileId = req.params.profileId;
		const body = req.body;

		const result = await Profile.findOneAndUpdate(
			{user, _id: profileId},
			{$push: {employment: body}},
			{new: true},
		);

		return res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

/**
 * Update employment
 * @param {req} req - Express request object
 * @param {res} res - Express response object
 * @param {next} next - Express NextFunctoion object
 * @returns
 */
export const updateEmployment = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = req.user?.id;
		const profileId = req.params.profileId;
		const employmentId = req.params.employmentId;

		const result = await Profile.findOneAndUpdate(
			{
				user,
				_id: profileId,
				'employment._id': employmentId,
			},
			{
				$set: {
					'employment.$': req.body,
				},
			},
			{new: true},
		);
		return res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

/**
 * Delete employment
 * @param {req} req - Express request object
 * @param {res} res - Express response object
 * @param {next} next - Express NextFunctoion object
 */
export const deleteEmployment = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = req.user?.id;
		const profileId = req.params.profileId;
		const employmentId = req.params.employmentId;

		const result = await Profile.findOneAndUpdate(
			{user, _id: profileId, 'employment._id': employmentId},
			{
				$pull: {
					employment: {
						_id: employmentId,
					},
				},
			},
			{new: true},
		);
		return res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
