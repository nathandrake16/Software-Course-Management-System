import { NextResponse } from "next/server";
import { connectDB } from "@/db/db";
import Feedback from "@/models/feedbackModel";
import { getIdFromToken } from "@/helpers/getIdFromToken";
import Group from "@/models/groupModel";
import nodemailer from 'nodemailer';
import Announcement from "@/models/announcementModel.js";

export async function POST(request, { params }) {
    try {
        await connectDB();
        
        const facultyId = await getIdFromToken(request);
        
        if (!facultyId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { groupID } = params;
        const { feedback } = await request.json();

        if (!feedback) {
            return NextResponse.json({ error: "Feedback content is required" }, { status: 400 });
        }

        const group = await Group.findById(groupID)
            .populate('students', 'university_email')
            .populate('section');
            
        if (!group) {
            return NextResponse.json({ error: "Group not found" }, { status: 404 });
        }

        // Create new feedback
        const newFeedback = await Feedback.create({
            group: groupID,
            content: feedback,
            student_progresss: group.progress?.details || "No progress details"
        });

        // Create announcement
        await Announcement.create({
            content: `New feedback provided for Group ${group.group_number}: ${feedback}`,
            sections: [group.section._id]
        });

        // Send email notification
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Get student emails from the group
        const studentEmails = group.students.map(student => student.university_email);

        // Send email to all group members
        await transporter.sendMail({
            from: process.env.EMAIL,
            bcc: studentEmails,
            subject: 'New Feedback Received',
            html: `
                <h2>New Feedback for Group ${group.name}</h2>
                <p>${feedback}</p>
                <p>Best regards,<br>SCMS Team</p>
            `,
        });

        return NextResponse.json({ 
            message: "Feedback added successfully",
            feedback: newFeedback 
        }, { status: 201 });

    } catch (error) {
        console.error("Error adding feedback:", error);
        return NextResponse.json({ 
            error: "Internal Server Error", 
            details: error.message 
        }, { status: 500 });
    }
}

export async function GET(request, { params }) {
    try {
        await connectDB();
        
        const facultyId = await getIdFromToken(request);
        if (!facultyId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { groupID } = params;
        const feedbacks = await Feedback.find({ group: groupID }).sort({ createdAt: -1 });
        const group = await Group.findById(groupID);

        return NextResponse.json({ 
            feedbacks,
            group
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching feedback:", error);
        return NextResponse.json({ 
            error: "Internal Server Error", 
            details: error.message 
        }, { status: 500 });
    }
}