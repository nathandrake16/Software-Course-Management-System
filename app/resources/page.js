"use client"; // Add this if you're using client-side features like useState, useEffect, etc.

import { useState, useEffect } from "react";
import axios from "axios";

const ResourcePage = () => {
    const [link, setLink] = useState(""); // State for the website link
    const [course, setCourse] = useState(""); // State for the selected course
    const [resources, setResources] = useState([]); // State to store all resources
    const [error, setError] = useState(""); // State for error messages
    const [loading, setLoading] = useState(false); // State for loading spinner
    const [selectedCourse, setSelectedCourse] = useState(""); // State to store the selected course
    const [userRole, setUserRole] = useState(null); // State to store the user's role

    // Fetch all resources on page load
    useEffect(() => {
        fetchResources();
        fetchUserRole();
    }, []);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/api/resources");
            setResources(response.data);
        } catch (error) {
            console.error("Error fetching resources:", error);
            setError("Failed to fetch resources");
        } finally {
            setLoading(false);
        }
    };

    const fetchUserRole = async () => {
        try {
            const response = await axios.get("/api/user-role");
            setUserRole(response.data.role);
        } catch (error) {
            console.error("Error fetching user role:", error);
            setUserRole(null); // Set userRole to null if error occurs
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        try {
            // Send the link and course as JSON data
            const response = await axios.post("/api/resources/upload", {
                link,
                course,
            });
            console.log("Resource uploaded:", response.data);
            setLink(""); // Clear the input after upload
            setCourse(""); // Clear the course selection
            fetchResources(); // Refresh the list of resources
        } catch (error) {
            console.error("Error uploading resource:", error);
            setError("Failed to upload resource");
        }
    };

    const handleDelete = async (resourceId) => {
        try {
            await axios.delete(`/api/resources/${resourceId}`);
            fetchResources(); // Refresh the list of resources
        } catch (error) {
            console.error("Error deleting resource:", error);
            setError("Failed to delete resource");
        }
    };

    const handleApprove = async (resourceId) => {
        try {
            await axios.put(`/api/resources/${resourceId}/approve`);
            fetchResources(); // Refresh the list of resources
        } catch (error) {
            console.error("Error approving resource:", error);
            setError("Failed to approve resource");
        }
    };

    const handleCourseClick = async (course) => {
        setSelectedCourse(course);
        try {
            const response = await axios.get(`/api/resources?course=${course}`);
            setResources(response.data);
        } catch (error) {
            console.error("Error fetching resources for course:", error);
            setError("Failed to fetch resources for course");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-black text-center">Resources</h1>

                {/* Course Buttons */}
                <div className="flex flex-wrap justify-center mb-8">
                    <button
                        onClick={() => handleCourseClick("CSE370")}
                        className={`bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200 mr-4 mb-4 ${
                            selectedCourse === "CSE370" ? "bg-blue-600" : ""
                        }`}
                    >
                        CSE370
                    </button>
                    <button
                        onClick={() => handleCourseClick("CSE470")}
                        className={`bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200 mr-4 mb-4 ${
                            selectedCourse === "CSE470" ? "bg-blue-600" : ""
                        }`}
                    >
                        CSE470
                    </button>
                    <button
                        onClick={() => handleCourseClick("CSE471")}
                        className={`bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200 mr-4 mb-4 ${
                            selectedCourse === "CSE471" ? "bg-blue-600" : ""
                        }`}
                    >
                        CSE471
                    </button>
                </div>

                <form onSubmit={handleUpload} className="mb-6">
                    <input
                        type="text"
                        placeholder="Resource Link"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        className="border p-2 rounded w-full mb-4"
                        required
                    />
                    <select
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        className="border p-2 rounded w-full mb-4"
                        required
                    >
                        
                        <option className="text-black" value="">Select Course</option>
                        <option className="text-black" value="CSE370">CSE370</option>
                        <option className="text-black" value="CSE470">CSE470</option>
                        <option className="text-black" value="CSE471">CSE471</option>
                    </select>
                    <button
                        type="submit"
                        className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition duration-200"
                    >
                        Upload Resource
                    </button>
                </form>

                {/* Resource List */}
                <div>
                    {loading ? (
                        <p>Loading resources...</p>
                    ) : (
                        resources.map((resource) => (
                            <div key={resource.id} className="flex justify-between items-center mb-4">
                                <a href={resource.link} className="text-blue-600" target="_blank" rel="noopener noreferrer">
                                    {resource.link}
                                </a>
                                <div>
                                    <button
                                        onClick={() => handleDelete(resource.id)}
                                        className="bg-red-500 text-white p-1 rounded-lg hover:bg-red-600 transition duration-200 mr-2"
                                    >
                                        Delete
                                    </button>
                                    {userRole === "faculty" && (
                                        <button
                                            onClick={() => handleApprove(resource.id)}
                                            className="bg-yellow-500 text-white p-1 rounded-lg hover:bg-yellow-600 transition duration-200"
                                        >
                                            Approve
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Error Message */}
                {error && <p className="text-red-500">{error}</p>}
            </div>
        </div>
    );
};

export default ResourcePage;