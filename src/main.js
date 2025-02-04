import express from 'express' ;
import { config } from 'dotenv';
config();
import { database_connection } from './DB/connection.js';
import RouterHandler from '../utils/router-handling.utils.js';
const bootstrap = () => {
 const app = express();
 app.use(express.json())
 database_connection();
 RouterHandler(app)
 app.listen(process.env.PORT , () => {
    console.log("Server is running on port" , process.env.PORT);  
 })
}
export default bootstrap ;
