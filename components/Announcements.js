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
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Announcements
                <svg
                    className="-mr-1 ml-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                >
                    <div className="py-1" role="none">
                        {announcements.length > 0 ? (
                            announcements.map((announcement, index) => (
                                <div
                                    key={index}
                                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                                    role="menuitem"
                                >
                                    {announcement.content}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-2 text-sm text-gray-500">
                                No announcements available.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
