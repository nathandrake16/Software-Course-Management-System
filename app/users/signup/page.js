"use client"
import axios from "axios"
import  { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import NavBar from "@/components/NavBar"

export default function SignupPage() {   
    const router = useRouter()
    // useEffect(() => {
    //     const fetchData = async()=> {
    //         const response = await axios.get("/api/residents/userinfo")
    //         if (response.data.logged_in === true) router.push("/")
    //     }
    //     fetchData();
    //   }, []);
    const [user,setUser] = useState({
        name: "",
        university_email: "",
        id: "",
        password: "",
        role: ""
    })
    const signupButtonHandler = async (e) => {
        e.preventDefault()
        if (user.university_email.includes("@g.bracu.ac.bd")) setUser({...user,role: "student"})
        else if (user.university_email.includes("@bracu.ac.bd")) setUser({...user,role: "faculty"})
        else {
            alert("Please use a valid university email address.");
            return;
        }
        try {
            const response = await axios.post("/api/users/signup",user)
            router.push("/users/login")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
        <NavBar></NavBar>
            <div style={styles.container}>
                <form style={styles.form}>
                    <h2 style={styles.heading}>Sign Up</h2>
                    <input 
                        style={styles.input} 
                        type="text" 
                        placeholder="Name" 
                        value={user.name} 
                        onChange={(e) => setUser({...user, name: e.target.value})}
                    />
                    <input 
                        style={styles.input} 
                        type="email" 
                        placeholder="University Email" 
                        value={user.university_email} 
                        onChange={(e) => setUser({...user, university_email: e.target.value})}
                    />
                    <input 
                        style={styles.input} 
                        type="text" 
                        placeholder="ID" 
                        value={user.id} 
                        onChange={(e) => setUser({...user, id: e.target.value})}
                    />
                    <input 
                        style={styles.input} 
                        type="password" 
                        placeholder="Password" 
                        value={user.password} 
                        onChange={(e) => setUser({...user, password: e.target.value})}
                    />
                    <button style={styles.button} onClick={signupButtonHandler}>Submit</button>
                </form>
            </div>
        </>
    );
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
        color: "black"
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
        transition: "transform 0.2s",
    },
    buttonHover: {
        transform: "scale(1.05)",
    },
};