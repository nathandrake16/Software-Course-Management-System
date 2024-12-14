import Announcement from "@/models/announcementModel.js";
import { connectDB } from "@/db/db";
import { NextResponse } from "next/server";


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
export async function GET() {
    try {
        const announcements = await Announcement.find();
        return NextResponse.json({ announcements }, { status: 200 });
    } catch (error) {
        console.error("Error fetching announcements:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}