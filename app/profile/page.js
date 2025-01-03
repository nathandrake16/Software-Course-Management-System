"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState({
        name: '',
        university_email: '',
        id: '',
        role: '',
        verified: false
    });
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get('/api/users/userinfo');
            setUser(response.data.user);
            setIsLoading(false);
        } catch (error) {
            setMessage('Failed to load profile');
            setIsLoading(false);
        }
    };

    const handleResendVerification = async () => {
        try {
            await axios.get('/api/users/verify-email');
            setMessage('Verification email sent successfully!');
        } catch (error) {
            setMessage('Failed to send verification email');
        }
    };

    const handlePasswordReset = async () => {
        try {
            await axios.post('/api/user/reset-password');
            setMessage('Password reset link sent to your email!');
        } catch (error) {
            setMessage('Failed to initiate password reset');
        }
    };

    if (isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-2xl font-bold text-center mb-8">Profile</h1>
                
                {message && (
                    <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">
                        {message}
                    </div>
                )}

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <div className="mt-1 p-2 bg-gray-50 rounded">
                            {user.name}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">University Email</label>
                        <div className="mt-1 p-2 bg-gray-50 rounded">
                            {user.university_email}
                            {!user.verified && (
                                <span className="ml-2 text-red-500 text-sm">
                                    (Not Verified)
                                </span>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Student/Faculty ID</label>
                        <div className="mt-1 p-2 bg-gray-50 rounded">
                            {user.id}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <div className="mt-1 p-2 bg-gray-50 rounded capitalize">
                            {user.role}
                        </div>
                    </div>

                    {!user.verified && (
                        <button
                            onClick={handleResendVerification}
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                        >
                            Send Verification Email
                        </button>
                    )}

                    <button
                        onClick={handlePasswordReset}
                        className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
                    >
                        Reset Password
                    </button>
                </div>
            </div>
        </div>
    );
}
