import express from 'express';
import authentication from './authe';
import userRoute from './userRoute';

const router = express.Router();

export default(): express.Router =>{
    authentication(router);
    userRoute(router);

    return router;
}