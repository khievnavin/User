// import bcrypt from "bcrypt";
// import { randomBytes } from "crypto";

// export function generateToken (userId: number){
//     const generateDate = (expiresIn = 50000) =>{
//         const token = randomBytes(32).toString("hex");
//         const expiresAt = Date.now() + expiresIn;
//         return { token, expiresAt };
//     };
//     const {token , expiresAt} = generateDate(50000);
//     console.log("Generated token: ", token);
//     console.log("Token expires at:", new Date(expiresAt));
//     return token;
// }

//============================================================================

import jwt from "jsonwebtoken";
const SECRET_KEY = "NAVIN";
const JWT_EXPIRATION_TIME = "1m";

export async function generatedJWT(email: string): Promise<string> {
  const jwtToken = jwt.sign({email}, SECRET_KEY, {
    expiresIn: JWT_EXPIRATION_TIME,
  });

  return jwtToken;
}
