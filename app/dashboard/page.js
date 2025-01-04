"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "@/components/NavBar"; // Ensure this path is correct
import Link from "next/link";

export default function Dashboard() {
    const [user, setUser ] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get("/api/users/userinfo");
                if (response.data.user) {
                    setUser (response.data.user);
                } else {
                    setError("User  information not found");
                }
            } catch (error) {
                setError("Failed to fetch user information");
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <NavBar />
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">
                    Welcome, {user.name}, {user.role}
                </h1>

                {user.role === "faculty" && <FacultyDashboard user={user} />}
                {user.role === "student" && <StudentDashboard user={user} />}
            </div>
        </>
    );
}

function FacultyDashboard() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard 
                title="Manage Sections" 
                description="Create and manage course sections"
                href="/sections"
                icon="📚"
            />
            <DashboardCard 
                title="Create New Section" 
                description="Add a new section for courses"
                href="/sections"// Link to the CreateSection component
                icon="➕"
            />
            <DashboardCard 
                title="Course Management" 
                description="Add and manage course materials"
                href="/courses"
                icon="📝"
            />
            <DashboardCard 
                title="Student Enrollment" 
                description="View and manage student enrollments"
                href="/enrollments"
                icon="👥"
            />
            <DashboardCard 
                title="Assignments" 
                description="Create and manage assignments"
                href="/assignments"
                icon="📋"
            />
            <DashboardCard 
                title="Grading" 
                description="Grade student submissions"
                href="/grading"
                icon="📊"
            />
            <DashboardCard 
                title="Profile" 
                description="Manage your profile settings"
                href="/profile"
                icon="👤"
            />
            <DashboardCard 
                title="Manage Groups" 
                description="Create and manage student groups"
                href="/groups" // Link to the Manage Groups component
                icon="🗂️"
            />
        </div>
    );
}

function StudentDashboard({ user }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard 
                title="Manage Sections" 
                description="Create and manage course sections"
                href="/sections"
                icon="📚"
            />
            <DashboardCard 
                title="Create New Section" 
                description="Add a new section for courses"
                href="/sections" // Link to the CreateSection component
                icon="➕"
            />
            <DashboardCard 
                title="Course Management" 
                description="Add and manage course materials"
                href="/courses"
                icon="📝"
            />
            <DashboardCard 
                title="Student Enrollment" 
                description="View and manage student enrollments"
                href="/enrollments"
                icon="👥"
            />
            <DashboardCard 
                title="Assignments" 
                description="Create and manage assignments"
                href="/assignments"
                icon="📋"
            />
            <DashboardCard 
                title="Grading" 
                description="Grade student submissions"
                href="/grading"
                icon="📊"
            />
            <DashboardCard 
                title="Profile" 
                description="Manage your profile settings"
                href="/profile"
                icon="👤"
            />
            <DashboardCard 
                title="Group Details" 
                description="View and manage your groups"
                href="/groups" // Link to the Group Details component
                icon="📋🔍"
            />
        </div>    );
}

function DashboardCard({ title, description, href, icon }) {
    return (
        <Link href={href} className="block">
            <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{icon}</div>
                <h2 className="text-xl font-semibold mb-2">{title}</h2>
                <p className="text-gray-600">{description}</p>
            </div>
        </Link>
    );
}