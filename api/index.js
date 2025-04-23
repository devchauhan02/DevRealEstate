import express from 'express';
import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json()); // allow json as the input of the server
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO).then(() => {
    console.log('MongoDB connected successfully!!');
  })
  .catch((err) => {   
    console.log('MongoDB connection failed!!');
    console.log(err);
  });  


const PORT = process.env.PORT || 5000;

app.use('/api/user', userRoute)
app.use('/api/auth', authRoute)
app.use((err , res) => {
  const statusCode = err.status || 500;
  const message = err.message || 'Internal server error';
  return res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

