import {UserModel}  from '../db/model/users'; // Import your User model here
import { UserRepository } from '../db/model/repository/userRepo';
import Token from '../db/model/token';
export class UserService {
    private userRepository: UserRepository;
    constructor() {
        this.userRepository = new UserRepository();
    }
  // Get all users
  async getAllUsers() {
    try {
      return await UserModel.find();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  // Get user by email
  async getUserByEmail(email: string) {
    try {
      return await UserModel.findOne({ email }).select("+authentication.salt +authentication.password");
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw new Error('Failed to fetch user by email');
    }
  }


  // Get user by session token
  async getUserBySessionToken(sessionToken: string) {
    try {
      return await UserModel.findOne({ "authentication.sessionToken": sessionToken });
    } catch (error) {
      console.error('Error fetching user by session token:', error);
      throw new Error('Failed to fetch user by session token');
    }
  }

  // Get user by ID
  async getUserById(id: string) {
    try {
      return await UserModel.findOne({ _id: id });
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw new Error('Failed to fetch user by ID');
    }
  }

  // Create a new user
  async createUser(values: Record<string, any>) {
    try {
      return await new UserModel({ ...values, isVerified: false }).save();
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  // Delete user by ID
  async deleteUserById(id: string) {
    try {
      return await UserModel.findOneAndDelete({ _id: id });
    } catch (error) {
      console.error('Error deleting user by ID:', error);
      throw new Error('Failed to delete user by ID');
    }
  }

  // Update user by ID
  async updateUserById(id: string, values: Record<string, any>) {
    try {
      return await UserModel.findByIdAndUpdate(id, values, { new: true });
    } catch (error) {
      console.error('Error updating user by ID:', error);
      throw new Error('Failed to update user by ID');
    }
  }
  
    async verifyToken(token: string): Promise<any> {
      try {
       const isTokenExits:any = await Token.findOne({token: token});
        console.log(isTokenExits)
       if(!isTokenExits){
        throw new Error('token is not found')
       }

       const user = await UserModel.findOne({_id: isTokenExits.userId});

       if(!user){
        throw new Error('user is not found');
       }
       user.isVerified = true;
        await user.save();

        return user;
      } catch (error) {
        console.error("Error verifying token and setting verification status:", error);
        return false;
      }
    }
  //   async updateVerificationStatus(userId: string, verified: boolean): Promise<any> {
  //     try {
  //         // Find the user by ID and update the verification status
  //         const updatedUser = await UserModel.findByIdAndUpdate(userId);

  //         if (!updatedUser) {
  //             console.log("User not found");
  //             return false;
  //         }
  //        updatedUser.isVerified = true;
  //         return  updatedUser
          
  //     } catch (error) {
  //         console.error("Error updating verification status:", error);
  //         return false;
  //     }
  // }
  



}
//   async verifyUser (token : string) :{
//     const isToekn: await this.tok
