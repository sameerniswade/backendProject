import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

//middelware app.use

//cors
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: '16kb' })); // allow data limit of 16kb of any form
app.use(express.urlencoded({ extended: true, limit: '16kb' })); // url parameters all with encoding
app.use(express.static('public')); // store static files

//cookies
app.use(cookieParser());

//routes import
import userRouter from './routes/user.route.js';

//routes declaration
app.use('/api/v1/users', userRouter);

export { app };
