import mongoose, {Schema, Document} from 'mongoose';
import {IUserDoc, USER_TABLE} from './user';

export const PROFILE_TABLE = 'Profile';
export enum Gender {
	male = 'Male',
	female = 'Female',
	unknown = 'Unknown',
}
export enum Proficiency {
	beginer = 'Beginer',
	intermediate = 'Intermediate',
	expert = 'expert',
}
export interface ILanguage {
	code: string;
	name: string;
	options: {
		read: boolean;
		write: boolean;
		speak: boolean;
	}[];
}
export interface ISocial {
	youtube: string;
	twitter: string;
	facebook: string;
	linkedin: string;
	instagram: string;
}
export interface IEducation {
	instituteName: string; // kic
	degree: string; // BCA
	fieldOfStudy: string;
	current?: boolean;
	activityAndSocial?: string;
	from: Date | null;
	to?: Date | null;
	location?: string;
	summary?: string;
	grade?: string;
}
export interface IAward {
	title: string;
	rating: number;
	image?: string | null;
}
export interface IAddress {}
export interface IEmployment {
	company: string; // webshree
	designation: string; // designer
	summery?: string; // i love to work
	location: string; // delhi
	from: Date | null; // 2013
	to?: Date | null; // 2015
	current?: boolean; // false
	awards?: IAward[]; // ['best employe of the year']
	skills?: string[]; // ['html','css','photosho']
}
export interface ISkill {
	title: string;
	slug: string;
	active?: boolean;
}
export interface IProfile {
	user: string;
	dob: string;
	company: string;
	designation: string;
	summary: string;
	gender: Gender;
	exp: string;
	location: string;
	gitusername: string;
	qualification: string;
	website: string;
	resume?: string;
	active: boolean;
	social: ISocial;
	noticeperiod?: string;
	languages: ILanguage[];
	hobbies: string[];
	employment?: IEmployment[];
	education?: IEducation[];
	skills: ISkill[];
}
export interface IProfileDoc extends Document<IProfile>, IProfile {}

const schema = new Schema(
	{
		user: {type: Schema.Types.ObjectId, ref: USER_TABLE, required: true},
		company: {type: String, required: true},
		designation: {type: String, required: true},
		summary: {type: String, required: true, minlength: 0, maxlength: 500},
		gender: {
			type: String,
			required: true,
			default: Gender.unknown,
			enum: Gender,
		},
		dob: {type: Date, default: ''},
		exp: {type: String, default: ''},
		location: {type: String, default: ''},
		gitusername: {type: String, default: ''},
		qualification: {type: String, default: ''},
		website: {type: String, default: ''},
		resume: {type: String, default: ''},
		active: {type: Boolean, default: true},
		social: {
			youtube: {type: String, default: ''},
			twitter: {type: String, default: ''},
			facebook: {type: String, default: ''},
			linkedin: {type: String, default: ''},
			instagram: {type: String, default: ''},
		},
		noticeperiod: {type: String, default: ''},
		languages: [
			{
				code: {type: String},
				name: {type: String},
				options: [
					{
						read: {type: Boolean, default: false},
						write: {type: Boolean, default: false},
						speak: {type: Boolean, default: false},
					},
				],
			},
		],
		hobbies: {type: [String], default: []},
		skills: [
			{
				title: {type: String},
				proficiency: {
					type: String,
					default: Proficiency.beginer,
					enum: Proficiency,
				},
				rating: {
					type: Number,
					default: 0,
					enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
				},
			},
		],
		education: [
			{
				instituteName: {type: String},
				summary: {type: String, default: '', minlength: 0, maxlength: 500},
				degree: {type: String},
				fieldOfStudy: {type: String, default: ''},
				from: {type: Date, default: null},
				to: {type: Date, default: null},
				location: {type: String, default: null},
				activityAndSocial: {type: String, default: ''},
				grade: {type: String, default: ''},
				current: {type: Boolean, default: false},
			},
		],
		employment: [
			{
				company: {type: String, required: true},
				designation: {type: String, required: true},
				summery: {type: String, minLength: 0, maxLength: 120},
				location: {type: String},
				from: {type: Date, default: null},
				to: {type: Date, default: null},
				current: {type: Boolean, default: false},
				awards: [
					{
						title: {type: String, default: ''},
						rating: {type: Number, default: 0},
						image: {type: String, default: null},
					},
				],
				skills: [
					{
						language: {type: String},
						rating: {type: Number, default: 0},
						proficiency: {
							type: String,
							default: Proficiency.beginer,
							enum: Proficiency,
						},
					},
				],
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
	return this._id.toString();
});
export const Profile = mongoose.model<IProfileDoc>(PROFILE_TABLE, schema);
