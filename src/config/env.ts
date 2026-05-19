import dotenv from 'dotenv';
dotenv.config();


export const config = {
    PORT: process.env.PORT || 5000,
    MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017/fixly",
    BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS || 10
}