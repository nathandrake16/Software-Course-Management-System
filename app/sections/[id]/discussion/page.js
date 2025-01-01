// app/sections/[id]/discussion/page.js
"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '@/components/NavBar';

export default function SectionDiscussionPage({ params }) {
    const [discussions, setDiscussions] = useState([]);
    const [newPost, setNewPost] = useState({
        title: '',
        content: ''
    });
    const [editingPost, setEditingPost] = useState(null); // Track the post being edited
    const [sectionId, setSectionId] = useState(null);

    // Use useEffect to set sectionId
    useEffect(() => {
        if (params && params.id) {
            setSectionId(params.id);
        }
    }, [params]);

    // Fetch discussions when sectionId is available
    useEffect(() => {
        if (sectionId) {
            fetchDiscussions();
        }
    }, [sectionId]);

    const fetchDiscussions = async () => {
        try {
            const response = await axios.get(`/api/discussions?sectionId=${sectionId}`);
            setDiscussions(response.data.discussions);
        } catch (error) {
            console.error('Error fetching discussions:', error);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/discussions', {
                sectionId: sectionId,
                ...newPost
            });
            
            // Reset form and refresh discussions
            setNewPost({ title: '', content: '' });
            fetchDiscussions();
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const handleEditPost = async (e) => {
        e.preventDefault();
        try {
            await axios.put('/api/discussions', {
                postId: editingPost._id,
                title: newPost.title,
                content: newPost.content
            });
            
            // Reset form and refresh discussions
            setNewPost({ title: '', content: '' });
            setEditingPost(null);
            fetchDiscussions();
        } catch (error) {
            console.error('Error editing post:', error);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            await axios.delete('/api/discussions', { data: { postId } });
            fetchDiscussions(); // Refresh the discussion list
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    // Loading state while sectionId is being set
    if (!sectionId) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <NavBar />
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Section Discussion</h1>

                {/* Create/Edit Post Form */}
                <form onSubmit={editingPost ? handleEditPost : handleCreatePost} className="mb-6 bg-white shadow-md rounded p-6">
                    <input 
                        type="text"
                        placeholder="Post Title"
                        value={newPost.title}
                        onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                        className="w-full p-2 border rounded mb-4"
                        required
                    />
                    <textarea 
                        placeholder="Post Content"
                        value={newPost.content}
                        onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                        className="w-full p-2 border rounded mb-4"
                        rows="4"
                        required
                    />
                    <button 
                        type="submit" 
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        {editingPost ? 'Update Post' : 'Create Post'}
                    </button>
                    {editingPost && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingPost(null);
                                setNewPost({ title: '', content: '' });
                            }}
                            className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
                        >
                            Cancel
                        </button>
                    )}
                </form>

                {/* Discussion Posts */}
                <div className="space-y-4">
                    {discussions.map(post => (
                        <div key={post._id} className="bg-white shadow-md rounded p-6">
                            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                            <p className="text-gray-600 mb-4">{post.content}</p>
                            <div className="text-sm text-gray -500">
                                Posted by {post.author.name} on {new Date(post.createdAt).toLocaleString()}
                            </div>
                            <div className="mt-4">
                                <button 
                                    onClick={() => {
                                        setEditingPost(post);
                                        setNewPost({ title: post.title, content: post.content });
                                    }} 
                                    className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDeletePost(post._id)} 
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}