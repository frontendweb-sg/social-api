interface UserPayload {
	id: string;
	email: string;
}

declare namespace Express {
	interface Request {
		user?: UserPayload;
	}
}

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
