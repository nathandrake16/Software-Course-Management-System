import Announcement from "@/models/announcementModel.js";
import { connectDB } from "@/db/db";
import { NextResponse } from "next/server";
import { getIdFromToken } from "@/helpers/getIdFromToken";
import Section from "@/models/sectionModel";

connectDB()

export async function POST(request) {
    console.log("Submission")
    const body = await request.json();
    const { content, sections } = body;
    if (!content || !sections || sections.length === 0) {
        return NextResponse.json({ error: "Content and sections are required" });
    }

    try {
        const announcement = await Announcement.create({ content, sections });
        return NextResponse.json({ message: "Announcement created", announcement },{status: 200});
    } catch (error) {
        console.error("Error creating announcement:", error);
        return NextResponse.json({ error: "Internal server error" },{status: 500});
    }
}
export async function GET(request) {
    try {
        const userId = await getIdFromToken(request);
        
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Find all sections where the user is either a student or faculty
        const userSections = await Section.find({
            $or: [
                { faculty: userId },
                { students: userId }
            ]
        });
        console.log("User Sections:", userSections);
        // Extract section IDs
        const sectionIds = userSections.map(section => section._id);

        // Find announcements that belong to user's sections
        const announcements = await Announcement.find({
            sections: { $in: sectionIds }
        }).sort({ createdAt: -1 }); // Optional: sort by newest first

        return NextResponse.json({ announcements }, { status: 200 });
    } catch (error) {
        console.error("Error fetching announcements:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}