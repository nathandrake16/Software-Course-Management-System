import { NextResponse } from "next/server";

export async function GET(){
    try {
        const response = NextResponse.json({message:"Logged Out Successfully"},{status:200})
        response.cookies.set("token","",{httpOnly:true, expires: new Date(0)})
        return response
    } catch (error) {
        NextResponse.json({error:error},{status:500})
    }
    
}