import 'dotenv/config'

if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not defined in environment variables")
}

if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET is not defined in environment variables")
}

if(!process.env.CLIENT_ID){
    throw new Error("CLIENT_ID is not defined in environment variables");
}

if(!process.env.CLIENT_SECRET){
    throw new Error("CLIENT_SECRET is not defined in environment variables");
}

if(!process.env.IMAGEKIT_PRIVATE_KEY){
    throw new Error("IMAGEKIT_PRIVATE_KEY is not defined in environment variables");
}

export const config = {
    MONGO_URI:process.env.MONGO_URI,
    PORT:process.env.PORT,
    JWT_SECRET:process.env.JWT_SECRET,
    CLIENT_ID:process.env.CLIENT_ID,
    CLIENT_SECRET:process.env.CLIENT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY
}