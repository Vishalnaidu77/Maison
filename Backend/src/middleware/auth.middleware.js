import jwt from 'jsonwebtoken'
import { config } from '../config/config.js';
import userModel from '../models/user.model.js';

export async function verifySeller(req, res, next) {
    const { token } = req.cookies

    if(!token){
        return res.status(400).json({
            message: "Missing Token",
            success: false,
            err: "Missing Token"
        })
    }

    let decoded;

    try {
        decoded = jwt.verify(token, config.JWT_SECRET)

        const user = await userModel.findById(decoded.id)
        if(!user){
            return res.status(404).json({
                message: "User not found",
                success: false,
                err: "User not found"
            })
        }

        if(user.role !== "seller"){
            return res.status(403).json({
                message: "Forbidden",
                success: false,
                err: "Forbidden"
            })
        }

        req.user = user
        next()

    } catch (err) {
        return res.status(400).json({
            message: "Unexpected error",
            success: false,
            err: err.message
        })
    }
}