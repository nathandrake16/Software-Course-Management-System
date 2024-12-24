// app/api/discussions/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/db/db";
import DiscussionPost from "@/models/discussionModel";
import { getIdFromToken } from "@/helpers/getIdFromToken";

// Create a new discussion post
export async function POST(request) {
    try {
        await connectDB();
        const userId = await getIdFromToken(request);
        
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { sectionId, title, content } = await request.json();

        const newPost = new DiscussionPost({
            section: sectionId,
            author: userId,
            title,
            content
        });

        const savedPost = await newPost.save();

        return NextResponse.json({ post: savedPost }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Get discussions for a specific section

export async function GET(request) {
    try {
        await connectDB();
        
        // Use URL object to get query parameters
        const { searchParams } = new URL(request.url);
        const sectionId = searchParams.get('sectionId');

        if (!sectionId) {
            return NextResponse.json({ error: "Section ID is required" }, { status: 400 });
        }

        const discussions = await DiscussionPost.find({ section: sectionId })
            .populate('author', 'name')
            .populate('comments.author', 'name')
            .sort({ createdAt: -1 });

        return NextResponse.json({ discussions }, { status: 200 });
    } catch (error) {
        console.error("Error fetching discussions:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}