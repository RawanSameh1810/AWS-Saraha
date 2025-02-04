import { compareSync, hashSync } from 'bcrypt'
import {UserModel} from '../../../DB/models/User.model.js'
import { Encryption ,decryption} from '../../../../utils/encryption.utils.js'
import { emitter } from '../../../services/send-email.service.js' 
import jwt from 'jsonwebtoken'
import path from 'path' ;
import { BlackListModel } from '../../../DB/models/Black-List-tokens.model.js'
import { v4 as uuidv4 } from 'uuid' 
 export const SignUp = async(req,res) => {
        const {username , email , password , confirmpassword , phone , age } = req.body
        if (password !== confirmpassword )
            return res.status(400).json({message: 'password and confirmpassword does not match'})
        const IsExists = await UserModel.findOne({email})
        if (IsExists)  
            return res.status(409).json({message : 'This Email is already exists'})
         const hashpassword = hashSync(password , +process.env.SALT) //this hash must be stored in the database because we ensure data integrity in our database and also security wise for user i don't have te right to show his password
         const encryptedphone = await Encryption ({value : phone , secretkey :process.env.ENCRYPTED_KEY})
         const token = jwt.sign({email},process.env.JWT_SECRET,{expiresIn : 50})
         const confirmEmailLink = `${req.protocol}://${req.headers.host}/auth/verify/${token}`
         emitter.emit('sendEmail' , {
            to : email ,
            subject : "Verify your Email" ,
            html : `<h1>Verify your email</h1>
            <a href= "${confirmEmailLink}"> Click to verify <a>`,
            attachments : [ {
                filename : "pngtree-verified-stamp-png-image_9168723.png" ,
                path : path.resolve('Assets/pngtree-verified-stamp-png-image_9168723.png')
            } ]
          })
         const user = await UserModel.create({email , password:hashpassword , confirmpassword , username , phone : encryptedphone , age })
        // const newUser = new UserModel ({email , password , confirmpassword , username , phone , age })
        // const user = await newUser.save();
        if (!user)
            return res.status(500).json({message : 'User creation failed'})
        return  res.status(201).json({message : 'User is created successfully', user})
 }


export const login = async(req , res) => {
     const {email,password} = req.body;
     const user = await UserModel.findOne({email});
     if(!user) 
        return res.status(404).json({message:'Invalid email or password'});
    const IspasswordExists = compareSync (password , user.password);
    if(!IspasswordExists)
        return res.status(404).json({message:'Invalid email or password'});
    const accesstoken = jwt.sign({_id : user._id , email : user.email} , process.env.JWT_SECRET_LOGIN , {expiresIn : '1h' , jwtid : uuidv4()})
    const refreshtoken = jwt.sign({_id : user._id , email : user.email} , process.env.JWT_SECRET_REFRESH , {expiresIn : '2d' , jwtid : uuidv4()})
    return res.status(200).json({message:'User logged in successfully', accesstoken , refreshtoken});
}

export const VerifyEmail = async (req,res) =>{
    const {token} = req.params;
    const decodedEmail = jwt.verify(token,process.env.JWT_SECRET) //there's another function called decoded but this is better because it actually verify data 
    const user = await UserModel.findOneAndUpdate({email:decodedEmail.email},{isEmailVerified : true},{new : true}) //we add {new} because we want the version after update
    // we can replace that with findOne => isverfied :true => save but we don't need here to go twice for database
    if(!user) 
        return res.status(404).json({message:'user is Not found'});
    user.phone = (await decryption({cipher : user.phone , secretkey : process.env.ENCRYPTED_KEY}))
    return res.status(200).json({message:'User is verfied successfully' , user});
}
  
export const RefreshToken = (req , res) =>{
        const {refreshtoken} = req.headers;
        const DecodedData = jwt.verify(refreshtoken , process.env.JWT_SECRET_REFRESH)
        const accesstoken = jwt.sign({_id : DecodedData._id , email : DecodedData.email} , process.env.JWT_SECRET_LOGIN , {expiresIn : '1h' , jwtid : uuidv4()})
        res.status(200).json({message : "Token is Refreshed successfully", accesstoken}) 
}

export const LogOut = async (req , res) => {
        const {accesstoken , refreshtoken} = req.headers;
        const DecodedAccesstoken = jwt.verify(accesstoken , process.env.JWT_SECRET_LOGIN)
        const DecodedRefreshtoken = jwt.verify(refreshtoken, process.env.JWT_SECRET_REFRESH)
        const user = await BlackListModel.insertMany([{tokenId : DecodedAccesstoken.jti , expirayDate : DecodedAccesstoken.exp} , {tokenId : DecodedRefreshtoken.jti , expirayDate : DecodedRefreshtoken.exp}])
        res.status(200).json({message : 'User is logged out successfully'})
}

export const ForgetPassword = async (req , res) => {
       const {email} = req.body;
       const user = await UserModel.findOne({email})
       if (!user)
         return res.status(404).json({message:"Email is not found"})
       const otp = uuidv4() //or Math.floor(Math.random() * 1000)
       emitter.emit('sendEmail' , {
        to : email ,
        subject : "Account Recovery" ,
        html : `<h1>Reset Your Password</h1>
        <p> otp is ${otp}</p>` ,
        email:user.email, // to applied concept of single source of truth
     })
        const HashOtp = hashSync(otp , +process.env.SALT)
        user.otp = HashOtp 
        await user.save();
        return res.status(200).json({message:"Otp is sent succesfully"})
}

export const ResetPassword = async (req , res) => {
        const{email ,otp ,password ,confirmpassword} = req.body;
        if (password !== confirmpassword )
            return res.status(400).json({message: 'password and confirmpassword does not match'})
        const user = await UserModel.findOne({email})
        if (!user)
          return res.status(404).json({message:"Email is not found"})
        if(!user.otp){
            return res.status(404).json({message:"Otp is not found"})
        }
        const isOtpMatched = compareSync (otp , user.otp)
        if (!isOtpMatched)
            return res.status(401).json({message : "Otp is invalid"})
        const hashPassword = hashSync (password , +process.env.SALT)
        await UserModel.updateOne({email},{password : hashPassword ,$unset : {otp :""}})
        return res.status(200).json({message:"Password reset successfully"})
}