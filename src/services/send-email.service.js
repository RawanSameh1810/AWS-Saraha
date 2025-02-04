import nodemailer from 'nodemailer' ;
import { EventEmitter } from 'node:events';
export const SendEmailService = async({to ,subject ,html ,attachments = []}) =>{
   try{
     const transporter = nodemailer.createTransport({ //general configration for the email we will use for sending emails
        host : 'smtp.gmail.com' , // or localhost
        port : 465 ,
        secure : true ,
        auth : {
            user : process.env.EMAIL_USER,
            pass : process.env.EMAIL_PASS
        } ,
        
            // tls:{
            //     rejectUnauthorized : false  //default true we use this when we use unauthorize emails like 10 min emails
            // }
     })
     const info = await transporter.sendMail({
        from : `"SARAHA-APP" <${process.env.EMAIL_USER}>`,
        to ,
        cc : 'rrrr@gmail.com',
        subject  ,
        text : "" ,
        html ,
        attachments 
     })
   }
   catch(error){
      console.log('Error Catched in sending Emails' , error);
      return error 
   }
}
export const emitter = new EventEmitter();
emitter.on('sendEmail' ,(...args) => {
    const {to , subject ,html , attachments } =args[0]
     SendEmailService({
        to ,
        subject ,
        html ,
        attachments 
     })
}) 