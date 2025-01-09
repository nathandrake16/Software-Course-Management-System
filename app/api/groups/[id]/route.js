import { connectDB } from "@/db/db";
import Group from "@/models/groupModel";
import { NextResponse } from "next/server";
import mongoose from 'mongoose';
import User from "@/models/userModel";
import { getIdFromToken } from "@/helpers/getIdFromToken";


await connectDB();

export async function POST(request, context) {

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
    try {
        const { id } = await params; // Get the group ID from the URL parameters
        const reqBody = await request.json(); // Parse the request body
        const userId = await getIdFromToken(request)
        const user = await User.findById(userId);
        if (user.role === 'faculty') {
            console.log(id)
            const updatedGroup = await Group.findByIdAndUpdate(
                id,
                { 'progress.isApproved': reqBody.progress.isApproved }
            );

            if (!updatedGroup) {
                return NextResponse.json({ message: "Group not found" }, { status: 404 });
            }

            return NextResponse.json({
                message: "Progress updated successfully",
                group: updatedGroup
            }, { status: 200 });
        }
        else {
            const updatedGroup = await Group.findByIdAndUpdate(
                id,
                {
                    'progress.details': reqBody.progress.details,
                    'progress.string': reqBody.progress.string,
                }
            );
            if (!updatedGroup) {
                return NextResponse.json({ message: "Group not found" }, { status: 404 });
            }

            return NextResponse.json({
                message: "Progress updated successfully",
                group: updatedGroup
            }, { status: 200 });
        }

    } catch (error) {
        console.error("Error updating group progress:", error);
        return NextResponse.json({
            message: "Error updating progress",
            error: error.message
        }, { status: 500 });
    }
}
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const email = user.university_email;
        const groups = await Group.find({ 'students.university_email': email });
        return NextResponse.json({ group: groups[0] }, { status: 200 });
    }
    catch (error) {
        console.error("Error fetching groups:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
