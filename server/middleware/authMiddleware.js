import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const jwtToken = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        error: "Authentication required"
      })
    }

    const { id } = jwt.verify(jwtToken,process.env.JWT_SECRET)

    req.user = id

    next()

  } catch (error) {
    return res.status(401).json({
      error : "Invalid / Expired Token"
    })    
  }
}

export default authMiddleware