import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate, Link } from 'react-router-dom'

function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSignup = async () => {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) setError(error.message)
        else navigate('/')
    }

    return (
        <div className="form-container">
            <h2>Sign Up</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                className="form-input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className="form-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn-primary" onClick={handleSignup}>Sign Up</button>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    )
}

export default Signup