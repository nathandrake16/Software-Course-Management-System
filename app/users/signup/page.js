"use client"
import axios from "axios"
import  { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

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
    })
    const signupButtonHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post("/api/users/signup",user)
            router.push("/users/login")
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <>
            <form>
                <input type="text" placeholder="name" value={user.name} onChange={(e) => setUser({...user,name: e.target.value})}></input> <br></br>
                <input type="email" placeholder="email" value={user.university_email} onChange={(e) => setUser({...user,university_email: e.target.value})}></input> <br></br>
                <input type="id" placeholder="id" value={user.id} onChange={(e) => setUser({...user,id: e.target.value})}></input> <br></br>
                <input type="password" placeholder="password" value={user.password} onChange={(e) => setUser({...user,password: e.target.value})}></input> <br></br>

                <button onClick={signupButtonHandler}>Submit</button>
            </form>
        </>
    )
}