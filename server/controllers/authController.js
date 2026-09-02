import User from "../models/User.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password
    } = req.body

    const normalizedName = name?.trim()
    const normalizedEmail = email?.trim().toLowerCase()

    if (!normalizedName || !normalizedEmail || !password) {
      return res.status(400).json({
        error: "Name, email and password are required"
      })
    }

    const existingUser = await User.findOne({
      email: normalizedEmail
    })

    if (existingUser) {
      return res.status(409).json({
        error: "Email is already registered"
      })
    }

    const newUser = new User({
      name: normalizedName,
      email: normalizedEmail,
      password
    })

    const savedUser = await newUser.save()

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email
      }
    })

  } catch (error) {
    return res.status(500).json({
      error: "Unable to register user",
    })
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const normalizedEmail = email?.trim().toLowerCase()

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        error: "Email and password is required"
      })
    }

    const user = await User.findOne({
      email: normalizedEmail
    })

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password"
      })
    }

    const isMatch = await user.comparePassword(password)

    if (!isMatch){
      return res.status(401).json({
        error : "Invalid email or password"
      })
    }

    const token = jwt.sign(
      {
        id : user._id
      }, 
      process.env.JWT_SECRET, 
      {
      expiresIn : "1d"
      }
    )

    return res.status(200).json({
      message : "Login Successfull",
      token,
      user : {
        id : user._id,
        name : user.name,
        email : user.email
      }
    })
    
  } catch (error) {
    return res.status(500).json({
      error : "Unable to login user",
      message : error.message
    })
  }



}
export { registerUser, loginUser }

