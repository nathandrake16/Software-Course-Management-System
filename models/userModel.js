import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    university_email: {
        type: String,
        required: true,
        unique: true
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true,
        enum: ['student', 'faculty'],
        default: 'student'
    },
    verified:{
        type: Boolean,
        required: false,
        default: false
    }
})

const User = mongoose.models.users || mongoose.model("users", userSchema)

export default User

