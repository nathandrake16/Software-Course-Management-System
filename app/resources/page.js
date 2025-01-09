"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "@/components/NavBar";
import { useRouter } from "next/navigation";

export default function ResourcesPage() {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState({
    title: "",
    file: null,
  });
  const [error, setError] = useState(null);
  const router = useRouter();

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

  const handleSelectSection = async (sectionId) => {
    try {
      const response = await axios.get(`/api/sections/${sectionId}`);
      setSelectedSection(response.data.section);
      setResources(response.data.resources || []);
    } catch (error) {
      console.error("Error fetching section details:", error);
      setError("Failed to fetch section details");
    }
  };

  const handleUploadResource = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", newResource.title);
      formData.append("file", newResource.file);

      const response = await axios.post(
        `/api/resources/${selectedSection._id}`,
        formData
      );
      setResources((prevResources) => [...prevResources, response.data.resource]);
      setNewResource({ title: "", file: null });
    } catch (error) {
      console.error("Error uploading resource:", error);
      setError("Failed to upload resource");
    }
  };

  return (
    <div>
      <NavBar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Resource Management</h1>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            {error}
          </div>
        )}

        {/* Section Selection */}
        <div className="mb-4">
          <label className="block mb-2">Select Section</label>
          <select
            value={selectedSection?._id}
            onChange={(e) => handleSelectSection(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a section</option>
            {sections.map((section) => (
              <option key={section._id} value={section._id}>
                {section.course} - {section.semester} (Section {section.section_number})
              </option>
            ))}
          </select>
        </div>

        {/* Resource Upload Form */}
        {selectedSection && (
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
            <h2 className="text-2xl mb-4">Upload Resource</h2>
            <form onSubmit={handleUploadResource} className="space-y-4">
              <div>
                <label className="block mb-2">Title</label>
                <input
                  type="text"
                  value={newResource.title}
                  onChange={(e) =>
                    setNewResource({ ...newResource, title: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">File</label>
                <input
                  type="file"
                  onChange={(e) =>
                    setNewResource({ ...newResource, file: e.target.files[0] })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Upload Resource
              </button>
            </form>
          </div>
        )}

        {/* Resources List */}
        {resources.length > 0 && (
          <div>
            <h2 className="text-2xl mb-4">Resources</h2>
            <ul>
              {resources.map((resource) => (
                <li key={resource._id} className="mb-2">
                  {resource.title} ({resource.file .name})
                  <a href={resource.fileUrl} className="text-blue-500 ml-2" target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}