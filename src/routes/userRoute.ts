import express, { Router } from 'express';
import { UserController } from '../controller/userController';
import { isAuthenticated ,isOwner } from '../middleware/usermiddleware';


const userController = new UserController();
export default (router: express.Router) =>{
    router.get('/users', isAuthenticated , userController.getAllUsers);
    router.delete('/users/:id',  userController.deleteUser);

};