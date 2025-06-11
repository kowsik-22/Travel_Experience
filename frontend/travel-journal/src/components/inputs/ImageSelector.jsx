import React, { useState, useRef, useEffect } from 'react'
import { FaRegFileImage } from 'react-icons/fa6';
import { MdDeleteOutline } from 'react-icons/md';

const ImageSelector = ({image, setImage, handleDeleteImg}) => {
    const inputRef= useRef(null)
    const[previewUrl, setPreviewUrl] = useState(null)

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if(file){
            setImage(file)
        }
    };

    const handleRemoveImage=()=>{
        setImage(null)
        handleDeleteImg();
    }

    const onChooseFile = ()=> {
        inputRef.current.click()
    }

    useEffect(() => {
        //if img prop is url, set it as preview url
        // else if its a file obj, create preview url
        // else clear preview url
      if(typeof image=='string'){
        setPreviewUrl(image);
      }else if(image){
        setPreviewUrl(URL.createObjectURL(image));
      }else{
        setPreviewUrl(null);
      }
    
      return () => {
        if(previewUrl && typeof previewUrl==='string' && !image){
            URL.revokeObjectURL(previewUrl);
        }
      }
    }, [image])
    
  return (
    <div>

        <input 
        type="file"
        accept='image/*'
        ref={inputRef}
        onChange={handleImageChange} 
        className='hidden'
        />

        {!image ? <button className='w-full h-[220px] flex flex-col items-center justify-center gap-3 bg-slate-100 border border-slate-300 rounded cursor-pointer ' onClick={()=>onChooseFile()}>
            <div className=''>
                <FaRegFileImage className='text-xl text-cyan-500'/>
            </div>

            <p className='text-sm text-slate-500'> Browse files</p>
        </button>  : 
        <div className='w-full relative'>
            <img src={previewUrl} alt="Selected" className='w-full h-[300px] object-cover rounded-lg '/>

            <button className='btn-small btn-delete absolute top-2 right-2' onClick={handleRemoveImage}>
                <MdDeleteOutline className=' text-lg'/>
            </button>
        </div>
    
    }   
    </div>
  )
}

export default ImageSelector