import express, {  Request, Response ,NextFunction } from 'express';
import { UserController } from '../controller/userController';
import { isAuthenticated ,isOwner } from '../middleware/usermiddleware';
import  {generatedJWT} from '../utils/jwt'



import jwt, { JwtPayload } from 'jsonwebtoken';
const Router = express.Router()

const userController = new UserController();

    Router.get('/users', isAuthenticated , userController.getAllUsers);
    Router.delete('/users/:id',  userController.deleteUser);
    Router.post('/users/register',userController.register);
    Router.post('/users/login', userController.login );

    Router.get('/users/verify', async (req:Request, res: Response, _next: NextFunction) =>{
        try{

            // res.json({
            //     message: "vath"
            // })


            const  queryToken = req.query.token as string;
            console.log(queryToken)
            const response = await userController.verifyToken(queryToken)
            res.json({
                message:  `Verified successfully`
            });
          await response.deleteOne(queryToken) 
        }catch(error){
            _next(error)
        };
    });

export default Router
  
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
