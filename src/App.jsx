/*App.jsx job: define the layout and structure of the app (acts as the floor plan this decides furniture is placed) */
import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import CreatePost from "./pages/CreatePost"
import PostPage from "./pages/PostPage"
import EditPost from "./pages/EditPost"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import { useState, useEffect } from "react"
import { supabase } from "./supabaseClient"
import ResetPassword from "./pages/ResetPassword"
import './index.css'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [user, setUser] = useState(null)

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

  return (
    <>
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        user={user}
        setUser={setUser}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home searchQuery={searchQuery} />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/posts/:id" element={<PostPage user={user} />} />
        <Route path="/posts/:id/edit" element={<EditPost />} />
      </Routes>
    </>
  )
}

export default App