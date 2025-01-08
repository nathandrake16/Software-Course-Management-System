import jwt from 'jsonwebtoken'
import User from '@/models/userModel';
import { redirect } from 'next/navigation'




export async function GET(request, {params}) {
    try {
        const { token } = await params;
        const decoded = jwt.verify(token, process.env.SECRET);
        const user  = await User.findByIdAndUpdate(decoded.id, { verified: true });
        console.log(user)
        return new Response(null, {
            status: 307,
            headers: {
                Location: '/profile',
            },
        });
    } catch (error) {
        return new Response(null, {
            status: 307,
            headers: {
                Location: '/login?error=invalid-token',
            },
        });
    }
};