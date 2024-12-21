import User, { comparePasswordAsync } from "@/app/models/user"
import { isError } from "@/app/models/utils";
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET : "test";

export async function POST(request: Request) {
    const loginRequest = await request.json()
    
    // Checking for invalid requests
    if (!('username' in loginRequest && typeof loginRequest.username === "string" &&
        'password' in loginRequest && typeof loginRequest.password === "string"
    )) {
        return new Response(null, {status: 400})
    }

    const {username, password} = loginRequest
    try {
        const user = await User.findOne({username})
        if (!user) {
            return new Response("Invalid credentials", {status: 400})
        }

        const isMatch = await comparePasswordAsync(user, password)
        if (!isMatch) {
            return new Response("Invalid credentials", {status: 400})
        }

        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: "1h"})
        return new Response(token, {status: 200})
    } catch (err) {
        if (isError(err))
            console.error(err.message)

        return new Response(null, {status: 500})
    }
}