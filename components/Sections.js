// components/Sections.js
import React, { useEffect, useState } from 'react';

const Sections = () => {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);

  useEffect(() => {
    const fetchSections = async () => {
      const response = await fetch('/api/sections');
      const data = await response.json();
      setSections(data.sections);
    };
    fetchSections();
  }, []);

  const handleSelectSection = async (sectionId) => {
    const response = await fetch(`/api/sections/${sectionId}`);
    const data = await response.json();
    setSelectedSection(data.section);
  };

  return (
    <div>
      <h1>Your Sections</h1>
      <ul>
        {sections.map(section => (
          <li key={section._id} onClick={() => handleSelectSection(section._id)}>
            {section.course} - Section {section.section_number}
          </li>
        ))}
      </ul>

      {selectedSection && (
        <div>
          <h2>{selectedSection.course} - Section {selectedSection.section_number}</h2>
          <h3>Students:</h3>
          <ul>
            {selectedSection.students.map(student => (
              <li key={student._id}>{student.name}</li>
            ))}
          </ul>
          {/* Discussion and comments components can be added here */}
        </div>
      )}
    </div>
  );
};

export default Sections;