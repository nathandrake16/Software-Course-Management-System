import { NextResponse } from "next/server";
import { connectDB } from "@/db/db";
import Section from "@/models/sectionModel";
import nodemailer from 'nodemailer';

export async function POST(request) {
    try {
        await connectDB();
        const { content, sections } = await request.json();

        // Create email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Get all students from selected sections
        const sectionsData = await Section.find({ _id: { $in: sections } })
            .populate('students', 'university_email');

        // Collect all student emails
        const studentEmails = sectionsData.flatMap(section => 
            section.students.map(student => student.university_email)
        );

        // Send email to all students
        await transporter.sendMail({
            from: process.env.EMAIL,
            bcc: studentEmails,
            subject: 'New Course Announcement',
            html: `
                <h2>New Announcement</h2>
                <p>${content}</p>
                <p>Best regards,<br>SCMS Team</p>
            `,
        });

        return NextResponse.json({ message: "Email notifications sent successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error sending email notifications:", error);
        return NextResponse.json({ error: "Failed to send email notifications" }, { status: 500 });
    }
}
