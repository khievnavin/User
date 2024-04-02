import express, { Router } from 'express';
import { deleteUser, getAllUsers } from '../controller/userController';
import { isAuthenticated ,isOwner } from '../middleware/usermiddleware';

export default (router: express.Router) =>{
    router.get('/users', isAuthenticated , getAllUsers);
    router.delete('/users/:id',  deleteUser);

};