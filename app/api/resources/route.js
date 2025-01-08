//GET -all sections
//POST -create section
import { NextResponse } from "next/server";
import { connectDB } from "@/db/db";
import Section from "@/models/resourceModel";
import { getIdFromToken } from "@/helpers/getIdFromToken";
import Resources from "@/models/resourceModel";

export async function GET(request) {
    try {
        await connectDB();
        
        // Get faculty ID from token
        const facultyId = await getIdFromToken(request);
        
        if (!facultyId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Find sections for the specific faculty
        const resources = await Resources.find({ faculty: facultyId });
        
        return NextResponse.json({ resources }, { status: 200 });
    } catch (error) {
        console.error("Error fetching resources:", error);
        return NextResponse.json({ 
            error: "Internal Server Error", 
            details: error.message 
        }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectDB();
        
        // Get user ID from token
        const userId = await getIdFromToken(request);
        
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Parse request body
        const reqBody = await request.json();
        
        // Validate input
        if (!reqBody.course || !reqBody.semester || reqBody.resources == null) {
            return NextResponse.json({ error: "Course, semester, and resource are required" }, { status: 400 });
        }

        // Check if resources is already in use
        const existingResource = await Resources.findOne({ resources: reqBody.resources });
        if (existingResource) {
            return NextResponse.json({ error: "Resource already exists" }, { status: 400 });
        }

        // Create new section
        const newResource = new Resources({
            course: reqBody.course,
            semester: reqBody.semester,
            faculty: userId, // Assuming the student is creating a section under their ID
            students: [],
            resources: reqBody.resources // Ensure this is provided
        });

        // Save section
        const savedResource = await newResource.save();
        
        return NextResponse.json({ resource: savedResource }, { status: 201 });
    } catch (error) {
        console.error("Error creating resources:", error);
        return NextResponse.json({ 
            error: "Internal Server Error", 
            details: error.message 
        }, { status: 500 });
    }
}
