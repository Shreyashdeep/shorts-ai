import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req:Request) {
    const user= await currentUser()
    if(!user){
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
        const {priceId} = await req.json()
    }
    
}