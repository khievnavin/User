// import express from 'express';
// import axios from 'axios';
// import { generateVerificationToken } from '../utils/generateToken';
// import { UserModel } from '../db/model/users';
// import { random } from 'lodash';
// require ('dotenv').config();


// const authRouter = express.Router();

// const CLIENT_ID = process.env.CLIENT_ID;
// const CLIENT_SECRET = process.env.CLIENT_SECRET;
// const REDIRECT_URI = process.env.REDIRECT_URI;

// // Initiates the Google Login flow
// authRouter.get('/auth/google', (req, res) => {
//   const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
//   res.redirect(url);
// });

// // Callback URL for handling the Google Login response
// authRouter.get('/auth/google/callback', async (req, res) => {
//   const { code } = req.query;

//   try {
//     // Exchange the authorization code for access and ID tokens
//     const { data } = await axios.post('https://oauth2.googleapis.com/token', {
//       client_id: CLIENT_ID,
//       client_secret: CLIENT_SECRET,
//       code,
//       redirect_uri: REDIRECT_URI,
//       grant_type: 'authorization_code',
//     });

//     const { access_token } = data;

//     // Use access_token to fetch user profile
//     const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
//       headers: { Authorization: `Bearer ${access_token}` },
//     });

//     // Check if user already exists in the database based on email
//     let user = await UserModel.findOne({ email: profile.email });

//     if (user) {
//       throw new Error("Email already exists, please sign up with another account.");
//     }

//     // Create a new user if not found
//     const randomPassword = random(100000, 999999).toString();
//     const newUser = new UserModel({
//       googleId: profile.id, 
//       username: profile.name,
//       email: profile.email,
//       isVerified: true, // Assuming Google OAuth is verified
//       authentication:{
//         password: profile.password,

//       }
//     });

//     await newUser.save();
//     const token = generateVerificationToken();
//     return res.json(token);
//     // Redirect after successful authentication
//     // res.redirect('/users');
//   } catch (error) {
//     console.error("Error:", error.response ? error.response.data : error.message); // Log the error for debugging
//     res.redirect('/login'); // Redirect to login page on error
//   }
// });

// export default authRouter;
