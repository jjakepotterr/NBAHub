import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function PostPage({user}) {
    const { id } = useParams()
    const [post, setPost] = useState(null)
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')
    const [summary, setSummary] = useState('')
    const [summaryLoading, setSummaryLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchPost = async () => {
            const { data, error } = await supabase
                .from('posts')
                .select()
                .eq('id', id)
                .single()

            if (error) console.error(error)
            else setPost(data)
        }
        fetchPost()
    }, [id])

    useEffect(() => {
        const fetchComment = async () => {
            const { data, error } = await supabase
                .from('comments')
                .select('*')
                .eq('post_id', id)

            if (error) console.error(error)
            else setComments(data)
        }
        fetchComment()
    }, [id])

    const handleComment = async () => {
        if (!comment) {
            alert('comment is required to post comment')
            return
        }
        const { error } = await supabase
            .from('comments')
            .insert({ post_id: id, content: comment, user_id: user?.id })

        if (error) console.error(error)
        else {
            setComment('')
            const { data } = await supabase
                .from('comments')
                .select('*')
                .eq('post_id', id)
            setComments(data)
        }
    }

    const handleUpvote = async () => {
        const { error } = await supabase
            .from('posts')
            .update({ upvotes: post.upvotes + 1 })
            .eq('id', id)

        if (error) console.error(error)
        else setPost({ ...post, upvotes: post.upvotes + 1 })
    }

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) return

        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id)

        if (error) console.error(error)
        else navigate('/')
    }
    const handleSummary = async () => {
        setSummaryLoading(true)

        const commentsText = comments.map(c => c.content).join(', ')
        const prompt = `Summarize this NBA forum post in 2-3 sentences including the discussion:
    Title: ${post.title}
    Content: ${post.content || 'No content'}
    Upvotes: ${post.upvotes}
    Comments: ${commentsText || 'No comments yet'}`

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }]
            })
        })

        const data = await response.json()
        setSummary(data.choices[0].message.content)
        setSummaryLoading(false)
    }

    if (!post) return (
        <div className="spinner-container">
            <div className="spinner"></div>
        </div>
    )

    return (
        <div className="post-page">
            <p className="post-date">Posted {new Date(post.created_at).toLocaleDateString()}</p>
            <h1 className="post-title">{post.title}</h1>
            <span className={`flag-badge flag-${(post.flag || 'Discussion').toLowerCase()}`}>
                {post.flag || 'Discussion'}
            </span>
            {post.content && <p className="post-content">{post.content}</p>}
            {post.image_url && <img className="post-image" src={post.image_url} alt="post" />}
            <div className="post-actions">
                <button className="btn-upvote" onClick={handleUpvote}>👍 {post.upvotes} upvotes</button>
                <button className="btn-delete" onClick={handleDelete}>🗑️ Delete</button>
                <button className="btn-edit" onClick={() => navigate(`/posts/${id}/edit`)}>✏️ Edit</button>
            </div>
            <div className="comments-section">
                {comments.map(c => (
                    <p className="comment" key={c.id}>- {c.user_email}: {c.content}</p>
                ))}
                <input
                    className="comment-input"
                    placeholder="Leave a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button className="btn-comment" onClick={handleComment}>Post Comment</button>
                <div className="ai-summary">
                    <button className="btn-summary" onClick={handleSummary}>
                         Generate AI Summary...
                    </button>
                    {summaryLoading && (
                        <div className="spinner-container">
                            <div className="spinner"></div>
                        </div>
                    )}
                    {summary && (
                        <div className="summary-card">
                            <h3> AI Summary 🚀</h3>
                            <p>{summary}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PostPage