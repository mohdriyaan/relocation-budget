import User from "../models/User.js"

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
      name : normalizedName,
      email : normalizedEmail,
      password 
    })

    const savedUser = await newUser.save()

    return res.status(201).json({
      message : "User created successfully",
      user : {
        id : savedUser._id,
        name : savedUser.name,
        email : savedUser.email
      }
    })

  } catch (error) {
    return res.status(500).json({
      error : "Unable to register user",
    })
  }
}

export { registerUser }

