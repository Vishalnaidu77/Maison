import userModel from "../models/user.model.js";
import { config } from '../config/config.js'
import jwt from 'jsonwebtoken'

async function sendResToken(res, user, message){
    const token = jwt.sign({
        id: user._id
    }, config.JWT_SECRET, { expiresIn: "7d" })

    res.cookie("token", token)

    res.status(200).json({
      message,
      success: true,
      user: {
        id: user._id,
        email: user.email,
        contact: user.contact,
        fullname: user.fullname,
        role: user.role
      }
    })
}

export async function registerController(req, res) {
  const { email, contact, fullname, password, isSeller } = req.body;

  try {
    const existingUser = await userModel.findOne({
      $or: [{ email }, { "contact.number": contact.number }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await userModel.create({
        email,
        contact,
        fullname,
        password,
        role: isSeller ? "seller" : "buyer"
    })

    await sendResToken(res, user, "User registered successfully.")

  } catch (err) {
    return res.status(400).json({
        message: "Unexpected error",
        success: false,
        err: err.message
    })
  }
}

export async function loginController(req, res) {
  
}