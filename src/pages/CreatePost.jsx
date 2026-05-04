import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

function CreatePost() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [imagePreview, setImagePreview] = useState('')
    const [dragOver, setDragOver] = useState(false)
    const [flag, setFlag] = useState('Discussion')
    const navigate = useNavigate()

    const handleDrop = (e) => {
        e.preventDefault()
        setDragOver(false)
        const file = e.dataTransfer.files[0]
        const reader = new FileReader()
        reader.onloadend = () => {
            setImageUrl(reader.result)
            setImagePreview(reader.result)
        }
        reader.readAsDataURL(file)
    }

    const handleFileInput = (e) => {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.onloadend = () => {
            setImageUrl(reader.result)
            setImagePreview(reader.result)
        }
        reader.readAsDataURL(file)
    }

    const handleSubmit = async () => {
        if (!title) {
            alert('Title is required!')
            return
        }

        const { error } = await supabase
            .from('posts')
            .insert({ title, content, image_url: imageUrl, flag })

        if (error) console.error(error)
        else navigate('/')
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
            <div
                className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input').click()}
            >
                {imagePreview ? (
                    <img src={imagePreview} alt="preview" className="image-preview" />
                ) : (
                    <p>🖼️ Drag & drop an image here or click to upload</p>
                )}
            </div>
            <input
                id="file-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileInput}
            />
            <button className="btn-primary" onClick={handleSubmit}>Create Post</button>
        </div>
    )
}

export default CreatePost