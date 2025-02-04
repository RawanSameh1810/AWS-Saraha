import Joi from "joi" ;



export const signupSchema = {
    body : Joi.object({
     username : Joi.string().required().min(6).max(20),
     email : Joi.string().required().email({
        tlds : {
            allow : ["com" , "net" , "org"] ,
        },
        maxDomainSegments : 2
     }),
     password : Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/).messages({'string.pattern.base' : 'password must be at least 8 characters and have sepcial characters from this [@$!%*]'}),
     confirmpassword: Joi.string().required().valid(Joi.ref('password')),
     phone : Joi.string(),
     age:Joi.number()
    }).with('email' , 'password') //when email is found , password required
}
