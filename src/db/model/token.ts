import mongoose from "mongoose";
import { Schema } from "mongoose";

const tokenSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId ,  require: true},
    token: { type: String, required: true}          
    
    
});
const Token=mongoose.model("token", tokenSchema)
export default Token;