import Link from 'next/link'
import React from 'react'
import "./login-styles.css"

const LoginPage = () => {

  return (
    <div className="auth-container">
        <h2>Login</h2>
        <LoginPage/>
        
        <p>Don&apos;t have an account? <Link href="/register">Register here</Link></p>
    </div>
  )
}

export default LoginPage
