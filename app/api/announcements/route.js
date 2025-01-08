import Announcement from "@/models/announcementModel.js";
import { connectDB } from "@/db/db";
import { NextResponse } from "next/server";
import { getIdFromToken } from "@/helpers/getIdFromToken";
import Section from "@/models/sectionModel";
import User from "@/models/userModel";
import nodemailer from 'nodemailer';

connectDB()

export async function POST(request) {
    const body = await request.json();
    const { content, sections, deadline, sendMail } = body;
    if (!content || !sections || sections.length === 0) {
        return NextResponse.json({ error: "Content and sections are required" });
    }

    try {
        const announcement = await Announcement.create({
            content, sections,
            deadline: deadline ? new Date(deadline) : null
        });
        if (deadline) {
            const deadlineDate = new Date(deadline);
            const notificationDate = new Date(deadlineDate);
            notificationDate.setDate(deadlineDate.getDate() - 1);

            // Get all students from selected sections
            const sectionsData = await Section.find({ _id: { $in: sections } });
            const studentIds = sectionsData.reduce((acc, section) => 
                [...acc, ...section.students], []);
            
            const students = await User.find({ _id: { $in: studentIds } });

            // Configure email transporter
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASS,
                },
            });

            // Schedule notification for each student
            students.forEach(async (student) => {
                setTimeout(async () => {
                    await transporter.sendMail({
                        to: student.university_email,
                        subject: 'Deadline Reminder',
                        html: `
                            <h2>Deadline Reminder</h2>
                            <p>This is a reminder that you have a deadline tomorrow.</p>
                            <p><strong>Announcement:</strong> ${content}</p>
                            <p><strong>Deadline:</strong> ${deadlineDate.toLocaleString()}</p>
                        `,
                    });
                }, notificationDate.getTime() - Date.now());
            });
        }
        if (sendMail){
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
    
        }
        return NextResponse.json({ message: "Announcement created", announcement }, { status: 200 });
    } catch (error) {
        console.error("Error creating announcement:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
export async function GET(request) {
    try {
        const userId = await getIdFromToken(request);

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userSections = await Section.find({
            $or: [
                { faculty: userId },
                { students: userId }
            ]
        });
        const sectionIds = userSections.map(section => section._id);
        const announcements = await Announcement.find({
            sections: { $in: sectionIds }
        }).sort({ createdAt: -1 }); // Optional: sort by newest first
        return NextResponse.json({ announcements }, { status: 200 });
    } catch (error) {
        console.error("Error fetching announcements:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}