import { connectDB } from "@/db/db";
import Group from "@/models/groupModel";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  try {
    // Fetch groups and populate the section details
    const groups = await Group.find({}).populate({
      path: 'section',
      select: 'course section_number' // Select specific section details
    });

    console.log("Fetched groups:", groups); // Log fetched groups for debugging

    return NextResponse.json({ 
      groups, 
      count: groups.length 
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching groups:", error);
    return NextResponse.json({ 
      message: "Error fetching groups.", 
      error: error.message 
    }, { status: 500 });
  }
}
export async function POST(request) {
  await connectDB();

  try {
    const reqBody = await request.json();
    const { group_number, section, students } = reqBody;

    console.log("Received group creation request:", { 
      group_number, 
      section, 
      students 
    });

    // Validate input
    if (!group_number) {
      console.error("Group number is missing");
      return NextResponse.json({ 
        message: "Group number is required",
        details: "Group number cannot be empty or undefined"
      }, { status: 400 });
    }

    if (!section) {
      console.error("Section is missing");
      return NextResponse.json({ 
        message: "Section is required",
        details: "Section cannot be empty or undefined"
      }, { status: 400 });
    }

    if (!students || !Array.isArray(students) || students.length === 0) {
      console.error("Invalid students data", { students });
      return NextResponse.json({ 
        message: "Students data is invalid",
        details: "Students must be a non-empty array"
      }, { status: 400 });
    }

    // Validate each student
    const validStudents = students.filter(student => 
      student.name && student.name.trim() && 
      student.university_email && student.university_email.trim()
    );

    if (validStudents.length === 0) {
      console.error("No valid students found", { students });
      return NextResponse.json({ 
        message: "No valid student data",
        details: "Each student must have a name and email"
      }, { status: 400 });
    }

    // Check student limit
    if (validStudents.length > 4) {
      return NextResponse.json({ 
        message: "Maximum 4 students allowed per group." 
      }, { status: 400 });
    }

    // Create new group
    const newGroup = new Group({
      group_number: Number(group_number),
      section,
      students: validStudents
    });

    console.log("Attempting to save group:", newGroup);

    await newGroup.save();

    console.log("Savedddddddddddddddddd:", newGroup);

    return NextResponse.json({ 
      message: "Group created successfully", 
      group: newGroup 
    }, { status: 201 });

  } catch (error) {
    console.error("Full error during group creation:", error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json({ 
        message: "Validation Error", 
        details: Object.values(error.errors).map(err => err.message)
      }, { status: 400 });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json({ 
        message: "Duplicate Group", 
        details: "A group with this number already exists in the selected section."
      }, { status: 400 });
    }

    return NextResponse.json({ 
      message: "Error creating group", 
      details: error.message 
    }, { status: 500 });
  }
}
