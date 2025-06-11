import React, { useState } from 'react';
import DataSelector from '../../components/inputs/DataSelector';
import ImageSelector from '../../components/inputs/ImageSelector';
import TagInput from '../../components/inputs/TagInput';
import { MdAdd, MdClose, MdUpdate, MdDeleteOutline } from 'react-icons/md';
import uploadImage from '../../utils/uploadimage';
import moment from 'moment';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';


const AddEditTravelStory = ({
    storyInfo,
    type,
    onClose,
    getAllStories,
}) => {

    const[visitedDate, setVisitedDate] =useState(storyInfo?.visitedDate || null);
    const[title, setTitle] = useState(storyInfo?.title || "");
    const[story, setStory] = useState(storyInfo?.story || "");
    const[storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
    const[visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation || []);

    const [error, setError] = useState("");

    const updateTravelStory = async ()=>{

        const storyId = storyInfo._id;
        try{

            let imageUrl="";

            let postData={
                title,
                story,
                imageUrl: storyInfo.imageUrl || "",
                visitedLocation,
                visitedDate: visitedDate
                    ? moment(visitedDate).valueOf()
                    : moment().valueOf(),
            };

            if (typeof storyImg === "object") {
                // Upload New Image
                const imgUploadRes = await uploadImage(storyImg);
                imageUrl = imgUploadRes.imageUrl || "";

                postData = {
                    ...postData,
                    imageUrl: imageUrl,
                };
            }

            const response = await axiosInstance.post("/edit-story/"+storyId, postData);

            if (response.data && response.data.story) {
            toast.success("Story Updated Successfully");
            // Refresh stories
            getAllStories();
            // Close modal or form
            onClose();
            }
        }
        catch(error){
            console.log(error)
            if(error.response && 
                error.response.data &&
                error.response.data.message
            ){setError(error.response.data.message);}
            else{setError("An unexpected error has occured, please try again.")}
        }
    };

    const addNewTravelStory = async ()=>{
        try{
            let imageUrl="";
            // Upload image if present
            if (storyImg) {
            const imgUploadRes = await uploadImage(storyImg);
            // Get image URL
            imageUrl = imgUploadRes.imageUrl || "";
            }

            const response = await axiosInstance.post("/add-travel-story", {
            title,
            story,
            imageUrl: imageUrl || "",
            visitedLocation,
            visitedDate: visitedDate
                ? moment(visitedDate).valueOf()
                : moment().valueOf(),
            });

            if (response.data && response.data.story) {
            toast.success("Story Added Successfully");
            // Refresh stories
            getAllStories();
            // Close modal or form
            onClose();
            }
        }
        catch(error){
            if(error.response && 
                error.response.data &&
                error.response.data.message
            ){setError(error.response.data.message);}
            else{setError("An unexpected error has occured, please try again.")}
        }
    };

    const handleAddOrUpdateClick = () => {
    console.log("Input Data:", { title, storyImg, story, visitedLocation, visitedDate });

    if (!title) {
        setError("Please enter the title");
        return;
    }

    if (!story) {
        setError("Please enter the story");
        return;
    }

    setError("");

    if (type === "edit") {
        updateTravelStory();
    } else {
        addNewTravelStory();
    }
    };

    //delete image and update
    const handleDeleteStoryImg = async()=>{
        const deleteImgRes = await axiosInstance.delete("/delete-image",{
            params:{
                imageUrl: storyInfo.imageUrl,
            },
        });

        if(deleteImgRes.data){
            const storyId = storyInfo._id;
            const postData ={
                title, 
                story,
                visitedLocation,
                visitedDate: moment().valueOf(),
                imageUrl:"",
            };

            //updating the story
            const response = await axiosInstance.post("/edit-story/" + storyId, postData);
            setStoryImg(null);
        }
    }
    
  return (
    <div className='relative'>
        <div className='flex items-center justify-between'>
            <h5 className='text-xl font-medium text-slate-700'>
                {type === "add" ? "Add Story" : "Update Story"}
            </h5>

            <div>
                <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg'>
                    {type === 'add' ? <button className='btn-small' onClick={handleAddOrUpdateClick}>
                        <MdAdd className="text-lg" /> ADD STORY
                    </button> : <>
                    <button className='btn-small' onClick={handleAddOrUpdateClick}>
                        <MdUpdate className="text-lg" /> UPDATE STORY
                    </button> 

                    </>}


                    <button className=' cursor-pointer' onClick={onClose}>
                        <MdClose className="text-xl text-slate-400" />
                    </button>
                </div>

                {error && (
                    <p className='text-red-500 text-xs pt-2 text-right'>{error}</p>
                )}
            </div>
        </div>


        <div className='flex-1 flex flex-col gap-2 pt-4'>
            <label className='input-label'>TITLE</label>
            <input type = "text" className='text-2xl text-slate-950 outline-none' 
            value={title}
            onChange={({target})=>setTitle(target.value)}
            placeholder="Enter your title" />
            <div className='my-3'>
                <DataSelector date={visitedDate} setDate={setVisitedDate}/>
            </div>

            <ImageSelector image={storyImg} setImage={setStoryImg} handleDeleteImg={handleDeleteStoryImg} />

            <div className='flex flex-col gap-2 mt-4'>
                <label className='input-label'>STORY</label>
                <textarea
                type="text"
                className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
                placeholder='Your Experience'
                rows={10}
                value={story}
                onChange={({target})=>setStory(target.value)}/>

            </div>

            <div className='pt-3'>
                <label className='input-label' >VISITED LOCATIONS</label>
                <TagInput tags={visitedLocation} setTags={setVisitedLocation}/>
            </div>
        </div>
    </div>
  )
}

export default AddEditTravelStory