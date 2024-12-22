"use client";
import React from 'react'
import { useFormState } from 'react-dom';
import './login-style.css';
import { ZodErrors } from '../components/ZodErrors';
import { authAction, authState } from '../api/auth/login-action';

const INITIAL_STATE: authState = {
    zodErrors: null
}

const LoginForm = () => {
    const [formState, formAction] = useFormState(
        authAction,
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

            <button type="submit">Login</button>
        </form>
    )
}

export default LoginForm