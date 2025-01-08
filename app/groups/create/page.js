"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";

export default function CreateGroupPage() {
    const [groupNumber, setGroupNumber] = useState("");
    const [section, setSection] = useState("");
    const [students, setStudents] = useState([{ name: "", university_email: "" }]);
    const [error, setError] = useState("");
    const [sections, setSections] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = await axios.get("/api/sections");
                console.log(response.data);
                setSections(response.data.sections || []);
            } catch (error) {
                console.error("Error fetching sections:", error);
                setError("Unable to load sections. Please try again later.");
            }
        };

        fetchSections();
    }, []);

    const handleStudentChange = (index, field, value) => {
        const updatedStudents = [...students];
        updatedStudents[index][field] = value;
        setStudents(updatedStudents);
    };

    const addStudent = () => {
        if (students.length < 4) {
            setStudents([...students, { name: "", university_email: "" }]);
        }
    };

    const handleCreateGroup = async (e) => {
    e.preventDefault();
    setError("");

    // Comprehensive validation
    const validationErrors = [];

    // Validate group number
    if (!groupNumber || parseInt(groupNumber) <= 0) {
        validationErrors.push("Please enter a valid group number.");
    }

    // Validate section
    if (!section) {
        validationErrors.push("Please select a section.");
    }

    // Validate students
    const validStudents = students.filter(
        student => student.name.trim() && student.university_email.trim()
    );

    if (validStudents.length === 0) {
        validationErrors.push("Please add at least one valid student.");
    }

    if (validStudents.length > 4) {
        validationErrors.push("Maximum 4 students allowed per group.");
    }

    // Check for duplicate emails
    const emails = validStudents.map(s => s.university_email.toLowerCase());
    const uniqueEmails = new Set(emails);
    if (emails.length !== uniqueEmails.size) {
        validationErrors.push("Duplicate student emails are not allowed.");
    }

    // Display validation errors if any
    if (validationErrors.length > 0) {
        setError(validationErrors.join(" "));
        return;
    }

    try {
        console.log("Sending group creation request:", {
            group_number: parseInt(groupNumber),
            section,
            students: validStudents
        });

        const response = await axios.post("/api/groups", {
            group_number: parseInt(groupNumber),
            section,
            students: validStudents
        }, {
            // Add config to handle errors more explicitly
            validateStatus: function (status) {
                return status >= 200 && status < 500; // Reject only if status is 500 or above
            }
        });

        console.log("Group creation response:", response);

        if (response.data.message === "Group created successfully") {
            alert("Group created successfully!");
            router.push("/groups");
        } else {
            // Log and set any unexpected responses
            console.error("Unexpected response:", response);
            setError(response.data.message || "An unexpected error occurred.");
        }
    } catch (error) {
        // More detailed error logging
        console.error("Detailed group creation error:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers
        });

        // Set error message from server or use a generic message
        setError(
            error.response?.data?.message || 
            error.response?.data?.details || 
            "An unexpected error occurred during group creation"
        );
    }
};
    return (
        <>
            <NavBar />
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Create Group</h1>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                
                <form onSubmit={handleCreateGroup}>
                    <div className="mb-4">
                        <label className="block mb-2">Group Number</label>
                        <input
                            type="number"
                            value={groupNumber}
                            onChange={(e) => setGroupNumber(e.target.value)}
                            required
                            className="border text-black p-2 w-full"
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block mb-2">Select Section</label>
                        <select
                            value={section}
                            onChange={(e) => setSection(e.target.value)}
                            required
                            className="border text-black p-2 w-full"
                        >
                            <option value="">Select a section</option>
                            {sections.map((sec) => (
                                <option key={sec._id} value={sec._id}>
                                    {sec.course} - {sec.section_number}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {students.map((student, index) => (
                        <div key={index} className="mb-4">
                            <label className="block mb-2">Student Name</label>
                            <input
                                type="text"
                                value={student.name}
                                onChange={(e) => handleStudentChange(index, "name", e.target.value)}
                                required
                                className="border text-black p-2 w-full"
                            />
                            <label className="block mb-2">University Email</label>
                            <input
                                type="email"
                                value={student.university_email}
                                onChange={(e) => handleStudentChange(index, "university_email", e.target.value)}
                                required
                                className="border text-black p-2 w-full"
                            />
                        </div>
                    ))}
                    
                    <button type="button" onClick={addStudent} className="bg-blue-500 text-white p-2 mb-4">
                        Add Another Student
                    </button>
                    
                    <button type="submit" className="bg-green-500 text-white p-2">
                        Create Group
                    </button>
                </form>
            </div>
        </>
    );
}