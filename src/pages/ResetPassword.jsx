import { useState } from 'react'
import { supabase } from '../supabaseClient'

function ResetPassword() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    const handleReset = async () => {
        const { error } = await supabase.auth.resetPasswordForEmail(email)
        if (error) setMessage(error.message)
        else setMessage('Password reset email sent! Check your inbox.')
    }

    return (
        <div className="form-container">
            <h2>Reset Password</h2>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            <input
                className="form-input"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn-primary" onClick={handleReset}>Send Reset Email</button>
        </div>
    )
}

export default ResetPassword