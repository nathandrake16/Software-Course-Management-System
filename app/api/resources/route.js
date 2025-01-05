import { connectDB } from "@/db/db";
import Resource from "@/models/resourceModel";
import { NextResponse } from "next/server";

connectDB();



export default async function handler(req, res) {
  if (req.method === "POST") {
      try {
          const { link, course } = req.body;

          // Validate the course and link
          if (!course || !link) {
              return res.status(400).json({ error: "Course and link are required" });
          }

          // Create a new resource
          const newResource = new Resource({ course, link });
          await newResource.save();

          return res.status(201).json({
              resource: newResource,
              message: "Resource uploaded successfully",
          });
      } catch (error) {
          console.error("Error uploading resource:", error);
          return res.status(500).json({ error: "Failed to upload resource" });
      }
  } else {
      return res.status(405).json({ error: "Method not allowed" });
  }
}

export async function GET() {
    try {
        const resources = await Resource.find();
        return NextResponse.json(resources, { status: 200 });
    } catch (error) {
        console.error("Error fetching resources:", error);
        return NextResponse.json(
            { error: "Failed to fetch resources" },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
  const { id } = request.query;

  try {
      await Resource.findByIdAndDelete(id);
      return NextResponse.json({ message: "Resource deleted successfully" }, { status: 200 });
  } catch (error) {
      console.error("Error deleting resource:", error);
      return NextResponse.json(
          { error: "Failed to delete resource" },
          { status: 500 }
      );
  }
}

export async function PUT(request) {
  const { id } = request.query;

  try {
      const resource = await Resource.findByIdAndUpdate(id, { isApproved: true }, { new: true });
      return NextResponse.json({ resource, message: "Resource approved successfully" }, { status: 200 });
  } catch (error) {
      console.error("Error approving resource:", error);
      return NextResponse.json(
          { error: "Failed to approve resource" },
          { status: 500 }
      );
  }
}