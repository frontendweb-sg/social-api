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
		const result = await cloudinary.uploader.destroy(
			public_id,
			options,
			callback,
		);
		console.log(result, 'result delete', public_id);
		return result;
	} catch (error) {
		throw error;
	}
};
