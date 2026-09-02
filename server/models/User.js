import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
  name : {
    type : String,
    required : [true, "Name is required"],
    trim : true
  },
  email : {
    type : String,
    required : [true, "Email is required"],
    trim : true,
    lowercase : true,
    unique : true
  },
  password : {
    type : String,
    required : [true, "Password is required"],
  }
},{
  timestamps : true
})

userSchema.pre("save", async function() {
  if(!this.isModified("password")){
    return
  }

  this.password = await bcrypt.hash(this.password,10)
})

userSchema.methods.comparePassword = async function(userPassword) {
  return await bcrypt.compare(userPassword, this.password)
}

const User = mongoose.model("User",userSchema)

export default User

