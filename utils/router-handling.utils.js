import { GlobalErrorHandler } from "../src/Middleware/error-handling.middleware.js";
import authController from "../src/Modules/Auth/auth.controller.js";
import messageController from "../src/Modules/messages/messages.controller.js";
import userController from "../src/Modules/User/user.controller.js";
const RouterHandler = (app) => {
    app.use('/auth' , authController)
    app.use('/user', userController)
    app.use('/messg' , messageController)
    app.use(GlobalErrorHandler)
}
export default RouterHandler;