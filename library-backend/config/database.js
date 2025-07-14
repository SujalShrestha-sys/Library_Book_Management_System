import mongoose from "mongoose";

const connectDatabase =  async () => {
    try{
        const connection = await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB connected successfully ")
    }catch(error){
        console.log("MongoDB conncetion error", error.message);
        process.exit(1)

    }
}

export default connectDatabase;