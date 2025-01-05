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
        <nav className="bg-black text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-lg font-bold">
                    Software Course Management System
                </Link>
                <div className="flex items-center space-x-4">
                    {/* Announcements dropdown menu */}
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard" className="text-white hover:text-gray-300">
                                Dashboard
                            </Link>
                            <AnnouncementsDropdown />
                            <Link href="/profile" className="text-white hover:text-gray-300">
                                {user.name}
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300 transition duration-300"
                            >
                                Log Out
                            </button>

                        </div>
                    ) : (
                        <div className="flex space-x-4">
                            <Link
                                href="/login"
                                className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300 transition duration-300"
                            >
                                Log In
                            </Link>
                            <Link
                                href="/signup"
                                className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300 transition duration-300"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
