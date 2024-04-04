// require('dotenv').config({path: './env'})
import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';
dotenv.config({ path: './env' });

connectDB()
  .then(() => {
    const server = app.listen(process.env.PORT, () => {
      console.log(`Server is running on port : ${process.env.PORT}`);
    });

    server.on('error', (error) => {
      console.log('something wrong with express ERROR : ', error);
    });
  })
  .catch((error) => {
    console.log('MongoDB Connection failed ERROR:', error);
  });

// import express from "express";
// const app = express()
// ;(async() => {
//     try{
//       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)

//       app.on("error", (error) => {
//         console.log("express not abt to connect", error)
//         throw error;
//       })

//       app.listen(process.env.PORT, () => {
//         console.log(`App is listening on PORT ${process.env.PORT}`)
//       })
//     }catch(error) {
//         console.log("ERROR :", error)
//     }
// })()
