import jwt from "jsonwebtoken"

export const verifiedToken = async (request) =>{
    try {
        const token = request.cookies.get("token")
        const decodedToken = await jwt.verify(token.value, process.env.SECRET)
        return !(decodedToken.id === null)
    } catch (error) {
        console.log( error)
    }
    
}