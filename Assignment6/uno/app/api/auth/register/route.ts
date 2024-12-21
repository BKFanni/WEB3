import User from "@/app/models/user"
import { isError } from "@/app/models/utils";
import { z } from "zod";
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET : "test";

const registerInputValidator = z.object({
    username: z.string().trim().min(3).max(30, {
        message: "Username must be between 3 and 30 characters"
    }),
    password: z.string().trim().min(6).max(100, {
        message: "Password must be between 6 and 100 characters"
    })
})

export async function POST(request: Request) {
    const registerRequest = await request.json()
    
    // Checking for invalid requests
    if (!('username' in registerRequest && typeof registerRequest.username === "string" &&
        'password' in registerRequest && typeof registerRequest.password === "string"
    )) {
        return new Response(null, {status: 400})
    }

    // Checking for invalid input fields
    const {username, password} = registerRequest
    const errors = await registerInputValidator.safeParseAsync(
        username, password
    )
    if (!errors.success) {
        return new Response(errors.error.message, {status: 400})
    }

    try {
        let user = await User.findOne({username})
        if (user) {
            return new Response("User already exists", {status: 403})
        }

        user = new User({username, password})
        await user.save()

        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: "1h"})
        return new Response(token, {status: 200})
    } catch (err) {
        if (isError(err))
            console.error(err.message)

        return new Response(null, {status: 500})
    }
}