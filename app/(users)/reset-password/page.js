"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import NavBar from "@/components/NavBar";
import { Suspense } from "react";

function ResetPassword() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const resetPasswordHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            setError("");
            const response = await axios.post("/api/users/reset-password", {
                token,
                password,
            });
            setMessage("Password reset successfully!");
            router.push("/login");
        } catch (error) {
            setError(error.response?.data?.message || "Failed to reset password");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-900 to-gray-700">
            <NavBar />
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                        <h2 className="text-3xl font-bold text-center text-gray-800">Reset Password</h2>
                        {error && (
                            <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="bg-green-50 text-green-500 px-4 py-3 rounded-lg text-sm">
                                {message}
                            </div>
                        )}
                        <form className="space-y-4">
                            <div>
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={resetPasswordHandler}
                                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition duration-300"
                            >
                                Reset Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPassword />
        </Suspense>
    );
}