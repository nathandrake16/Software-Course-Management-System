"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import NavBar from "@/components/NavBar";
import { useRouter } from "next/navigation";

export default function GroupDetailsPage() {
    const params = useParams();
    const id = params.id;
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState("");
    const [isApproved, setIsApproved] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                console.log(id)
                const response = await axios.get(`/api/groups/${id}`);
                console.log(response.data)
                
                if (response.data.group){
                    setGroup(response.data.group);
                    setProgress(response.data.group.progress.string);
                setIsApproved(response.data.group.progress.isApproved);
                }
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching group details:", error);
            }
        };

        if (id) {
            fetchGroupDetails();
        }
    }, [id]);

    const handleCreateGroup = () => {
        router.push("/groups/create");
    };

    const handleUpdateProgress = async () => {
        try {
            await axios.put(`/api/groups/${group._id}`, { 
                progress: {
                    string: progress,
                    details: progress
                } 
            });
            alert("Progress updated successfully!");
        } catch (error) {
            console.error("Error updating progress:", error);
        }
    };
    if (loading) return <div>Loading...</div>;

    return (
        <>
            <NavBar />
            <button 
                    onClick={handleCreateGroup} 
                    className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Create New Group
                </button>
            {group && (
                <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Group Details</h1>
                <h2 className="text-xl">Group Number: {group.group_number}</h2>
                <h3 className="text-lg">Section Number: {group.section_number}</h3>
                <h4 className="text-lg">Students:</h4>
                <ul>
                    {group.students.map((student) => (
                        <li key={student._id}>
                            {student.name} - {student.university_email}
                        </li>
                    ))}
                </ul>
                <div className="mt-4">
                    <label className="block mb-2">Progress:</label>
                    <input
                        type="text"
                        value={progress}
                        onChange={(e) => setProgress(e.target.value)}
                        className="border p-2 w-full"
                    />
                    <button 
                        onClick={handleUpdateProgress} 
                        className="mt-2 bg-blue-500 text-white p-2 rounded"
                    >
                        Update Progress
                    </button>
                </div>
                <div className="mt-4">
                    <strong>Status: </strong>
                    {isApproved ? "Approved" : "Not Approved"}
                </div>
            </div>
            )}
                            
            
        </>
    );
}