/*App.jsx job: define the layout and structure of the app (acts as the floor plan this decides furniture is placed) */
import { Routes, Route, useNavigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import UserProfile from "./pages/UserProfile"
import CreatePost from "./pages/CreatePost"
import PostPage from "./pages/PostPage"
import EditPost from "./pages/EditPost"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import { useState, useEffect } from "react"
import { supabase } from "./supabaseClient"
import SetupProfile from "./pages/SetupProfile"
import ResetPassword from "./pages/ResetPassword"
import './index.css'

function App() {
  const [username, setUsername] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : ''
  }, [darkMode])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
  }, [])

  useEffect(() => {
    const checkProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from('user_profiles')
          .select()
          .eq('id', user.id)
          .single()

        if (!data) {
          navigate('/setup-profile')
        }
      }
    }
    checkProfile()
  }, [user])

  return (
    <>
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        user={user}
        setUser={setUser}
        username={username}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/setup-profile" element={<SetupProfile user={user} />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<Home searchQuery={searchQuery} />} />
        <Route path="/profile" element={<UserProfile user={user} username={username} />} />
        <Route path="/create" element={<CreatePost user={user} />} />
        <Route path="/posts/:id" element={<PostPage user={user} />} />
        <Route path="/posts/:id/edit" element={<EditPost user={user} />} />
      </Routes>
    </>
  )
}

export default App