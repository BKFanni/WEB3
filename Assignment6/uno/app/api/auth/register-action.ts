/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import User from "@/app/models/database/user";
import { isError } from "@/app/models/utils";
import { z } from "zod"
import { createSession } from "./session";
import { redirect } from "next/navigation";
import { connectToDatabase } from "../db-connection";

export type RegisterState = {
    zodErrors: any
}

const registerInputValidator = z.object({
    username: z.string().trim().min(1, {
        message: "Username must be at least 1 character long"
    }),
    password: z.string().trim().min(6, {
        message: "Password must be at least 6 characters long"
    })
})

export async function registerAction(prevState: RegisterState, formData: FormData) {
    const newState: RegisterState = {
        zodErrors: null
    }
    
    // Validating inputs
    const validatedFields = registerInputValidator.safeParse({
        username: formData.get("username"),
        password: formData.get("password")
    })

    // Invalid form input
    if (!validatedFields.success) {
        newState.zodErrors = validatedFields.error.flatten().fieldErrors
        return {...prevState, ...newState}
    }

    try {
        const {username, password} = validatedFields.data

        // Database stuff
        const dbCon = await connectToDatabase()
        if (!dbCon) {
            newState.zodErrors = {username: ["Server Error! Failed to connect to database!"]}
            return {...prevState, ...newState}
        }
        let user = await User.findOne({username})

        if (user) {
            newState.zodErrors = {username: ["Username taken!"]}
            return {...prevState, ...newState}
        }

        user = new User({username, password})
        await user.save()
        dbCon.close()

        // Creating user successful, creating a session
        await createSession(user._id.toHexString())
        redirect("/")
    } catch (err) {
        if (isError(err)) {
            console.error(err.message)
            console.error(err.cause)
            console.error(err.stack)
            newState.zodErrors = {username: ["Server Error! "+err.message]}
        }
    }

    return {...prevState, ...newState}
}