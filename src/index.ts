import express, {} from 'express';
import  http  from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
// import { Router } from './routes/user'
import swaggerUi from 'swagger-ui-express';
import Router from './routes/userRoute'; 
import authRouter from './routes/authRoute';
require('dotenv').config();
const app = express();

const Port = process.env.PORT ;
app.use(cors({
    credentials : true,
}))

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/', authRouter)

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//=========================Server============================
app.use('/',Router );
const server = http.createServer(app);


const MONGO_URL = 'mongodb+srv://navin:navin@navin.bpmheu9.mongodb.net/?retryWrites=true&w=majority&appName=Navin';

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error',(error:Error) => console.log(error));


server.listen(Port,() => {
    console.log('Connecting to server');
    console.log('Server is running on http://localhost:8080');
});