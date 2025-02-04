import { MessageModel } from '../../../DB/models/messages.model.js';
import {UserModel} from '../../../DB/models/User.model.js'
export const SendMessages = async(req ,res) =>{
   const{body , ownerid} = req.body;
   const user = await UserModel.findById(ownerid)
   if(!user)
    return res.status(404).json({message : "user is not found"})
   await MessageModel.create({body , ownerid})
   res.status(201).json({message : "Message is sent successfully"})
}

export const GetMessages = async(req , res) =>{
    const messages = await MessageModel.find({}).populate([{path : 'ownerid' , select : '-password -__v'}])
    res.status(200).json({message : "messages" , messages})
}

export const MyMessages = async(req , res) =>{
    const{_id} = req.authenticatedUser ;
    const messages = await MessageModel.find({ownerid : _id})
    res.status(200).json({message : "messages" , messages})
}