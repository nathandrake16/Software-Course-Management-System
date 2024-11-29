"use client"
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react"
import Link from "next/link";
import axios from "axios";

export function AuthFunctions() {
    const [message, setMessage] = useState("Loading");
    useEffect(() => {
        const fetchData = async()=> {
          const response = await axios.get("/api/users/userinfo")
          console.log(response.data)
          if (response.data.logged_in === true) {
            if (response.data.user.role === "faculty") setMessage(`Welcome, ${response.data.user.name}! You are a faculty`)
            else setMessage(`Welcome, ${response.data.user.name}! You are a student`)
          }
        }
        fetchData();
      }, []);

    const router = useRouter()
    const logoutHandler = async (e) => {
    e.preventDefault()
    await axios.get("/api/users/logout")
    router.push("/users/login")
  }
  return (
    <>
       { !(message==="Loading") ? 
      
       <>  
        {message} <br></br>
          <button onClick={logoutHandler}>Log Out</button>
        </>
        :
        <>
          
          <Link href="/users/login">Login</Link> &nbsp;
          <Link href="/users/signup">Sign Up</Link> 
        </>
        }
    </>
  );
}