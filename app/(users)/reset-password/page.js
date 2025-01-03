"use client"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"
import NavBar from "@/components/NavBar"

export default function ResetPassword() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    
    const [passwords, setPasswords] = useState({
        password: "",
        confirmPassword: ""
    })

    const resetPasswordHandler = async (e) => {
        e.preventDefault()
        if (passwords.password !== passwords.confirmPassword) {
            alert("Passwords do not match!")
            return
        }
        try {
            const response = await axios.post("/api/users/reset-password-confirm", {
                token: token,
                password: passwords.password
            })
            alert("Password reset successful!")
            router.push("/login")
        } catch (error) {
            console.log(error)
            alert("Error resetting password")
        }
    }

    return (
        <>
            <NavBar />
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <form className="w-full max-w-md p-8 bg-white rounded-lg shadow-md" onSubmit={resetPasswordHandler}>
                    <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Reset Password</h2>
                    <input
                        className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="password"
                        placeholder="New Password"
                        value={passwords.password}
                        onChange={(e) => setPasswords({...passwords, password: e.target.value})}
                    />
                    <input
                        className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="password"
                        placeholder="Confirm New Password"
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                    />
                    <button 
                        className="w-full py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        type="submit"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </>
    )
}
