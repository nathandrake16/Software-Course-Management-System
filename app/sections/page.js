"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "@/components/NavBar";
import { useRouter } from "next/navigation";

export default function SectionsPage() {
    const [sections, setSections] = useState([]);
    const [newSection, setNewSection] = useState({
        course: "",
        semester: "",
        section_number: "", // Add section_number to state
    });
    const [error, setError] = useState(null);
    const router = useRouter();

    // Fetch sections on component mount
    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = await axios.get("/api/sections");
                setSections(response.data.sections || []);
            } catch (error) {
                console.error("Error fetching sections:", error);
                setError("Failed to fetch sections");
            }
        };

        fetchSections();
    }, []);

    // Handle section creation
    const handleCreateSection = async (e) => {
        e.preventDefault();
        
        // Validate inputs
        if (!newSection.course || !newSection.semester || !newSection.section_number) {
            setError("Please fill in all fields: course, semester, and section number");
            return;
        }

        try {
            // Clear any previous errors
            setError(null);

            const response = await axios.post("/api/sections", newSection, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Add new section to the list
            setSections(prevSections => [...prevSections, response.data.section]);
            
            // Reset form
            setNewSection({ course: "", semester: "", section_number: "" });
        } catch (error) {
            console.error("Error creating section:", error);
            setError(error.response?.data?.error || "Failed to create section");
        }
    };

    // Navigate to section details
    const viewSectionDetails = (sectionId) => {
        router.push(`/sections/${sectionId}`);
    };

    // Handle section deletion
    const handleDeleteSection = async (sectionId) => {
        try {
            const response = await axios.delete(`/api/sections/${sectionId}`);
            // Remove the deleted section from the state
            setSections(prevSections => prevSections.filter(section => section._id !== sectionId));
            alert(response.data.message); // Show success message
        } catch (error) {
            console.error("Error deleting section:", error);
            alert("Failed to delete section");
        }
    };

    return (
        <div>
            <NavBar />
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Manage Sections</h1>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        {error}
                    </div>
                )}

                {/* Section Creation Form */}
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
                    <h2 className="text-2xl mb-4">Create New Section</h2>
                    <form onSubmit={handleCreateSection} className="space-y-4">
                        <div>
                            <label className="block mb-2">Course</label>
                            <select
                                value={newSection.course}
                                onChange={(e) => {
                                    setNewSection({...newSection, course: e.target.value});
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
                                value={newSection.semester}
                                onChange={(e) => {
                                    setNewSection({...newSection, semester: e.target.value});
                                    setError(null); // Clear any previous errors
                                }}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="">Select Semester</option>
                                <option value="FALL24">FALL24</option>
                                <option value="SPRING25">SPRING25</option>
                                <option value="SUMMER25">SUMMER25</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2">Section Number</label>
                            <input
                                type="number"
                                value={newSection.section_number}
                                onChange={(e) => {
                                    setNewSection({...newSection, section_number: e.target.value});
                                    setError(null); // Clear any previous errors
                                }}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                            Create Section
                        </button>
                    </form>
                </div>

                {/* Display Sections */}
                <h2 className="text-2xl mb-4">Existing Sections</h2>
                <ul className="list-disc pl-5">
                    {sections.map(section => (
                        <li key={section._id} className="mb-2">
                            {section.course} - {section.semester} (Section {section.section_number})
                            <button onClick={() => viewSectionDetails(section._id)} className="ml-4 text-blue-500">
                                View Details
                            </button>
                            <button onClick={() => handleDeleteSection(section._id)} className="ml-4 text-red-500">
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}