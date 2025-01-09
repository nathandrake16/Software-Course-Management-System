import { useState, useEffect } from "react";

export default function AnnouncementsDropdown() {
    const [announcements, setAnnouncements] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Function to fetch announcements
        const fetchAnnouncements = async () => {
            try {
                const response = await fetch("/api/announcements"); // Update with your API route
                const data = await response.json();
                setAnnouncements(data.announcements || []);
            } catch (error) {
                console.error("Error fetching announcements:", error);
            }
        };

        // Initial fetch
        fetchAnnouncements();

        // Set up interval to fetch every 10 seconds
        const intervalId = setInterval(fetchAnnouncements, 10000);

        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

 
    return (
        <div className="relative inline-block text-left">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
            >
                <span>Announcements</span>
                <svg
                    className={`ml-2 h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl shadow-xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 transform transition-all duration-300">
                    <div className="py-2 max-h-96 overflow-y-auto">
                        {announcements.length > 0 ? (
                            announcements.map((announcement, index) => (
                                <div
                                    key={index}
                                    className="px-6 py-3 hover:bg-gray-50 transition duration-200"
                                >
                                    <p className="text-gray-800 text-sm">{announcement.content}</p>
                                    <span className="text-xs text-gray-500 mt-1">
                                        {new Date(announcement.timestamp).toLocaleDateString()}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-4 text-sm text-gray-500">
                                No announcements available
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}