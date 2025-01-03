import User from "@/models/userModel";
import { getIdFromToken } from "@/helpers/getIdFromToken";
import { connectDB } from "@/db/db";
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server";
import nodemailer from 'nodemailer'


connectDB()


export async function GET(request, response) {
    try {
        const id = await getIdFromToken(request)
        const token = jwt.sign({ id: id }, process.env.SECRET, { expiresIn: '1d' });
        const url = `http://localhost:3000/api/users/verify-email/${token}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS,
            },
        });
        const user = await User.findById(id);
        await transporter.sendMail({
            to: user.university_email,
            subject: 'Verify Your Email',
            html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
        });
        return NextResponse.json({status: 200},{ message: 'Verification email sent.' });
    } catch (error) {
        return NextResponse.json({success:false},{status:500})
 
    }

};

