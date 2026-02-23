'use client';

import { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import ImageUploadModal from '@/app/elements/ImageUploadModal';

interface EditorProps {
formData: { content: string };
setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function Editor({ formData, setFormData }: EditorProps) {
const editorRef = useRef<HTMLDivElement>(null);
const quillRef = useRef<Quill | null>(null);

const [openMedia, setOpenMedia] = useState(false);
const cursorPosition = useRef<number>(0);

// Initialize Quill
useEffect(() => {
if (!editorRef.current || quillRef.current) return;


const modules = {
  toolbar: [
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1,2,3,4,5,6,false] }],
    ['bold','italic','underline','strike'],
    [{ color: [] }, { background: [] }],
    [{ list:'ordered' }, { list:'bullet' }],
    [{ align: [] }],
    ['blockquote','code-block'],
    ['link','image','video'],
    ['clean']
  ]
};

const formats = [
  'size',
  'header',
  'bold','italic','underline','strike',
  'color','background',
  'list',
  'indent',
  'align',
  'direction',
  'script',
  'blockquote',
  'code-block',
  'link',
  'image',
  'video'
];

quillRef.current = new Quill(editorRef.current, {
  theme: 'snow',
  placeholder: 'Write product description...',
  modules,
  formats
});

// initial value
if (formData.content) {
  quillRef.current.root.innerHTML = formData.content;
}

// update form state
quillRef.current.on('text-change', () => {
  const html = quillRef.current!.root.innerHTML;
  setFormData((prev:any)=>({ ...prev, content: html }));
});

// custom image handler → OPEN MODAL
// custom image handler → OPEN MODAL
const toolbar = quillRef.current.getModule('toolbar') as {
  addHandler: (name: string, handler: () => void) => void;
};
toolbar.addHandler('image', () => {
  const range = quillRef.current!.getSelection(true);
  cursorPosition.current = range?.index || 0;
  setOpenMedia(true);
});


}, []);

// sync when editing
useEffect(() => {
if (quillRef.current && formData.content !== quillRef.current.root.innerHTML) {
quillRef.current.root.innerHTML = formData.content || '';
}
}, [formData.content]);

// insert selected images
const handleInsertImages = (urls: string[]) => {
if (!quillRef.current) return;


let index = cursorPosition.current;

urls.forEach((url) => {
  quillRef.current!.insertEmbed(index, 'image', url);
  index += 1;
});

setOpenMedia(false);


};

return ( <div className="bg-white rounded-lg border"> <div ref={editorRef} className="min-h-[300px]" />


  <ImageUploadModal
    open={openMedia}
    multiple={true}
    onClose={() => setOpenMedia(false)}
    onSelect={handleInsertImages}
  />
</div>


);
}
