import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

function Navbar({ searchQuery, setSearchQuery, darkMode, setDarkMode, user, setUser }) {
    const location = useLocation()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        setUser(null)
        navigate('/')
    }

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                <img src="/NBAlogo.svg" alt="NBA" className="navbar-logo" />
                NBAHub
            </Link>
            {location.pathname === '/' && (
                <input
                    className="search-bar"
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            )}
            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/create">Create New Post</Link>
                {user ? (
                    <>
                        <span style={{ color: 'white', fontSize: '14px' }}> {user.email}</span>
                        <button className="btn-logout" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Sign Up</Link>
                    </>
                )}
                <button
                    className="dark-mode-toggle"
                    onClick={() => setDarkMode(!darkMode)}
                >
                    {darkMode ? '☀️' : '🌙'}
                </button>
            </div>
        </nav>
    )
}

export default Navbar