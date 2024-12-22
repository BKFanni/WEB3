"use client";
import React from 'react'
import { useFormState, useFormStatus } from 'react-dom';
import './register-style.css';
import { ZodErrors } from '../components/ZodErrors';
import { registerAction, RegisterState } from '../api/auth/register-action';

const INITIAL_STATE: RegisterState = {
    zodErrors: null
}

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button disabled={pending} type="submit">
            Register
        </button>
    )
}

const RegisterForm = () => {
    const [formState, formAction] = useFormState(
        registerAction,
        INITIAL_STATE
    );

    return (
        <form action={formAction}>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" required />
            <ZodErrors error={formState?.zodErrors?.username} />

            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required />
            <ZodErrors error={formState?.zodErrors?.password} />

            <SubmitButton/>
        </form>
    )
}

export default RegisterForm