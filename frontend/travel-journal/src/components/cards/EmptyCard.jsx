import React from 'react'

const EmptyCard = ({imgsrc, message}) => {
  return (
    <div className='flex flex-col items-center justify-center mt-20'>
        <img src={imgsrc} alt="No blogs yet" className='w-24'/>
        <p className='w-1/2 text m font-medium text-slate-800 text-center leading-7 mt-5'>
        {message}
        </p>

    </div>
  )
}

export default EmptyCard