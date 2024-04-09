export interface Media {
	public_id: string;
	url: string;
	resource_type?: string;
	access_mode?: string;
	folder?: string;
	version?: string;
	signature: string;
}

export type PostFileType = {
	images: Express.Multer.File[];
	videoUrl: Express.Multer.File[];
};
