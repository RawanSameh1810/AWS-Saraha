import { Router } from "express";
import * as messagesServices from './services/messages.service.js'
import { errorHandler } from "../../Middleware/error-handling.middleware.js";
import { authenticationService} from "../../Middleware/authentication.middleware.js";
const messageController = Router()
messageController.post('/send' , errorHandler(messagesServices.SendMessages))
messageController.get('/list' , errorHandler(messagesServices.GetMessages))
messageController.post('/MyMessages' , authenticationService() , errorHandler(messagesServices.MyMessages))
export default messageController 