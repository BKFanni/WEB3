import React from 'react'

import "./register-style.css"
import RegisterForm from './RegisterForm'

const RegisterPage = () => {
  return (
    <div className="auth-container">
        <h2>Register</h2>
        <RegisterForm/>
    </div>
  )
}

export default RegisterPage
