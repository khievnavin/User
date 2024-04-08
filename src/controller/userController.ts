import express from "express";
import { Request, Response } from "express";
import { authentication, random } from "../utils/const/authen";
import { generateVerificationToken } from "../utils/generateToken";
import { sendVerification } from "../utils/sendVerification";
import { UserService } from "../service/userservice";
import { saveToken } from "../service/userToken";
// import {generateToken} from '../utils/jwt'
import authenticateToken from "../routes/userRoute";
import { UserModel } from "../db/model/users";
import { generatedJWT } from "../utils/jwt";
import { JsonWebTokenError } from "jsonwebtoken";

const userservice = new UserService();

export class UserController {
  async register(req: express.Request, res: express.Response) {
    try {
      const { email, password, username } = req.body;

      if (!email || !password || !username) {
        return res.status(400).json({ message: "Please fill all fields" });
      }

      const existingUser = await userservice.getUserByEmail(email);

      if (existingUser) {
        return res
          .status(400)
          .json({ message: `Username: ${req.body.username} already exists ` });
      }

      const salt = random();
      const jwt = await generatedJWT(email);
      const user = await userservice.createUser({
        email,
        username,
        authentication: {
          jwt,
          salt,
          password: authentication(salt, password), //key value
        },
      });

      // Generate verification token
      const token = generateVerificationToken();

      // Send verification email
      sendVerification(email, token);
      await saveToken(user.id, token, await jwt);

      return res.status(200).json({
        message: `Create Successful , Name : ${req.body.username} , Please check your email to Verify, JWT : ${jwt}`,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const updatedUser = await userservice.verifyToken(token);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  // async register(req: express.Request, res: express.Response) {
  //   try {
  //     const { email, password, username } = req.body;

  //     if (!email || !password || !username) {
  //       return res.status(400).json({ message: "Please fill all fields" });
  //     }

  //     const existingUser = await userservice.getUserByEmail(email);

  //     if (existingUser) {
  //       return res.status(400).json({ message: "User already exists" });
  //     }

  //     const salt = random();
  //     const user = await userservice.createUser({
  //       email,
  //       username,
  //       authentication: {
  //         salt,
  //         password: authentication(salt, password) //key value
  //       },
  //     });

  //     // const token = generateVerificationToken();
  //     // sendVerification(email, token);

  //     const token = generateVerificationToken(user.id)
  //     sendVerification(email, token);
  //     await saveToken(user.id, token)

  //     // Update the user's verification status to true if the token is valid
  //     // const verified = await userservice.verifyTokenAndSetVerificationStatus(token, user.id);

  //     return res.status(200).json({ message: "Create  Successful" }).end(user);
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).json({ message: "Internal server error" });
  //   }
  // }
  // async verifyTokenAndSetVerificationStatus(token: string, userId: string): Promise<boolean> {
  //   try {
  //       // Verify the token
  //       const verifiedUserId = await verifyTokenAndGetUserId(token);

  //       // Check if the verified user ID matches the provided user ID
  //       if (verifiedUserId !== userId) {
  //           console.log("Invalid token or user ID mismatch");
  //           return false;
  //       }

  //       // Update the user's verification status to true in the database
  //       const updatedUser = await userservice.updateVerificationStatus(userId, true);

  //       if (!updatedUser) {
  //           console.log("Failed to update verification status");
  //           return false;
  //       }

  //       return true;
  //   } catch (error) {
  //       console.error("Error verifying token and setting verification status:", error);
  //       return false;
  //   }
  // }

  async getAllUsers(req: express.Request, res: express.Response) {
    try {
      const users = await userservice.getAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
  }

  async login(req: express.Request, res: express.Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.sendStatus(400);
      }

      const user = await userservice.getUserByEmail(email);

      if (!user) {
        return res.sendStatus(400);
      }

      const expectedHash = authentication(
        user.authentication.salt,
        password
      );

      if (user.authentication.password !== expectedHash) {
        return res.sendStatus(404);
      }

      const salt = random();
      user.authentication.sessionToken = authentication(
        salt,
        user._id.toString()
      );

      await user.save();

      res.cookie("NAVIN-AUTH", user.authentication.sessionToken, {
        domain: "localhost",
        path: "/",
      });

      return res
        .status(200)
        .json({ message: `Username: ${req.body.username}, Login Successful` })
        .end();
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
  }

  async deleteUser(req: express.Request, res: express.Response) {
    try {
      const { id } = req.params;
      const deletedUser = await userservice.deleteUserById(id);
      return res.json(deletedUser);
    } catch (error) {
      console.log(error);
      return res.sendStatus(404);
    }
  }

  //   async deleteToken(queryToken: string){
  //     try {
  //         // Assuming you have a User model or interface with a field for tokens
  //         const user = await UserModel.findOneAndUpdate(
  //             { queryToken }, // Find user by token
  //             { $unset: { token: 1 } }, // Unset token field
  //             { new: true } // Return updated document
  //         );

  //         if (!user) {
  //             throw new Error('User not found');
  //         }

  //         return user;
  //     } catch (error) {
  //         throw new Error(`Failed to delete token: ${error.message}`);
  //     }
  // }
}

////=================================================================
// import express from 'express';
// import { Route, Controller, Get, Post, Delete, Request, Response, Path, Body } from 'tsoa';
// import { deleteUserById, getUser } from '../db/model/users';
// import { createUser, getUserByEmail, getUserById } from "../db/model/users";
// import { authentication, random } from "../utils/const/authen";
// import { generateVerificationToken } from '../utils/generateToken'
// import { sendVerification } from '../utils/sendVerification';
// // import { generateToken } from '../utils/jwt';
// // import {Token} from '../db/model/tokendb'
// import {saveToken} from '../service/userToken'

// //getAllUsers
// export const getAllUsers = async (req: express.Request, res: express.Response) => {
//     try{
//         const users = await getUser();

//         return res.status(200).json(users);

//     }catch(error){
//         console.log(error);
//         return res.sendStatus(400);
//     }
// }

// //deleteUsers
// export const deleteUser = async (req: express.Request, res: express.Response) =>{
//     try{
//         const {id} = req.params;

//         const deletedUser = await deleteUserById(id);

//         return res.json(deletedUser);
//     }catch(error){
//         console.log(error);
//         return res.sendStatus(400);
//     }

// }

// //Login
// export const login = async (req: express.Request, res: express.Response) => {
//     try {
//       const { email, password } = req.body;

//       if (!email || !password) {
//         return res.sendStatus(400);
//       }
//       const user = await getUserByEmail(email).select(
//         "+ authentication.salt + authentication.password"
//       );

//       if (!user) {
//         return res.sendStatus(400);
//       }

//       const expectedHash = authentication(user.authentication.salt, password);

//       if (user.authentication.password !== expectedHash) {
//         return res.sendStatus(404);
//       }

//       const salt = random();
//       user.authentication.sessionToken = authentication(salt, user._id.toString());

//       await user.save();

//       res.cookie('NAVIN-AUTH', user.authentication.sessionToken, {domain: 'localhost', path: '/' });

//       return res.status(200).json(user).end();

//     } catch (error) {
//       console.log(error);
//       return res.sendStatus(400);
//     }
//   };

// //Register
//   export const register = async (req: express.Request, res: express.Response) => {
//     try {
//       const { email, password, username } = req.body;

//       if (!email || !password || !username) {
//         return res.status(400).json({ message: "Please fill all fields" });
//       }
//       const existingUser = await getUserByEmail(email);

//       if (existingUser) {
//         return res.status(400).json({ message: "User already exists" });
//       }

//       const salt = random();
//       const user = await createUser({
//         email,
//         username,
//         authentication: {
//           salt,
//           password: authentication(salt, password),
//         },
//       });
//       const token = generateVerificationToken();
//       sendVerification(email, token);

//       return res.status(200).end(user);
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   };
// //Uopdate
// // export const update

// ////=====================================================

// // import express from 'express';
// // import { Controller, Get, Post, Delete, Route, Request, Response, Path, Body } from 'tsoa';
// // import { deleteUserById, getUser, createUser, getUserByEmail, getUserById } from '../db/model/users';
// // import { authentication, random } from '../service/authen';

// // @Route('users')
// // export class UsersController extends Controller {

// //     @Get()
// //     public async getAllUsers(): Promise<any> {
// //         try {
// //             const users = await getUser();
// //             return this.setStatus(200).json(users);
// //         } catch (error) {
// //             console.log(error);
// //             this.setStatus(400);
// //             return { message: 'Error fetching users' };
// //         }
// //     }

// //     @Delete('{id}')
// //     public async deleteUser(@Path() id: string): Promise<any> {
// //         try {
// //             const deletedUser = await deleteUserById(id);
// //             return deletedUser; // Returning the deleted user
// //         } catch (error) {
// //             console.log(error);
// //             this.setStatus(400);
// //             return { message: 'Error deleting user' };
// //         }
// //     }

// //     @Post('login')
// //     public async login(@Body() requestBody: { email: string, password: string }, @Request() req: express.Request, @Response() res: express.Response): Promise<any> {
// //         try {
// //             const { email, password } = requestBody;

// //             if (!email || !password) {
// //                 return this.setStatus(400).end();
// //             }

// //             const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

// //             if (!user) {
// //                 return this.setStatus(400).end();
// //             }

// //             const expectedHash = authentication(user.authentication.salt, password);

// //             if (user.authentication.password !== expectedHash) {
// //                 return this.setStatus(404).end();
// //             }

// //             const salt = random();
// //             user.authentication.sessionToken = authentication(salt, user._id.toString());

// //             await user.save();

// //             res.cookie('NAVIN-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' });

// //             return this.setStatus(200).json(user); // Returning user as JSON
// //         } catch (error) {
// //             console.log(error);
// //             return this.setStatus(400).end();
// //         }
// //     }

// //     @Post('register')
// //     public async register(@Body() requestBody: { email: string, password: string, username: string }): Promise<any> {
// //         try {
// //             const { email, password, username } = requestBody;

// //             if (!email || !password || !username) {
// //                 return this.setStatus(400).json({ message: 'Please fill all fields' });
// //             }

// //             const existingUser = await getUserByEmail(email);

// //             if (existingUser) {
// //                 return this.setStatus(400).json({ message: 'User already exists' });
// //             }

// //             const salt = random();
// //             const user = await createUser({
// //                 email,
// //                 username,
// //                 authentication: {
// //                     salt,
// //                     password: authentication(salt, password),
// //                 },
// //             });

// //             return this.setStatus(200).json(user); // Returning user as JSON
// //         } catch (error) {
// //             console.log(error);
// //             return this.setStatus(500).json({ message: 'Internal server error' });
// //         }
// //     }
// // }
