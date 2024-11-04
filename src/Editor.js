import ReactQuill from 'react-quill';

const modules = {
    toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline','strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image'],
        ['clean']
      ],
}

const formats = {
    format : [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
      ]
}


export default function Editor({value, onChange}){
    return(
        <ReactQuill value={value} // ReactQuill is an npm packages used to bring a rich editor into the website
                    modules = {modules} // giving them custom modules and formats for the editor
                    formats={formats}
                    onChange={onChange}/>        
    );
}