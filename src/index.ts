import {config} from 'dotenv';
import path from 'path';
config({path: `.env.${process.env.NODE_ENV}`});
import express, {Request, Response, NextFunction} from 'express';
import cors from 'cors';
import {connectDb} from './db';
import {authRoute} from './routes/auth';
import {errorHandler} from './middleware/error-handler';
import {postRoute} from './routes/post';
// app
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors());

console.log(path.resolve(__dirname, 'uploads'));
app.use(express.static('public'));
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

app.use((req: Request, res: Response, next: NextFunction) => {
	res.locals.baseUrl = process.env.BASE_URL;
	next();
});

// routes
app.use('/api/auth', authRoute);
app.use('/api/post', postRoute);

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
	console.log('Received shutdown signal. Closing server...');

	// Close the server to stop accepting new connections
	server.close(() => {
		console.log('Server closed. Closing remaining connections...');

		// Close remaining connections gracefully
		// Additional cleanup tasks can be performed here

		console.log('All connections closed. Exiting process.');
		process.exit(0);
	});
}

module.exports = app;
