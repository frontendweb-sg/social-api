import {config} from 'dotenv';
import path from 'path';
config({path: `.env.${process.env.NODE_ENV}`});
import express, {Request, Response, NextFunction} from 'express';
import cors from 'cors';
import {connectDb} from './db';
import {authRoute} from './routes/auth';
import {errorHandler} from './middleware/error-handler';
import {postRoute} from './routes/post';
import {profileRoute} from './routes/profile';
import {userRoute} from './routes/user';

// app
const app = express();
const PORT = process.env.PORT || 3001;

app.set('title', 'shopkart-api');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({extended: true, limit: '25mb'}));
app.use(express.static('public'));

app.use(cors());

app.use((req: Request, res: Response, next: NextFunction) => {
	res.locals.baseUrl = process.env.BASE_URL;
	next();
});

// routes
app.use('/api/auth', authRoute);
app.use('/api/post', postRoute);
app.use('/api/user', userRoute);
app.use('/api/profile', profileRoute);

// errors
app.use(errorHandler);

// listen
const server = app.listen(PORT, async () => {
	await connectDb();
	console.log('Server is running....');
});

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

function gracefulShutdown() {
	server.close(() => {
		process.exit(0);
	});
}

module.exports = app;
