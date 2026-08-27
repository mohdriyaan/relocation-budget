import mongoose from "mongoose"

async function connectDB() {
  try {
    const connect = await mongoose.connect(process.env.DB_URL)
    
    console.log(`Database Connected - ${connect.connection.host}`)

  } catch (error) {
    console.log(`DB Error Occurred - ${error.message}  `)
    process.exit(1)
  }
}

export default connectDB