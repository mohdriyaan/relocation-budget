import mongoose from "mongoose";

async function connectToDB(){
  try {
    const res = await mongoose.connect(process.env.DB_URL)
    console.log(`Database Connected - ${res.connection.host}`)
  } catch (error) {
    console.log(`Error Occured - ${error.message} `)
  }
}

export default connectToDB