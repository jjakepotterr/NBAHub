import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Link } from 'react-router-dom'

function Home({ searchQuery }) {
    const [posts, setPosts] = useState([])
    const [orderBy, setOrderBy] = useState('created_at')
    const [loading, setLoading] = useState(true)
    const [filterFlag, setFilterFlag] = useState('All')

    useEffect(() => {
        const fetchPosts = async () => {
            const { data, error } = await supabase
                .from('posts')
                .select()
                .order(orderBy, { ascending: false })

            if (error) console.error(error)
            else {
                setPosts(data)
                setLoading(false)
            }
        }
        fetchPosts()
    }, [orderBy])

    const filteredPosts = posts
        .filter(post => post.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter(post => filterFlag === 'All' || (post.flag || 'Discussion') === filterFlag)

    if (loading) return (
        <div className="spinner-container">
            <div className="spinner"></div>
        </div>
    )

    return (
        <div className="home-container">
            <div className="sort-buttons">
                <span>Order by: </span>
                <button className="sort-btn" onClick={() => setOrderBy('created_at')}>Newest</button>
                <button className="sort-btn" onClick={() => setOrderBy('upvotes')}>Most Popular</button>
            </div>
            <div className="flag-filters">
                <span>Filter: </span>
                {['All', 'Discussion', 'Question', 'Opinion', 'News'].map(f => (
                    <button
                        key={f}
                        className={`flag-btn ${filterFlag === f ? 'active' : ''}`}
                        onClick={() => setFilterFlag(f)}
                    >
                        {f}
                    </button>
                ))}
            </div>
            {filteredPosts.map(post => (
                <Link to={`/posts/${post.id}`} key={post.id} className="post-card">
                    <p className="post-date">Posted {new Date(post.created_at).toLocaleDateString()}</p>
                    <span className={`flag-badge flag-${(post.flag || 'Discussion').toLowerCase()}`}>
                        {post.flag || 'Discussion'}
                    </span>
                    <h2 className="post-title1">{post.title}</h2>
                    <p className="post-upvotes">{post.upvotes} upvotes</p>
                </Link>
            ))}
        </div>
    )
}

export default Home