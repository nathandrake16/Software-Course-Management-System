import { connectDB } from "@/db/db.js";
import User from "@/models/userModel.js";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs"

await connectDB()

export async function POST(request) {
    try {
        const body = await request.json()
        console.log(body)
        const {name, university_email, id, password} = body
        var user = await User.findOne({university_email})
        if (user) {
            return NextResponse.json({error:"The email is already registred"},{status:400})
        }
        user = await User.findOne({id})
        if (user) {
            return NextResponse.json({error:"The ID is already registred"},{status:400})
        }
        if (university_email.split("@")[1] != "g.bracu.ac.bd" && university_email.split("@")[1] != "bracu.ac.bd") {
            return NextResponse.json({error:"Only BRACU student/faculty can register"},{status:400})
        }
        var role;
        if (university_email.split("@")[1] != "g.bracu.ac.bd") role = "student"
        else role = "faculty"
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password,salt)
        const newUser = new User({name, university_email,id, password: hashedPassword, role: role})
        const savedUser = await newUser.save()
        return NextResponse.json({success:true,message:"User created successfully!",user:savedUser},{status:201})

    } catch (error) {
        console.log(error)
        return NextResponse.json({error:error},{status:500})
    }
}