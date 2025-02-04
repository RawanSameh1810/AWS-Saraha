import { compareSync, hashSync } from "bcrypt";
import { decryption, Encryption } from "../../../../utils/encryption.utils.js";
import { UserModel } from "../../../DB/models/User.model.js"
import { BlackListModel } from "../../../DB/models/Black-List-tokens.model.js";
import jwt from "jsonwebtoken"
import { emitter } from "../../../services/send-email.service.js";
export const UserProfile = async(req ,res) => {
       const {_id}= req.authenticatedUser;
       const user = await UserModel.findById(_id)
       if(!user)
           return res.status(404).json({message : 'User not found'});
       user.phone = await decryption({cipher : user.phone , secretkey : process.env.ENCRYPTED_KEY})
       return res.status(200).json({message : 'User found succesfully' , user});}

export const UpdatePassword = async(req ,res) => {
          const {_id}= req.authenticatedUser;
          const {oldpassword , Newpassword , confirmPassword} = req.body
          if (Newpassword != confirmPassword)
            return res.status(400).json({message : "password and confirmpassword must match!"})
          const user = await UserModel.findById(_id)
          const isMatched = compareSync (oldpassword , user.password)
           if (!isMatched)
            return res.status(400).json({message : "Invalid password"})
          const hashPassword = hashSync(Newpassword , +process.env.SALT)
          user.password = hashPassword;
          await user.save();
          await BlackListModel.create(req.authenticatedUser.token)
          return res.status(201).json({message : "Password is Updated Successfully"})
   }

export const UpdateProfile = async (req , res) => {
        const {_id} = req.authenticatedUser;
        const{email , phone , username} = req.body;
        const user = await UserModel.findById(_id)
        if(!user)
            return res.status(404).json({message : 'User not found'});
        if (username) 
                user.username = username
        if(phone)
            user.phone = Encryption({value : phone , secretkey : process.env.ENCRYPTED_KEY})
        if (email){
            const IsExists = await UserModel.findOne({email})
            if (IsExists)  
                return res.status(409).json({message : 'This Email is already exists'})
            const token = jwt.sign({email},process.env.JWT_SECRET,{expiresIn : 50})
            const confirmEmailLink = `${req.protocol}://${req.headers.host}/auth/verify/${token}`
            emitter.emit('sendEmail' , {
               to : email ,
               subject : "Saraha-App" ,
               html : `<h1>Verify your email</h1>
               <a href= "${confirmEmailLink}"> Click to verify <a>`})
        }
        user.email = email;
        user.isVerfied = false;
        await user.save();
        return res.status(200).json({message : "profile is updated successfully"})
    }

export const ListUsers = async(req , res ) => {
        const users = await UserModel.find();
        return res.status(200).json({message : "users:" , users})
    }
   