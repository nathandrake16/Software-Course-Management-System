"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import NavBar from "@/components/NavBar";

export default function SignUp() {
    const router = useRouter();
    const [user, setUser] = useState({
        name: "",
        university_email: "",
        password: "",
        id: "",
    });
    const [error, setError] = useState("");

    const signUpButtonHandler = async (e) => {
        e.preventDefault();
        try {
            setError("");
            const response = await axios.post("/api/users/signup", user);
            router.push("/login");
        } catch (error) {
            setError(error.response?.data?.message || "Signup failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-900 to-gray-700">
            <NavBar />
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                        <h2 className="text-3xl font-bold text-center text-gray-800">Create Account</h2>
                        
                        {error && (
                            <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <form className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    value={user.name}
                                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <input
                                    type="email"
                                    placeholder="University Email"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    value={user.university_email}
                                    onChange={(e) => setUser({ ...user, university_email: e.target.value })}
                                />
                            </div>
                            <div>
                                <input
                                    type="number"
                                    placeholder="BRACU ID"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    value={user.id}
                                    onChange={(e) => setUser({ ...user, id: e.target.value })}
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    value={user.password}
                                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                                />
                            </div>
                            <button
                                onClick={signUpButtonHandler}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition duration-300"
                            >
                                Sign Up
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}