import User from "@/models/userModel";
import { connectDB } from "@/db/db";
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server";
import nodemailer from 'nodemailer'

connectDB()


export async function POST(request, res) {
    try {
        const { university_email } = await request.json();
        const user = await User.findOne({ university_email });
        
        if (!user) {
            console.log("User not found");
            return NextResponse.json({status:400},{ message: "User with this email does not exist" });
        }

        const resetToken = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: '1h' });
        const resetUrl = `http://localhost:${process.env.PORT}/reset-password?token=${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS,
            },
        });
        console.log("About to send")

        await transporter.sendMail({
            to: user.university_email,
            subject: 'Reset Your SCMS Password',
            html: `
                <h2>Password Reset request</h2>
                <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
                <a href="${resetUrl}">Reset Password</a>
                <p>If you didn't request this, please ignore this email.</p>
                <p>Best regards,<br>SCMS Team</p>
            `,
        });

        return NextResponse.json({status:200},{ message: 'Password reset email sent successfully' });
    } catch (error) {
        console.error('Password reset email error:', error);
        return NextResponse.json({status:500},{ message: 'Error sending password reset email' });
    }
}