"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "@/components/NavBar";

export default function Announcement() {
    const [sections, setSections] = useState([]);
    const [selectedSections, setSelectedSections] = useState([]);
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [sendEmail, setSendEmail] = useState(false);

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = await axios.get("/api/sections");
                setSections(response.data.sections || []);
            } catch (error) {
                console.error("Error fetching sections:", error);
                setError("Unable to load sections. Please try again later.");
            }
        };

        fetchSections();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!content.trim()) {
            setError("Announcement content cannot be empty.");
            return;
        }

        if (selectedSections.length === 0) {
            setError("Please select at least one section.");
            return;
        }

        try {
            if (sendEmail) {
                const announcementResponse = await axios.post("/api/announcements/notify", {
                    content,
                    sections: selectedSections,
                });
                if (announcementResponse.status === 200) {
                    setSuccess("Announcement created successfully!" + (sendEmail ? " Email notifications sent." : ""));
                    setContent("");
                    setSelectedSections([]);
                    setSendEmail(false);
                }
            }
            else {
                const announcementResponse = await axios.post("/api/announcements", {
                    content,
                    sections: selectedSections,
                });
                if (announcementResponse.status === 200) {
                    setSuccess("Announcement created successfully!" + (sendEmail ? " Email notifications sent." : ""));
                    setContent("");
                    setSelectedSections([]);
                    setSendEmail(false);
                }
            }
        } catch (error) {
            console.error("Error creating announcement:", error);
            setError("An error occurred while creating the announcement.");
        }
    };


    const handleSectionChange = (sectionId) => {
        setSelectedSections((prev) =>
            prev.includes(sectionId)
                ? prev.filter((id) => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    return (
        <>
            <NavBar />
            <div className="max-w-5xl mx-auto mt-12 px-6 py-8 bg-gray-100 shadow-md rounded-lg">
                <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
                    Create a New Announcement
                </h1>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="content"
                            className="block text-lg font-medium text-gray-700"
                        >
                            Announcement Content
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your announcement here..."
                            className="w-full p-4 text-gray-800 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
                            rows="4"
                        />
                    </div>

                    <div>
                        <h2 className="text-lg font-medium text-gray-700 mb-4">
                            Select Sections
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {sections.map((section) => (
                                <div
                                    key={section._id}
                                    className="flex items-center p-4 bg-white border border-gray-300 rounded-lg shadow hover:shadow-lg transition"
                                >
                                    <input
                                        type="checkbox"
                                        value={section._id}
                                        checked={selectedSections.includes(
                                            section._id
                                        )}
                                        onChange={() => handleSectionChange(section._id)}
                                        className="form-checkbox h-5 w-5 text-blue-600"
                                    />
                                    <label
                                        htmlFor={section._id}
                                        className="ml-3 text-gray-700 font-medium"
                                    >
                                        {section.course} - {section.semester} (Section{" "}
                                        {section.section_number})
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <input
                            type="checkbox"
                            id="sendEmail"
                            checked={sendEmail}
                            onChange={(e) => setSendEmail(e.target.checked)}
                            className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <label htmlFor="sendEmail" className="text-gray-700">
                            Send announcement via email
                        </label>
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
                        >
                            Submit Announcement
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
