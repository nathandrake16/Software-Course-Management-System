
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "@/components/NavBar";
import { useRouter } from "next/navigation";

export default function GroupsPage() {
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [progressDetails, setProgressDetails] = useState({});
    const [userRole, setUserRole] = useState(""); // To store user role

    const fetchGroups = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/groups");
            setGroups(response.data.groups || []);
            setError("");
        } catch (err) {
            console.error("Error fetching groups:", err);
            setError(err.response?.data?.message || "Error fetching groups");
        } finally {
            setLoading(false);
        }
    };

    const fetchUserInfo = async () => {
        try {
            const response = await axios.get("/api/users/userinfo");
            const userData = response.data;
            if (userData && userData.user) {
                setUserRole(userData.user.role); // Set user role based on response
            } else {
                console.error("Error fetching user info:", response);
            }
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    };

    useEffect(() => {
        fetchGroups();
        fetchUserInfo(); // Fetch user info on component mount
    }, []);

    const handleCreateGroup = () => {
        router.push("/groups/create");
    };

    const handleUpdateProgress = async (groupId, isApproved) => {
        try {
            const response = await axios.put(`/api/groups/${groupId}`, {
                progress: {
                    isApproved: isApproved // Update the isApproved status 
                                            //Update the progress details
                }
            });

            if (response.status === 200) {
                // Refresh groups to get updated data
                fetchGroups();
            }
        } catch (error) {
            console.error("Error updating progress:", error);
            setError("Failed to update progress");
        }
    };

    if (loading) {
        return (
            <>
                <NavBar />
                <div className="container mx-auto p-6">
                    <p>Loading groups...</p>
                </div>
            </>
        );
    }

    return (
        <>
            <NavBar />
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Groups</h1>
                
                {error && <div className="text-red-500 mb-4">{error}</div>}
                
                {groups.length === 0 ? (
                    <div className="text-gray-500">No groups found.</div>
                ) : (
                    <ul>
                        {groups.map((group) => (
                            <li key={group._id} className="border p-4 mb-2">
                                <h2 className="text-xl">
                                    Group Number: {group.group_number}
                                </h2>
                                <p>
                                    Section: {group.section?.course}  {group.section_number}
                                </p>
                                <p>Students:</p>
                                <ul>
                                    {group.students.map((student, studentIndex) => (
                                        <li key={studentIndex}>
                                            {studentIndex + 1}. {student.name} - {student.university_email}
                                        </li>
                                    ))}
                                </ul>
                                
                                <div className="mt-2">
                                    <strong>Progress:</strong> {group.progress?.string || 'Not set'}
                                    <br />
                                    <strong>Progress Details:</strong> 
                                    <p>{group.progress?.details || 'No details'}</p>
                                    <strong>Approved:</strong> 
                                    <span className={
                                        group.progress?.isApproved 
                                        ? "text-green-600" 
                                        : "text-red-600"
                                    }>
                                        {group.progress?.isApproved ? 'Yes' : 'No'}
                                    </span>

                                    {userRole === "faculty" ? (
                                        <div className="mt-2">
                                            <label htmlFor={`approval-${group._id}`} className="mr-2">Change Approval Status:</label>
                                            <select
                                                id={`approval-${group._id}`}
                                                value={group.progress?.isApproved ? "yes" : "no"}
                                                onChange={(e) => handleUpdateProgress(group._id, e.target.value === "yes")}
                                                className="border p-2 text-black"
                                            >
                                                <option className="text-green-600" value="yes">Yes</option>
                                                <option className="text-red-600" value="no">No</option>
                                            </select>
                                        </div>
                                    ) : (
                                        <div className="flex mt-2">
                                            <input
                                                type="text"
                                                placeholder="Update Progress Details"
                                                value={progressDetails[group._id] || ""}
                                                onChange={(e) => setProgressDetails(prev => ({
                                                    ...prev, 
                                                    [group._id]: e.target.value
                                                }))}
                                                className="border text-black p-2 mr-2 flex-grow"
                                            />

                                            <button
                                                onClick={() => handleUpdateProgress(group._id, group.progress?.isApproved)}
                                                className="bg-blue-500 text-white p-2 rounded"
                                            >
                                                Update
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                <button 
                    onClick={handleCreateGroup} 
                    className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Create New Group
                </button>
            </div>
        </>
    );
}