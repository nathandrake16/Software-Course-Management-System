"use client"
import axios from "axios"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LogIn(){
    const router = useRouter()
    // useEffect(() => {
    //     const fetchData = async()=> {
    //         const response = await axios.get("/api/residents/userinfo")
    //         if (response.data.logged_in === true) router.push("/")
    //     }
    //     fetchData();
    //   }, []);
      
    const [user,setUser] = useState({
        university_email: "",
        password: "",
    })
    const loginButtonHandler = async (e) => {
        e.preventDefault()
        try {
            console.log(user)
            const response = await axios.post("/api/users/login",user)
            console.log(response.data)
            router.push("/users/")
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <>
        <h1>log in</h1>
            <form>
                <input type="text" placeholder="university_email" value={user.university_email} onChange={(e) => setUser({...user,university_email: e.target.value})}></input><br></br>
                <input type="text" placeholder="password" value={user.password} onChange={(e) => setUser({...user,password: e.target.value})}></input><br></br>
                <button onClick={loginButtonHandler}>Submit</button>
            </form>
        </>
    )
}