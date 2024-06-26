import express from 'express';
import {get, merge} from 'lodash';
import { UserService } from '../service/userservice';

const userservice = new UserService();

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) =>{
    try{
        const {id} = req.params;
        const currentUserId = get(req, 'identity._id') as string;

        if(!currentUserId){
            return res.sendStatus(403);
        }
        if(currentUserId !== id){
            return res.sendStatus(403);
        }

        next();
    }catch(error){
        console.log(error);
        return res.sendStatus(404);
    }
};

export const  isAuthenticated = async (req: express.Request , res: express.Response , next: express.NextFunction)=>{
    try{
        const sessionToken = req.cookies['NAVIN'];

        if(!sessionToken){
            return res.sendStatus(403);
        }

        const existingUser = await userservice.getUserBySessionToken(sessionToken);

        if(!existingUser){
            return res.sendStatus(403);
        }

        merge(req,{identity: existingUser});

        return next();
        
    }catch(error){
        console.error(error);
        return res.sendStatus(400);
    }
}