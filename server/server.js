import "dotenv/config"
import connectDB from "./config/db.js"
import app from "./app.js"
import { PORT } from "./config/env.js"

async function startServer() {
  try {
    await connectDB()

    app.listen(PORT, () => {
      console.log(`Server started running on ${PORT}`)
    })
  } catch (error) {
    console.error(`Server startup failed: ${error.message}`)

    process.exit(1)
  }
}

startServer()