"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import NavBar from "@/components/NavBar";

export default function JoinGroupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const { id } = router.query;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/api/groups/${id}/join`, {
                name,
                university_email: email,
            });

            if (response.status === 200) {
                alert("Successfully joined the group!");
                router.push("/groups"); // Redirect to the groups page after joining
            } else {
                setError("Error joining the group.");
            }
        } catch (error) {
            console.error("Error joining group:", error);
            setError("Error joining the group.");
        }
    };

    return (
        <>
            <NavBar />
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Join Group</h1>
                {error && <div className="text-red-500">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block mb-2">
                            Name:
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border p-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-2">
                            University Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border p-2 w-full"
                            required
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                        Join Group
                    </button>
                </form>
            </div>
        </>
    );
}