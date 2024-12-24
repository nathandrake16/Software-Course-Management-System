"use client";
import Link from 'next/link';
import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "@/components/NavBar";
import { useParams } from "next/navigation";

export default function SectionDetailsPage() {
    const [section, setSection] = useState(null);
    const [studentEmail, setStudentEmail] = useState("");
    const [error, setError] = useState(null);
    const params = useParams();

    // Fetch section details
    useEffect(() => {
        const fetchSectionDetails = async () => {
            try {
                if (!params.id) return;
                
                const response = await axios.get(`/api/sections/${params.id}`);
                setSection(response.data.section);
            } catch (error) {
                console.error("Error fetching section details:", error);
                setError(error.response?.data?.error || "Failed to fetch section details");
            }
        };

        fetchSectionDetails();
    }, [params.id]);

    // Add student to section
    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/api/sections/${params.id}`, {
                email: studentEmail
            });
            
            // Update section with new student
            setSection(response.data.section);
            setStudentEmail("");
            setError(null);
        } catch (error) {
            console.error("Error adding student:", error);
            setError(error.response?.data?.error || "Failed to add student");
        }
    };

    // Loading and error states
    if (!section) {
        return (
            <div>
                <NavBar />
                <div className="container mx-auto p-6">
                    {error ? (
                        <div className="text-red-500">{error}</div>
                    ) : (
                        <div>Loading...</div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div>
            <NavBar />
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">
                    {section.course} - {section.semester}
                </h1>

                {/* Error Alert */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        {error}
                    </div>
                )}

                {/* Add Student Form */}
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
                    <h2 className="text-2xl mb-4">Add Student</h2>
                    <form onSubmit={handleAddStudent} className="flex space-x-4">
                        <input
                            type="email"
                            value={studentEmail}
                            onChange={(e) => setStudentEmail(e.target.value)}
                            placeholder="Enter student email"
                            className="flex-grow p-2 border rounded"
                            required
                        />
                        <button 
                            type="submit" 
                            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                        >
                            Add Student
                        </button>
                    </form>
                </div>

                {/* Students List */}
                <div>
                    <h2 className="text-2xl mb-4">
                        Students ({section.students ? section.students.length : 0})
                    </h2>
                    {section.students && section.students.length > 0 ? (
                        <table className="w-full border-collapse border">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-2">Name</th>
                                    <th className="border p-2">ID</th>
                                    <th className="border p-2">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {section.students.map((student) => (
                                    <tr key={student.id || student._id}>
                                        <td className="border p-2">{student.name}</td>
                                        <td className="border p-2">{student.id}</td>
                                        <td className="border p-2">{student.university_email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                    ) : (
                        <p className="text-gray-500">No students in this section</p>
                    )}
                    <div>

                            <Link 
                                href={`/sections/${section._id}/discussion`} 
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Section Discussion
                            </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}