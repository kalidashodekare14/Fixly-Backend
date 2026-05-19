import app from './app';
import { connectDB } from './config/db';
import { config } from './config/env';

const server = async(): Promise<void> =>{
  try{
    connectDB();
    
    app.listen(config.PORT, ()  =>{
      console.log(`Server is running ${config.PORT}`)
    })
  }catch(error){
    console.error(error);
    process.exit(1);
  }   
}

server()