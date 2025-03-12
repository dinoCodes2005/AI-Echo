import React from 'react'

export default function RoomOverview(props) {
  return (
    <div className='  transition-all duration-200 ease-in-out  hover:bg-blue-900 h-20 rounded-lg flex justify-between px-2 items-center cursor-pointer'>
        <div className='flex '> 
          <a href="">
            <img src={props.image} className='h-12 w-12 rounded-full mr-2 object-cover' alt="" />
          </a>
            <div className='flex flex-col overflow-hidden'>
                <h2 className='text-white truncate' style={{fontFamily:"Poppins"}}>{props.name}</h2>
                <h2 className='text-blue-200 truncate' style={{fontFamily:"Poppins"}}>{props.message}</h2>
            </div>
        </div>
       
        {/* <h2 className='text-blue-200 truncate'>{props.date}</h2> */}
    </div>
  )
}
