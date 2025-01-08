"use client"
import axios from "axios"
import { useState } from "react"
import { useRouter } from "next/navigation"
import NavBar from "@/components/NavBar"

export default function SignupPage() {
    const router = useRouter()
    const [user, setUser] = useState({
        name: "",
        university_email: "",
        id: "",
        password: "",
        role: ""
    })
    const [error, setError] = useState("")

    const signupButtonHandler = async (e) => {
        e.preventDefault()
        setError("")

        if (!user.name || !user.university_email || !user.id || !user.password) {
            setError("All fields are required")
            return
        }

        if (user.university_email.split("@")[1] === "g.bracu.ac.bd" ) {
            setUser({...user, role: "student"})
        } else if (user.university_email.split("@")[1] === "bracu.ac.bd") {
            setUser({...user, role: "faculty"})
        } else {
            setError("Please use a valid university email address")
            return
        }
        console.log(user)

        try {
            const response = await axios.post("/api/users/signup", user)
            router.push("/login")
        } catch (error) {
            setError(error.response?.data?.error || "Signup failed. Please try again.")
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-600 to-indigo-700">
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
                                    onChange={(e) => setUser({...user, name: e.target.value})}
                                />
                            </div>

                            <div>
                                <input
                                    type="email"
                                    placeholder="University Email"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    value={user.university_email}
                                    onChange={(e) => setUser({...user, university_email: e.target.value})}
                                />
                            </div>

                            <div>
                                <input
                                    type="text"
                                    placeholder="Student/Faculty ID"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    value={user.id}
                                    onChange={(e) => setUser({...user, id: e.target.value})}
                                />
                            </div>

                            <div>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    value={user.password}
                                    onChange={(e) => setUser({...user, password: e.target.value})}
                                />
                            </div>

                            <button
                                onClick={signupButtonHandler}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition duration-300"
                            >
                                Sign Up
                            </button>
                        </form>

                        <p className="text-center text-gray-600 text-sm">
                            Already have an account?{" "}
                            <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                                Sign In
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
