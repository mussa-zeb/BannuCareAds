import mongoose from "mongoose";
import dotenv from 'dotenv'
import dns from 'dns'


dotenv.config()

async function dbConnection() {
    try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
        await mongoose.connect(process.env.MONGO_URL, {
            dbName: "BannuCare",
        })
        console.log("The MongoDB Atlas Is Connected")
    } catch (error) {
        console.log(error)
    }
}

export default dbConnection