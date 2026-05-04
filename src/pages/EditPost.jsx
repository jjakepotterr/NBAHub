import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate, useParams } from 'react-router-dom'

function EditPost() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [flag, setFlag] = useState('Discussion')

    useEffect(() => {
        const fetchPost = async () => {
            const { data, error } = await supabase
                .from('posts')
                .select()
                .eq('id', id)
                .single()

            if (error) console.error(error)
            else {
                setTitle(data.title)
                setContent(data.content || '')
                setImageUrl(data.image_url || '')
                setFlag(data.flag || 'Discussion')
            }
        }
        fetchPost()
    }, [id])

    const handleSubmit = async () => {
        if (!title) {
            alert('Title is required!')
            return
        }

        const { error } = await supabase
            .from('posts')
            .update({ title, content, image_url: imageUrl, flag })
            .eq('id', id)

        if (error) console.error(error)
        else navigate(`/posts/${id}`)
    }

    return (
        <div className="form-container">
            <input
                className="form-input"
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                className="form-textarea"
                placeholder="Content (Optional)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <select
                className="form-select"
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
            >
                <option value="Discussion">💬 Discussion</option>
                <option value="Question">❓ Question</option>
                <option value="Opinion">💭 Opinion</option>
                <option value="News">📰 News</option>
            </select>
            <input
                className="form-input"
                type="text"
                placeholder="Image URL (Optional)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
            />
            <button className="btn-primary" onClick={handleSubmit}>Update Post</button>
        </div>
    )
}

export default EditPost