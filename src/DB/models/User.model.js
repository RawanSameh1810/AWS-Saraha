import mongoose from 'mongoose';
import { systemRoles } from '../../Constants/Constants.js';
const UserSchema = new mongoose.Schema({
    username :{
        type : String ,
        required : true ,
        unique : [true , 'username is already taken'],
        trim : true ,
        minLength : [6 , 'username must be more than 5 characters'] ,
        maxLength : [20, 'The username should not exceed 20 characters'],
        lowercase : true
    } ,
    email : {
        type : String ,
        required : [true , "*required" ],
        unique : [true , "this Email is already taken"]
    },
    password : {
         type : String,
         required : [true , "*required"]
    },
    phone:{
       type : String,
       required : [true , "*required"]
    },
    age:{
        type : Number,
        required : [true , "*required" ],
        min : [18 , 'you must be at least 18 years old to register']
    },
    profileImage : String , //optional
    isDeleted : {
        type : Boolean ,
        default :false
    },
    isEmailVerified :{
        type : Boolean,
        default : false
    },
    role:{
       type : String ,
       default : systemRoles.USER ,
       enum : Object.values(systemRoles)
      }
    ,otp:String
} , {timestamps : true }) 
export const UserModel = mongoose.models.User || mongoose.model( 'User' , UserSchema ) //to avoid the error (model is already exists) 
// name of the model in the first condition must be the same at secound one