"use client";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";

export default function LogIn() {
    const router = useRouter();
    const [user, setUser] = useState({
        university_email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState("");

    const loginButtonHandler = async (e) => {
        e.preventDefault();
        try {
            setError("");
            const response = await axios.post("/api/users/login", user);
            router.push("/");
        } catch (error) {
            setError(error.response?.data?.message || "Login failed. Please check your credentials.");
        }
    };

    const forgotPasswordHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/users/reset-password", {
                university_email: resetEmail,
            });
            alert("Password reset link sent to your email!");
            setShowForgotPassword(false);
        } catch (error) {
            console.log(error);
            alert("Error sending reset link");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-900 to-gray-700">
            <NavBar />
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
                <div className="w-full max-w-md">
                    {!showForgotPassword ? (
                        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                            <h2 className="text-3xl font-bold text-center text-gray-800">Welcome Back</h2>
                            {error && (
                                <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}
                            <form className="space-y-4">
                                <div>
                                    <input
                                        type="email"
                                        placeholder="University Email"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        value={user.university_email}
                                        onChange={(e) => setUser({ ...user, university_email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        value={user.password}
                                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                                    />
                                </div>
                                <button
                                    onClick={loginButtonHandler}
                                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition duration-300"
                                >
                                    Sign In
                                </button>
                            </form>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowForgotPassword(true);
                                }}
                                className="w-full text-center text-indigo-500 hover:text-indigo-600 text-sm font-medium"
                            >
                                Forgot Password?
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                            <h2 className="text-3xl font-bold text-center text-gray-800">Reset Password</h2>
                            <form className="space-y-4">
                                <input
                                    type="email"
                                    placeholder="Enter your university email"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                />
                                <button
                                    onClick={forgotPasswordHandler}
                                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition duration-300"
                                >
                                    Send Reset Link
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowForgotPassword(false);
                                    }}
                                    className="w-full text-center text-indigo-500 hover:text-indigo-600 text-sm font-medium"
                                >
                                    Back to Login
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}