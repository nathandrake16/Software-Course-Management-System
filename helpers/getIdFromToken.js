import jwt from "jsonwebtoken"

export const getIdFromToken = async (request) =>{
    try {
        const token = request.cookies.get("token")
        if (token == null) return null
        const decodedToken = jwt.verify(token.value, process.env.SECRET)
        return decodedToken.id
    } catch (error) {
        console.log( error)
    }
    
}