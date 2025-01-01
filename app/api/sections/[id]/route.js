// Import necessary modules
import { NextResponse } from "next/server";
import { connectDB } from "@/db/db";
import Section from "@/models/sectionModel";
import User from "@/models/userModel";
import { getIdFromToken } from "@/helpers/getIdFromToken";

// GET section details
export async function GET(request, context) {
    try {
        await connectDB();
        
        // Await params to access sectionId
        const { id: sectionId } = await context.params;

        // Find section and populate students
        const section = await Section.findById(sectionId)
            .populate({
                path: 'students',
                select: 'name id university_email' // Select specific fields
            });
        
        if (!section) {
            return NextResponse.json({ error: "Section not found" }, { status: 404 });
        }

        return NextResponse.json({ section }, { status: 200 });
    } catch (error) {
        console.error("Error fetching section details:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Add student to section
export async function POST(request, context) {
    try {
        await connectDB();
        
        // Verify faculty
        const facultyId = await getIdFromToken(request);
        if (!facultyId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Await params to access sectionId
        const { id: sectionId } = await context.params;

        // Parse request body
        const { email } = await request.json();

        // Find the section
        const section = await Section.findById(sectionId);
        if (!section) {
            return NextResponse.json({ error: "Section not found" }, { status: 404 });
        }

        // Verify faculty owns the section
        if (section.faculty.toString() !== facultyId) {
            return NextResponse.json({ error: "Unauthorized to modify this section" }, { status: 403 });
        }

        // Find student by email
        const student = await User.findOne({ 
            university_email: email, 
            role: 'student' 
        });

        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

        // Check if student is already in the section
        if (section.students.includes(student._id)) {
            return NextResponse.json({ error: "Student already in section" }, { status: 400 });
        }

        // Add student to section
        section.students.push(student._id);
        await section.save();

        // Populate students for response
        await section.populate({
            path: 'students',
            select: 'name id university_email'
        });

        return NextResponse.json({ section }, { status: 200 });
    } catch (error) {
        console.error("Error adding student to section:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE section
export async function DELETE(request, context) {
    try {
        await connectDB();
        
        // Await params to access sectionId
        const { id: sectionId } = await context.params;

        // Find and delete the section
        const deletedSection = await Section.findByIdAndDelete(sectionId);
        
        if (!deletedSection) {
            return NextResponse.json({ error: "Section not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Section deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting section:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}