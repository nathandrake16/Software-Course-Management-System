import { connectDB } from "@/db/db";
import Group from "@/models/groupModel";
import { NextResponse } from "next/server";
import mongoose from 'mongoose';

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
            _id: new mongoose.Types.ObjectId() 
        });
        await group.save();

        return NextResponse.json({ message: "Successfully joined the group." }, { status: 200 });
    } catch (error) {
        console.error("Error joining group:", error);
        return NextResponse.json({ message: "Error joining the group." }, { status: 500 });
    }
}
export async function PUT(request, { params }) {
    await connectDB();
  
    try {
        const { id } = await params; // Get the group ID from the URL parameters
        const reqBody = await request.json(); // Parse the request body
  
        // Log the received data for debugging
        console.log("Received update request:", {
            groupId: id,
            progressDetails: reqBody.progress.details
        });
  
        // Update the group's progress details
        const updatedGroup = await Group.findByIdAndUpdate(
            id, 
            { 
                'progress.details': reqBody.progress.details // Update the details field
            }, 
            { 
                new: true // Return the updated document
            }
        );
  
        if (!updatedGroup) {
            return NextResponse.json({ message: "Group not found" }, { status: 404 });
        }
    
        return NextResponse.json({ 
            message: "Progress updated successfully", 
            group: updatedGroup 
        }, { status: 200 });
  
    } catch (error) {
        console.error("Error updating group progress:", error);
        return NextResponse.json({ 
            message: "Error updating progress", 
            error: error.message 
        }, { status: 500 });
    }
  }
  