import { connectDB } from "@/db/db";
import Group from "@/models/groupModel";
import { NextResponse } from "next/server";
import mongoose from 'mongoose'; // Make sure to import mongoose here

// Define the POST handler as a named export
export async function POST(request, context) {
    await connectDB();
    const { id } = context.params;

    try {
        const reqBody = await request.json();
        const { name, university_email } = reqBody;

        const group = await Group.findById(id);
        if (!group) return NextResponse.json({ message: "Group not found." }, { status: 404 });

        if (group.students.length >= 4) {
            return NextResponse.json({ message: "This group is full." }, { status: 400 });
        }

        // Add the new student to the group's students array
        group.students.push({ 
            name, 
            university_email,
            _id: new mongoose.Types.ObjectId() // Generate a new unique ID for the student
        });
        await group.save();

        return NextResponse.json({ message: "Successfully joined the group." }, { status: 200 });
    } catch (error) {
        console.error("Error joining group:", error);
        return NextResponse.json({ message: "Error joining the group." }, { status: 500 });
    }
}

