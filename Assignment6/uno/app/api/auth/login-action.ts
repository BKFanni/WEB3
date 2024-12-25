/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"
import { z } from "zod"
import User, { comparePasswordAsync } from "../../models/database/user"
import { isError } from "../../models/utils"
import { createSession } from "./session";
import { redirect } from "next/navigation";
import { connectToDatabase } from "../db-connection";

export type authState = {
    zodErrors: any
}

const authInputValidator = z.object({
    username: z.string(),
    password: z.string()
})

export async function authAction(prevState: authState, formData: FormData) {
    const newState: authState = {
        zodErrors: null
    }

    // Validating inputs
    const validatedFields = authInputValidator.safeParse({
        username: formData.get("username"),
        password: formData.get("password")
    })

    // Invalid form input
    if (!validatedFields.success) {
        newState.zodErrors = validatedFields.error.flatten().fieldErrors
        return {...prevState, ...newState}
    }

    // Checking credentials
    try {
        const {username, password} = validatedFields.data

        // Database stuff
        await connectToDatabase()
        const user = await User.findOne({username})
        if (!user) {
            newState.zodErrors = {username: ["Username not found!"]}
            return {...prevState, ...newState}
        }

        const isMatch = await comparePasswordAsync(user, password)
        if (!isMatch) {
            newState.zodErrors = {password: ["Invalid password!"]}
            return {...prevState, ...newState}
        }

        // Credentials match, creating JWT cookie and redirecting to main page
        await createSession(user._id.toHexString())
    } catch (err) {
        if (isError(err)) {
            console.error(err.message)
            newState.zodErrors = {username: ["Server Error! "+err.message]}
        }
        return {...prevState, ...newState}
    }

    redirect("/")
}