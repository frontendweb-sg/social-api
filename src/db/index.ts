import mongoose from 'mongoose';

export const connectDb = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URL!);
		console.log('DATABASE CONNECTED!');
	} catch (error) {
		console.log('Mongodb error', error);
	}
};
