// Import necessary modules
import { NextResponse } from "next/server";
import { connectDB } from "@/db/db";
import Section from "@/models/sectionModel";
import User from "@/models/userModel";
import { getIdFromToken } from "@/helpers/getIdFromToken";
import Resource from "@/models/resourceModel";

import path from "path";
import { writeFile } from "fs/promises";

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
        const formData = await request.formData();
        console.log("formData:", formData);

        const file = formData.get("file");
        const title = formData.get("title");
        const userId = formData.get("userId");
        // const { title, file, userId} = await request.json();
        // Verify faculty
        const facultyId = await getIdFromToken(request);
        if (!facultyId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (facultyId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: sectionId } = await context.params;
        console.log("sec ID:", sectionId); //works
        // Parse request body


        // Find the resource
        const section = await Section.findById(sectionId);
        if (!section) {
            return NextResponse.json({ error: "Section not found" }, { status: 404 });
        }
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = file.name.replaceAll(" ", "_");
        await writeFile(
            path.join(process.cwd(), "public/uploads/" + filename),
            buffer
        );
        const resource = new Resource({
            title,
            resource: `http://localhost:3000/uploads/${filename}`,
            user: userId,
            section: sectionId
        });
        await resource.save();
       
        return NextResponse.json({ Message: "Success", resource, status: 201 })
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
        const deletedResource = await Resource.findByIdAndDelete(resourceId);

        if (!deletedResource) {
            return NextResponse.json({ error: "Resources not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Resources deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting resource:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}