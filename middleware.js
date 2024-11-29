import { NextResponse } from 'next/server'
import { verifiedToken } from './helpers/verified_token'

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
    const currentPath = request.nextUrl.pathname
    // const verified = await verifiedToken(request)
    // console.log(verified)
    const token = request.cookies.get("token")
    if (currentPath === "/users/login" || "/users/signup" ) {
        if (token) {
            console.log("Verified user trying to access public")
            return NextResponse.redirect(new URL('/users/', request.url))
        }
    }  
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/users/login",
    "/users/signup",
    "/users/profile"
  ]
}