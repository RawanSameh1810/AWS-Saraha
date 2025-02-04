import mongoose from 'mongoose';
export const database_connection = async () => {
  try{
      await mongoose.connect(process.env.DB_URI);
      console.log("Database Connected"); 
  }
  catch(error){
     console.log('Error connecting to database' ,error); 
  }
}
