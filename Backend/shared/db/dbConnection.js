import mongoose from "mongoose";
import dotenv from 'dotenv'
import dns from 'dns'


dotenv.config()

// Database name — .env mein DB_NAME se override ho sakta hai
const DB_NAME = process.env.DB_NAME || "BannuCareAds"

async function dbConnection() {
    try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
        await mongoose.connect(process.env.MONGO_URL, {
            dbName: DB_NAME,
        })
        console.log(`The MongoDB Atlas Is Connected (db: ${DB_NAME})`)
    } catch (error) {
        console.log(error)
    }
}

export default dbConnection