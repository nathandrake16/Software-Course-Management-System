"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import NavBar from "@/components/NavBar";

export default function GroupDetailsPage() {
    const router = useRouter();
    const { id } = router.query;
    const [group, setGroup] = useState(null);
    const [progress, setProgress] = useState("");
    const [isApproved, setIsApproved] = useState(false);

    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                const response = await axios.get(`/api/groups/${id}`);
                setGroup(response.data.group);
                setProgress(response.data.group.progress.string);
                setIsApproved(response.data.group.progress.isApproved);
            } catch (error) {
                console.error("Error fetching group details:", error);
            }
        };

        if (id) {
            fetchGroupDetails();
        }
    }, [id]);

    const handleUpdateProgress = async () => {
        try {
            await axios.put(`/api/groups/${id}/progress`, { progress });
            alert("Progress updated successfully!");
        } catch (error) {
            console.error("Error updating progress:", error);
        }
    };

    if (!group) return <div>Loading...</div>;

    return (
        <>
            <NavBar />
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Group Details</h1>
                <h2 className="text-xl">Group Number: {group.group_number}</h2>
                <h3 className="text-lg">Section Number: {group.section_number}</h3>
                <h4 className="text-lg">Students:</h4>
                <ul>
                    {group.students.map((student) => (
                        <li key={student.id}>
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
        </>
    );
}