import { NextResponse } from "next/server";
import User from "@/models/userModel.js";
import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import { connectDB } from "@/db/db";

connectDB()

export async function POST(request) {
    try {
        const body = await request.json()
        const {university_email, password} = body
        const user  = await User.findOne({university_email})
        if (!user) {
            return NextResponse.json({message:"Email is not registered",success:false},{status:400})
        }
        const passMatches = await bcryptjs.compare(password,user.password)
        if (!passMatches) {
            return NextResponse.json({error:"Invalid Password"},{status:400})
        }
        // if (!user.verified) {
        //     return NextResponse.json({message:"Please verify your email first"},{status:400})
        // }
        const tokenData = {
            id: user._id
        }
        const token = jwt.sign(tokenData, process.env.SECRET,{expiresIn:"30d"})
        const response = NextResponse.json({success:true,message:"Logged In successfully!"},{status:200})
        response.cookies.set("token",token,{httpOnly:true})
        return response
    } catch (error) {
        console.log(error)
        return NextResponse.json({success:false},{status:500})
    }
    
}