import { useState } from 'react';
import {Navigate} from 'react-router-dom';
//import ReactQuill from 'react-quill';
import Editor from '../Editor';

// react function for creating a BLOG POST

export default function CreatePost(){
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);
    async function createNewPost(ev){
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('file',files[0]);
        ev.preventDefault();
        //console.log(files);
        const response = await fetch('http://localhost:4000/post',{
            method: 'POST',
            body: data,
            credentials: 'include',
        });
        if (response.ok) {
            setRedirect(true);
        }
        //console.log(await response.json());
    }
    if (redirect) {
        return <Navigate to = {'/'} />
    }
    return (
        <form className = "create" onSubmit={createNewPost}>
            <input type="title" 
                    placeholder="Title" 
                    value={title}
                    onChange={(ev) => setTitle(ev.target.value)}/>
            <input type="summary" 
                    placeholder="Summary" 
                    value={summary}
                    onChange={(ev) => setSummary(ev.target.value)}/>
            <input type='file'
                    onChange={(ev) => setFiles(ev.target.files)}/>
            <Editor onChange={setContent} value={content} />
            <button type='submit' style={{marginTop: '5px'}}>Create Post </button>         
        </form>
    )
}