import express from 'express';
import { UserController} from '../controller/userController';
 
const userController = new UserController();

export default (router: express.Router) =>{
    router.post('/auth/register',userController.register);
    router.post('/auth/login',userController.login);
};