import express, { Router, Request, Response ,NextFunction } from 'express';
import { UserController } from '../controller/userController';
import { isAuthenticated ,isOwner } from '../middleware/usermiddleware';

import jwt, { JwtPayload } from 'jsonwebtoken';

const userController = new UserController();
export default (router: express.Router) =>{
    router.get('/users', isAuthenticated , userController.getAllUsers);
    router.delete('/users/:id',  userController.deleteUser);
    router.post('/users/verified', async (req:Request, res: Response, _next: NextFunction) =>{
        try{
            const  queryTokne = req.query.token as string;
            const response = await userController.verifyToken(queryTokne)
            
            res.json({
                message: 'successfully',
                user: response
            });
        }catch(error){
            _next(error)
        };
    });

};
  
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
  
    // Extracting token from authorization header
    const token = authHeader && authHeader.split("")[1];
  
    // Checking if the token is null
    if (!token) {
      return res.status(401).send("Authorization failed. No access token.");
    }
    // Verifying if the token is valid.
    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: JwtPayload | undefined) => {
      
      next();
    });
  };
