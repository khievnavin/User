import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  // verificationToken:{
  //   type: String,
  //   default: null,
  // },
  authentication: {
    password: {
      type: String,
      required: true,
      selected: false,
    },
    salt: {
      type: String,
      select: false,
    },
    sessionToken: {
      type: String,
      select: false,
    },
  },
});

export const UserModel = mongoose.model("User", UserSchema);

// //getUser
// export const getUser = () => UserModel.find();

// //getUserByEmail
// export const getUserByEmail = (email: string) => UserModel.findOne({ email });

// //getUserBysessionToken
// export const getUserBySessionToken = (sessionToken: string) =>
//   UserModel.findOne({
//     "authentication.sessionToken": sessionToken,
//   });

//   //getUserById
// export const getUserById = (id: string) => UserModel.findOne({ id });

// //createUser
// // export const createUser = (values: Record<string, any>) =>
// //   new UserModel(values).save().then((user) => user.toObject());
// export const createUser = (values: Record<string, any>) =>
//   new UserModel({ ...values, isVerified: false }).save().then((user) => user.toObject());

//   //deleteUserById  
// export const deleteUserById = (id: string) =>
//   UserModel.findOneAndDelete({ _id: id });

//   //updateUSerById  
// export const updateUserById = (id: string, values: Record<string, any>) =>
//   UserModel.findOneAndDelete({ id, values });

  