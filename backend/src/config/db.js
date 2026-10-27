// 
import mongoose from "mongoose"
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

export const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MONGGODB CONNECTED");

    } catch (error){
        console.log("❌ MONGGOBD NOT CONNECTED", error);
        process.exit(1); 
    }
};