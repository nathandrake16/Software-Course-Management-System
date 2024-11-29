import { connectDB } from "@/db/db";
import { getIdFromToken } from "@/helpers/getIdFromToken.js";
import User from "@/models/userModel.js";
import { NextResponse } from "next/server";

connectDB()

export async function GET(request) {
    try {
        const userId = await getIdFromToken(request)
        if (userId == null) {
            return NextResponse.json({"logged_in":false},{status:200})
        }
        const user = await User.findById(userId)
        return NextResponse.json({"logged_in":true,"user":user},{status:200})
    } catch (error) {
        console.log(error.message)
        return NextResponse.json({error:error.message},{status:500})
    }
}