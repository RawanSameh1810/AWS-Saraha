import { Router } from "express";
import * as profileservices from './services/profile.service.js'
import { authenticationService, authorizationService } from "../../Middleware/authentication.middleware.js";
import {systemRoles , ADMIN_USER} from '../../Constants/Constants.js';
import { errorHandler } from "../../Middleware/error-handling.middleware.js";
const userController = Router()
const {ADMIN ,USER} = systemRoles
userController.use(authenticationService())
userController.get('/profile' , authorizationService(ADMIN_USER ) , errorHandler(profileservices.UserProfile))
userController.patch('/update-password',errorHandler(profileservices.UpdatePassword))
userController.put('/update-profile' ,errorHandler(profileservices.UpdateProfile))
userController.get('/list' , authorizationService([ADMIN]), errorHandler(profileservices.ListUsers))

export default userController