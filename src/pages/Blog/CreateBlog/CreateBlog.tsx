// import { useState } from 'react'
// import ReactQuill from 'react-quill'
// import 'react-quill/dist/quill.snow.css'
// import styles from './CreateBlog.module.scss'

function CreateBlog() {
    //     const [title, setTitle] = useState('')
    //     const [content, setContent] = useState('')
    //     const [featureImage, setFeatureImage] = useState(null)
    //     const [aiLoading, setAiLoading] = useState(false)

    //     const handleImageUpload = (event) => {
    //         const file = event.target.files[0]
    //         if (file) {
    //             const reader = new FileReader()
    //             reader.onloadend = () => setFeatureImage(reader.result)
    //             reader.readAsDataURL(file)
    //         }
    //     }

    //     const generateAIContent = async () => {
    //         setAiLoading(true)
    //         try {
    //             const response = await fetch('https://api.openai.com/v1/completions', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     Authorization: `Bearer YOUR_OPENAI_API_KEY`
    //                 },
    //                 body: JSON.stringify({
    //                     model: 'text-davinci-003',
    //                     prompt: `Viết một đoạn nội dung cho bài blog có tiêu đề: ${title}`,
    //                     max_tokens: 150
    //                 })
    //             })
    //             const data = await response.json()
    //             setContent(data.choices[0].text)
    //         } catch (error) {
    //             console.error('Lỗi khi tạo nội dung AI:', error)
    //         }
    //         setAiLoading(false)
    //     }

    //     return (
    //         <div className={styles.container}>
    //             <div className={styles.blogForm}>
    //                 <h2>Create Post</h2>
    //                 <label>Title</label>
    //                 <input type='text' placeholder='Title...' value={title} onChange={(e) => setTitle(e.target.value)} />
    //                 <div className={styles.imageUpload}>
    //                     <label>Feature Image</label>
    //                     <input type='file' accept='image/*' onChange={handleImageUpload} />
    //                     {featureImage && <img src={featureImage} alt='Feature' className={styles.previewImage} />}
    //                 </div>
    //                 <label>Content</label>
    //                 <ReactQuill theme='snow' value={content} onChange={setContent} />
    //                 <button onClick={generateAIContent} disabled={aiLoading}>
    //                     {aiLoading ? 'Generating...' : 'Generate with AI'}
    //                 </button>
    //                 <button className={styles.submitBtn}>Create Post</button>
    //             </div>
    //             <div className={styles.recentPosts}>
    //                 <h3>Recent Posts</h3>
    //                 <ul>
    //                     <li>
    //                         <strong>DESIGN PROCESS</strong>
    //                         <br />
    //                         Our 15 favorite websites from August
    //                     </li>
    //                     <li>
    //                         <strong>INSPIRATION</strong>
    //                         <br />
    //                         <span className={styles.highlight}>The beginners guide to user research</span>
    //                     </li>
    //                     <li>
    //                         <strong>INSPIRATION</strong>
    //                         <br />
    //                         Web page layout 101: website anatomy every designer needs to learn
    //                     </li>
    //                     <li>
    //                         <strong>FREELANCING</strong>
    //                         <br />
    //                         10 essential sections to a high landing page
    //                     </li>
    //                 </ul>
    //             </div>
    //         </div>
    //     )
    return <div>create</div>
}

export default CreateBlog
