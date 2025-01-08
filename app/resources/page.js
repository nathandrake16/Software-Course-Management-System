"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "@/components/NavBar";
import { useRouter } from "next/navigation";

export default function ResourcesPage() {
    const [resources, setResources] = useState([]);
    const [newResource, setNewResource] = useState({
        course: "",
        semester: "",
        resources: "", // Add resources to state
    });
    const [error, setError] = useState(null);
    const router = useRouter();

    // Fetch resources on component mount
    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await axios.get("/api/resources");
                setResources(response.data.resources || []);
            } catch (error) {
                console.error("Error fetching resources:", error);
                setError("Failed to fetch resources");
            }
        };

        fetchResources();
    }, []);

    // Handle resource creation
    const handleCreateResource = async (e) => {
        e.preventDefault();
        
        // Validate inputs
        if (!newResource.course || !newResource.semester || !newResource.resources) {
            setError("Please fill in all fields: course, semester, and resource");
            return;
        }

        try {
            // Clear any previous errors
            setError(null);

            const response = await axios.post("/api/resources", newResource, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Add new resource to the list
            setResources(prevResources => [...prevResources, response.data.resource]);
            
            // Reset form
            setNewResource({ course: "", semester: "", resources: "" });
        } catch (error) {
            console.error("Error creating resource:", error);
            setError(error.response?.data?.error || "Failed to create resource");
        }
    };

    // Navigate to resource details
    const viewResourceDetails = (resourceId) => {
        router.push(`/resources/${resourceId}`);
    };

    // Handle resource deletion
    const handleDeleteResource = async (resourceId) => {
        try {
            const response = await axios.delete(`/api/resources/${resourceId}`);
            // Remove the deleted resource from the state
            setResources(prevResources => prevResources.filter(resource => resource._id !== resourceId));
            alert(response.data.message); // Show success message
        } catch (error) {
            console.error("Error deleting resource:", error);
            alert("Failed to delete resource");
        }
    };

    return (
        <div>
            <NavBar />
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Manage Resources</h1>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        {error}
                    </div>
                )}

                {/* Resource Creation Form */}
                <div className="bg-white text-black shadow-md rounded px-8 pt-6 pb-8 mb-6">
                    <h2 className="text-2xl mb-4">Create New Resource</h2>
                    <form onSubmit={handleCreateResource} className="space-y-4">
                        <div>
                            <label className="block mb-2">Course</label>
                            <select
                                value={newResource.course}
                                onChange={(e) => {
                                    setNewResource({...newResource, course: e.target.value});
                                    setError(null); // Clear any previous errors
                                }}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="">Select Course</option>
                                <option value="CSE370">CSE370</option>
                                <option value="CSE470">CSE470</option>
                                <option value="CSE471">CSE471</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2">Semester</label>
                            <select
                                value={newResource.semester}
                                onChange={(e) => {
                                    setNewResource({...newResource, semester: e.target.value});
                                    setError(null); // Clear any previous errors
                                }}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="">Select Semester</option>
                                <option value="FALL24">FALL24</option>
                                <option value=" SPRING25">SPRING25</option>
                                <option value="SUMMER25">SUMMER25</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2">Resource</label>
                            <input
                                type="string"
                                value={newResource.resources}
                                onChange={(e) => {
                                    setNewResource({...newResource, resources: e.target.value});
                                    setError(null); // Clear any previous errors
                                }}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                            Create Resources
                        </button>
                    </form>
                </div>

                {/* Display Resources */}
                <h2 className="text-2xl mb-4">Existing Resources</h2>
                <ul className="list-disc pl-5">
                    {resources.map(resource => (
                        <li key={resource._id} className="mb-2">
                            {resource.course} - {resource.semester} (Resource {resource.resources})
                            
                            <button onClick={() => handleDeleteResource(resource._id)} className="ml-4 text-red-500">
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}