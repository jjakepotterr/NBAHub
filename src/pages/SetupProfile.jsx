import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

function SetupProfile({ user }) {
    const [username, setUsername] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async () => {
        if (!username) {
            setError('Username is required!')
            return
        }

        const { error } = await supabase
            .from('user_profiles')
            .insert({
                id: user.id,
                username,
                email: user.email
            })

        if (error) {
            setError(error.message)
        } else {
            navigate('/')
        }
    }

    return (
        <div className="form-container">
            <h2>Welcome to NBAHub! </h2>
            <p style={{ color: '#888', marginBottom: '8px' }}>Choose a username to get started</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                className="form-input"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <button className="btn-primary" onClick={handleSubmit}>
                Let's Go! 🏀
            </button>
        </div>
    )
}

export default SetupProfile