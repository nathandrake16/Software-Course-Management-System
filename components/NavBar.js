"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import AnnouncementsDropdown from "./Announcements";

export default function NavBar() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get("/api/users/userinfo");
                if (response.data.logged_in) {
                    setUser(response.data.user);
                }
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };
        fetchUserInfo();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.get("/api/users/logout");
            setUser(null);
            router.push("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <nav className="bg-gray-900 text-white shadow-lg">
            <div className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <Link href="/" className="text-xl font-bold tracking-tight hover:text-blue-400 transition">
                        SCMS
                    </Link>
                    <div className="flex items-center space-x-6">
                        {user ? (
                            <div className="flex items-center space-x-6">
                                <Link href="/dashboard" 
                                    className="text-gray-300 hover:text-white transition">
                                    Dashboard
                                </Link>
                                <AnnouncementsDropdown />
                                <Link href="/profile" 
                                    className="text-gray-300 hover:text-white transition">
                                    {user.name}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-300"
                                >
                                    Log Out
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-4">
                                <Link href="/login"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition duration-300"
                                >
                                    Log In
                                </Link>
                                <Link href="/signup"
                                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition duration-300"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}