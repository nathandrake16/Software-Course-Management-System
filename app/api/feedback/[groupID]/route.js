import { NextResponse } from "next/server";
import { connectDB } from "@/db/db";
import Feedback from "@/models/feedbackModel";
import { getIdFromToken } from "@/helpers/getIdFromToken";
import Group from "@/models/groupModel";
import PDFDocument from 'pdfkit';


export async function POST(request, { params }) {
    try {
        await connectDB();
        
        // Get faculty ID from token
        const facultyId = await getIdFromToken(request);
        
        if (!facultyId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { groupID } = await params;
        const { feedback } = await request.json();

        // Validate input
        if (!feedback) {
            return NextResponse.json({ error: "Feedback content is required" }, { status: 400 });
        }

        // Check if group exists
        const group = await Group.findById(groupID);
        if (!group) {
            return NextResponse.json({ error: "Group not found" }, { status: 404 });
        }

        // Create new feedback
        const newFeedback = await Feedback.create({
            group: groupID,
            content: feedback,
            student_progresss: group.progress?.details || "No progress details"
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