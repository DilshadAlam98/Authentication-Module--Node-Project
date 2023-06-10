import mongoose from "mongoose";

const connectDb = async()=>{

    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("databse connected");
    }catch(err){
        console.error(err);
    }
} 

export {connectDb}