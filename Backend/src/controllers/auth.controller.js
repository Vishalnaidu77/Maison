import userModel from "../models/user.model.js";
import { config } from '../config/config.js'
import jwt from 'jsonwebtoken'

async function sendResToken(res, user){
    const token = jwt.sign({
        id: user._id
    }, config.JWT_SECRET, { expiresIn: "7d" })

    res.cookie("token", token)
}

export async function registerController(req, res) {
  const { email, contact, fullname, password } = req.body;

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
    })

    sendResToken(res, user)

    return res.status(201).json({
        message: "User registered successfully",
        success: true
    })

  } catch (err) {
    return res.status(400).json({
        message: "Unexpected error",
        success: false,
        err: err.message
    })
  }
}
