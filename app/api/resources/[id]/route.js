// Import necessary modules
import { NextResponse } from "next/server";
import { connectDB } from "@/db/db";
import Section from "@/models/resourceModel";
import User from "@/models/userModel";
import { getIdFromToken } from "@/helpers/getIdFromToken";
import Resource from "@/models/resourceModel";

// GET resource details
export async function GET(request, context) {
    try {
        await connectDB();
        
        // Await params to access resourceId
        const { id: resourceId } = await context.params;

        // Find resource and populate students
        const resource = await Section.findById(resourceId)
            .populate({
                path: 'students',
                select: 'name id university_email' // Select specific fields
            });
        
        if (!resource) {
            return NextResponse.json({ error: "Resources not found" }, { status: 404 });
        }

        return NextResponse.json({ resource }, { status: 200 });
    } catch (error) {
        console.error("Error fetching resource details:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function POST(request, context) {
    try {
        await connectDB();
        
        // Verify faculty
        const facultyId = await getIdFromToken(request);
        if (!facultyId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Await params to access resourceId
        const { id: resourceId } = await context.params;

        // Parse request body
        const { email } = await request.json();

        // Find the resource
        const resource = await Resource.findById(resourceId);
        if (!resource) {
            return NextResponse.json({ error: "Resources not found" }, { status: 404 });
        }

        // Verify faculty owns the resource
        if (resource.faculty.toString() !== facultyId) {
            return NextResponse.json({ error: "Unauthorized to modify this resource" }, { status: 403 });
        }

        // Find student by email
        const student = await User.findOne({ 
            university_email: email, 
            role: 'student' 
        });

        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

        // Check if student is already in the resource
        if (resource.students.includes(student._id)) {
            return NextResponse.json({ error: "Student already in resource" }, { status: 400 });
        }

        // Add student to resource
        resource.students.push(student._id);
        await resource.save();

        // Populate students for response
        await resource.populate({
            path: 'students',
            select: 'name id university_email'
        });

        return NextResponse.json({ resource }, { status: 200 });
    } catch (error) {
        console.error("Error adding student to resource:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE resource
export async function DELETE(request, context) {
    try {
        await connectDB();
        
        // Await params to access resourceId
        const { id: resourceId } = await context.params;

        // Find and delete the resource
        const deletedResource= await Resource.findByIdAndDelete(resourceId);
        
        if (!deletedResource) {
            return NextResponse.json({ error: "Resources not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Resources deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting resource:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}