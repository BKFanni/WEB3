import Link from 'next/link'
import React from 'react'
import "./login-style.css"
import LoginForm from './LoginForm'

const LoginPage = () => {

  return (
    <div className="auth-container">
        <h2>Login</h2>
        <LoginForm/>
        
        <p>Don&apos;t have an account? <Link href="/register">Register here</Link></p>
    </div>
  )
}

export default LoginPage
