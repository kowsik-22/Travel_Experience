import React from 'react'
import {FaHeart} from 'react-icons/fa6';
import moment from 'moment';
import {GrMapLocation} from 'react-icons/gr';

const TravelStoryCard = ({
    imgUrl,
    title,
    date,
    story,
    visitedLocation,
    isFavorite,
    onFavoriteClick,
    onClick,
}) => {
  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden bg-white hover:shadow-lg hover:shadow-slate-200 transition-all ease-in-out cursor-pointer relative">
        <img
        src={imgUrl}
        alt={title}
        className="w-full h-56 object-cover rounded-lg"
        onClick={onClick}
        />

        <button className='w-12 h-12 items-center justify-center bg-white/40 rounded-lg border border-white/60 absolute top-4 right-4 flex hover:bg-white/50 transition-all ease-in-out' 
        onClick={onFavoriteClick}>
            <FaHeart className={`icon-btn ${isFavorite ? "text-red-500" : "text-white"}`}/>
        </button>

        <div className="p-4" onClick={onClick}>
            <div className='flex items-center gap-3'>
                <div className="flex-1 ">
                    <h6 className='text-m font-semibold'>{title}</h6>
                    <span className='text-sm text-slate-600'>
                        {date ? moment(date).format("MMM DD, YYYY") : "-"}
                    </span>
                </div>
            </div>

            <p className='text-xs text-slate-500 mt-2'>{story.slice(0, 60)}</p>

            <div className='inline-flex items-center gap-2 mt-3 text-cyan-600 text-[13px] bg-cyan-200/40 rounded mt-3 px-2 py-1'>
                <GrMapLocation className='text-sm'/>
                {visitedLocation.map((item, index) => 
                    visitedLocation.length == index+1 ? `${item}` : `${item},`
                )}
            </div>
        </div>
    </div>
  )
}

export default TravelStoryCard