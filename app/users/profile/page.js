"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState({
        name: "Nafiz",  //Default values
        id: "22101045",
        university_email: "nafiz@g.bracu.ac.bd",
    });

    // Fetching the user data from the API when the component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Make the GET request to the profile API
                const response = await axios.get("/api/users/login/profiles"); // Replace with dynamic user id or email
                setUser(response.data.user);  // Set the user profile data
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    const handleChangeEmail = () => {
        alert("Change Email clicked!");
        //In_progress...

    };

    const handleChangePassword = () => {
        alert("Change Password clicked!");
        //In_progress...
    };

    const handleUpdateProfile = () => {
        alert("Update Profile clicked!");
        //In_progress...
    };

    return (
        <div style={styles.container}>
            <div style={styles.profileCard}>
                <h2 style={styles.heading}>Profile</h2>
                <div style={styles.info}>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>ID:</strong> {user.id}</p>
                    <p><strong>Email:</strong> {user.university_email}</p>
                </div>
                <div style={styles.buttonContainer}>
                    <button style={styles.button} onClick={handleChangeEmail}>
                        Change Email
                    </button>
                    <button style={styles.button} onClick={handleChangePassword}>
                        Change Password
                    </button>
                    <button style={styles.button} onClick={handleUpdateProfile}>
                        Update Profile
                    </button>
                </div>
            </div>
        </div>
    );
}
const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f4f4",
        padding: "20px",
    },
    profileCard: {
        width: "400px",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        backgroundColor: "#ffffff",
    },
    heading: {
        fontSize: "24px",
        marginBottom: "20px",
        textAlign: "center",
        color: "#333",
    },
    info: {
        marginBottom: "20px",
        lineHeight: "1.5",
        color: "#555",
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    button: {
        padding: "10px",
        border: "none",
        borderRadius: "5px",
        backgroundColor: "#007bff",
        color: "#ffffff",
        fontSize: "16px",
        cursor: "pointer",
        transition: "background-color 0.3s",
    },
    buttonHover: {
        backgroundColor: "#0056b3",
    },
};