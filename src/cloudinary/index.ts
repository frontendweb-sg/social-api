import {
	DeliveryType,
	ResourceType,
	ResponseCallback,
	UploadApiOptions,
	UploadResponseCallback,
	v2 as cloudinary,
} from 'cloudinary';

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_SECRET_KEY,
	secure: true,
});

/**
 * Upload file
 * @param filePath
 * @param options
 * @param callback
 * @returns
 */
export const uploadFile = async (
	filePath: string,
	options?: UploadApiOptions,
	callback?: UploadResponseCallback,
) => {
	try {
		return await cloudinary.uploader.upload(filePath, options, callback);
	} catch (error) {
		throw error;
	}
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
