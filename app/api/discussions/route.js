// app/api/discussions/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/db/db";
import DiscussionPost from "@/models/discussionModel";
import { getIdFromToken } from "@/helpers/getIdFromToken";

// Create a new post
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

        await newPost.save();

        return NextResponse.json({ message: "Post created successfully", post: newPost }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Edit a post
export async function PUT(request) {
    try {
        await connectDB();
        const userId = await getIdFromToken(request);

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { postId, title, content } = await request.json();

        const post = await DiscussionPost.findById(postId);
        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // Check if the user is the author
        if (!post.isAuthor(userId)) {
            return NextResponse.json({ error: "Unauthorized to edit this post" }, { status: 403 });
        }

        // Update the post
        post.title = title;
        post.content = content;
        await post.save();

        return NextResponse.json({ message: "Post updated successfully", post }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Delete a post
export async function DELETE(request) {
    try {
        await connectDB();
        const userId = await getIdFromToken(request);

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { postId } = await request.json();

        const post = await DiscussionPost.findById(postId);
        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // Check if the user is the author
        if (!post.isAuthor(userId)) {
            return NextResponse.json({ error: "Unauthorized to delete this post" }, { status: 403 });
        }

        // Delete the post
        await post.deleteOne();

        return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Fetch all posts for a section
export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const sectionId = searchParams.get("sectionId");

        const discussions = await DiscussionPost.find({ section: sectionId }).populate('author', 'name');
        return NextResponse.json({ discussions }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

