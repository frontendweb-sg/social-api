declare namespace NodeJS {
	interface ProcessEnv {
		CLOUDINARY_NAME: string;
		CLOUDINARY_API_KEY: string;
		CLOUDINARY_SECRET_KEY: string;
		BASE_URL: string;
		SECRET_KEY: string;
		MONGODB_URL: string;
	}
}
export interface Media {
	public_id: string;
	secure_url: string;
	resource_type?: string;
	access_mode?: string;
	folder?: string;
	version?: string;
	signature: string;
}
