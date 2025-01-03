"use client"
import axios from "axios"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import NavBar from "@/components/NavBar"

export default function LogIn(){
    const router = useRouter()
    const [user, setUser] = useState({
        university_email: "",
        password: "",
    })
    const [showForgotPassword, setShowForgotPassword] = useState(false)
    const [resetEmail, setResetEmail] = useState("")

    const loginButtonHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post("/api/users/login",user)
            router.push("/")
        } catch (error) {
            console.log(error)
        }
    }

    const forgotPasswordHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post("/api/users/reset-password", {
                university_email: resetEmail
            })
            alert("Password reset link sent to your email!")
            setShowForgotPassword(false)
        } catch (error) {
            console.log(error)
            alert("Error sending reset link")
        }
    }

    return (
        <>
        <NavBar></NavBar>
        <div style={styles.container}>
            {!showForgotPassword ? (
                <form style={styles.form}>
                    <h2 style={styles.heading}>Log In</h2>
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="University Email"
                        value={user.university_email}
                        onChange={(e) => setUser({ ...user, university_email: e.target.value })}
                    />
                    <input
                        style={styles.input}
                        type="password"
                        placeholder="Password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                    />
                    <button style={styles.button} onClick={loginButtonHandler}>
                        Submit
                    </button>
                    <button 
                        style={styles.forgotButton} 
                        onClick={(e) => {
                            e.preventDefault()
                            setShowForgotPassword(true)
                        }}
                    > 
                        Forgot Password?
                    </button>
                </form>
            ) : (
                <form style={styles.form}>
                    <h2 style={styles.heading}>Reset Password</h2>
                    <input
                        style={styles.input}
                        type="email"
                        placeholder="Enter your university email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                    />
                    <button style={styles.button} onClick={forgotPasswordHandler}>
                        Send Reset Link
                    </button>
                    <button 
                        style={styles.forgotButton}
                        onClick={(e) => {
                            e.preventDefault()
                            setShowForgotPassword(false)
                        }}
                    >
                        Back to Login
                    </button>
                </form>
            )}
        </div>
        </>
    )
}

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(to right, #6a11cb, #2575fc)",
        color: "#fff",
    },
    form: {
        background: "#fff",
        padding: "20px 40px",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        width: "300px",
    },
    heading: {
        marginBottom: "20px",
        fontSize: "24px",
        color: "#333",
    },
    input: {
        width: "100%",
        padding: "10px",
        margin: "10px 0",
        borderRadius: "5px",
        border: "1px solid #ccc",
        fontSize: "16px",
        color: "black",
    },
    button: {
        background: "linear-gradient(to right, #6a11cb, #2575fc)",
        color: "#fff",
        border: "none",
        padding: "10px 20px",
        borderRadius: "5px",
        fontSize: "16px",
        cursor: "pointer",
        marginTop: "10px",
        marginBottom:"10px",
        marginLeft: "10px",
        transition: "transform 0.2s",
    },
    forgotButton: {
    
        background: "none",
        color: "#6a11cb",
        border: "none",
        padding: "10px 0",
        fontSize: "14px",
        textDecoration: "underline",
        cursor: "pointer",
        marginTop: "10px",
    },
};

