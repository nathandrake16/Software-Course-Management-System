import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/db/db";
import { NextResponse } from "next/server";

connectDB();

export async function POST(request, res) {
    try {
        const body = await request.json();
        const { token, password } = body
        console.log(token,password)
        const decoded = jwt.verify(token, process.env.SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return NextResponse.json({status:404},{ message: "User not found" });
        }
        user.password = await bcrypt.hash(password, 10);
        await user.save();
        return NextResponse.json({status:200},{ message: "Password reset successfully" });
    }
    catch (error) {
        console.error('Password reset error:', error);
        return NextResponse.json({status:500},{ message: 'Error resetting password' });
    }
}