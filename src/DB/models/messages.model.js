import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
    body : {
      type : String ,
      required : true 
    },
    ownerid : {
     type : mongoose.Schema.Types.ObjectId ,
     ref : 'User' 
    }
},{timestamps : true})
export const MessageModel = mongoose.models.message || mongoose.model( 'message' , messageSchema ) 