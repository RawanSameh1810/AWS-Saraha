import { Router } from "express";
import * as authservices  from "./services/authentication-service.js";
import { errorHandler } from "../../Middleware/error-handling.middleware.js";
import { validationMiddleware } from "../../Middleware/validation.middleware.js";
import { signupSchema } from "../../validators/user.schema.js";
const authController = Router()
authController.post('/signUp' ,validationMiddleware(signupSchema), errorHandler(authservices.SignUp))
authController.post('/login' , errorHandler(authservices.login))
authController.get('/verify/:token' , errorHandler(authservices.VerifyEmail)) // the method is get because we are testing from the browser but when we have frontend so it  will change to patch 
authController.post('/refresh-token' , errorHandler(authservices.RefreshToken))
authController.post('/logout' , errorHandler(authservices.LogOut))
authController.patch('/forget-password' , errorHandler(authservices.ForgetPassword))
authController.put('/reset-password' , errorHandler(authservices.ResetPassword))
export default authController
