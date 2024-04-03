import mongoose, {Schema, Document} from 'mongoose';
import {USER_TABLE} from './user';

export const POST_TABLE = 'Post';
export enum Status {
	Approved = 'approved',
	Rejected = 'rejected',
	Pending = 'pending',
}
export interface ILike {
	user: Schema.Types.ObjectId;
	active: boolean;
}

export interface IComment {
	_id?: string;
	user: Schema.Types.ObjectId;
	message: string;
	status: Status;
	createdAt?: Date;
}
export interface IFriends {
	user: Schema.Types.ObjectId;
	status: Status;
	createdAt?: Date;
}
export interface IPost {
	user: Schema.Types.ObjectId;
	content: string;
	images: string[];
	code?: string;
	videoUrl?: string;
	active: boolean;
	comments: IComment[];
	likes: ILike[];
	tags: string[];
	status: Status;
	friendRequests: IFriends[];
}
export interface IPostDoc extends Document<IPost>, IPost {}
const schema = new Schema(
	{
		user: {type: Schema.Types.ObjectId, required: true, ref: USER_TABLE},
		content: {type: String, default: ''},
		images: {type: [String], default: []},
		code: {type: String, default: ''},
		videoUrl: {type: String, default: ''},
		active: {type: Boolean, default: true},
		tags: {type: [String], default: []},
		status: {type: String, default: Status.Approved, enum: Status},
		comments: [
			{
				user: {type: Schema.Types.ObjectId, ref: USER_TABLE},
				message: {type: String, default: ''},
				status: {type: String, default: Status.Pending, enum: Status},
				createdAt: {type: Date, default: Date.now()},
			},
		],
		likes: [
			{
				user: {type: Schema.Types.ObjectId, ref: USER_TABLE},
				active: {type: Boolean, default: false},
			},
		],
		friendRequests: [
			{
				user: {type: Schema.Types.ObjectId, ref: USER_TABLE},
				status: {type: String, default: Status.Pending, enum: Status},
				createdAt: {type: Date, default: Date.now()},
			},
		],
	},
	{
		timestamps: true,
		id: true,
		toJSON: {
			virtuals: true,
			transform(doc, ret) {
				delete ret.__v;
			},
		},
	},
);

schema.virtual('id').get(function () {
	return this._id.toHexString();
});

export const Post = mongoose.model<IPostDoc>(POST_TABLE, schema);
