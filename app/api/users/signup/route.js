import { connectDB } from "@/db/db.js";
import User from "@/models/userModel.js";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs"

await connectDB()

export async function POST(request) {
    try {
        const body = await request.json()
        const {name, university_email, id, password} = body
        const user = await User.findOne({university_email})
        if (user) {
            return NextResponse.json({error:"The email is already registred"},{status:400})
        }
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password,salt)
        const newUser = new User({name, university_email,id, password: hashedPassword})
        const savedUser = await newUser.save()
        return NextResponse.json({success:true,message:"User created successfully!",user:savedUser},{status:201})

    } catch (error) {
        console.log("Failed")
        return NextResponse.json({error:error},{status:500})
    }
}