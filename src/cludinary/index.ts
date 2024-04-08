import {
	DeliveryType,
	ResourceType,
	ResponseCallback,
	UploadApiOptions,
	UploadApiResponse,
	v2 as cloudinary,
} from 'cloudinary';
import {BadRequestError} from '../errors';

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_SECRET_KEY,
	secure: true,
});

const DEFAULT_OPTIONS: UploadApiOptions = {
	resource_type: 'image',
	overwrite: true,
	invalidate: true,
};

export const uploadImage = async (
	filePath: string,
	options = DEFAULT_OPTIONS,
): Promise<UploadApiResponse> => {
	return await new Promise(async (resolve, reject) => {
		return await cloudinary.uploader.upload(
			filePath,
			options,
			(error, result) => {
				if (result && result.public_id) {
					return resolve(result);
				}

				return new BadRequestError(error?.message!);
			},
		);
	});
};

export const deleteImage = async (
	public_id: string,
	options: UploadApiOptions,
): Promise<UploadApiResponse> => {
	return await new Promise(async (resolve, reject) => {
		return await cloudinary.uploader.destroy(
			public_id,
			options,
			(error, result) => {
				if (result && result.public_id) {
					return resolve(result);
				}

				return reject(error?.message);
			},
		);
	});
};

/**
 * Delete upload file
 * @param public_id
 * @param options
 * @param callback
 * @returns
 */
export const deleteUploadFile = async (
	public_id: string,
	options?: {
		resource_type?: ResourceType;
		type?: DeliveryType;
		invalidate?: boolean;
	},
	callback?: ResponseCallback,
) => {
	try {
		return await cloudinary.uploader.destroy(public_id, options, callback);
	} catch (error) {
		throw error;
	}
};
