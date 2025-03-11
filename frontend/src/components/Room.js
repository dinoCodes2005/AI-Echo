import React from 'react'
import Input from './Input.js'
import { IconSearch } from '@tabler/icons-react';
import GeminiSVG from './GeminiSVG.js'
import { useState ,useReducer} from 'react';


export default function Room() {

    // const [isExpanded, setIsExpanded] = useState(false);

    const[isExpanded,toggle] = useReducer((isExpanded)=> !isExpanded , false);
  return (


        <div className="h-screen relative  w-full sm:w-3/5  bg-repeat flex-1 overflow-y-auto " style={{ backgroundImage: "url('/images/background.jpg')" }}>
            
            <div className='sticky top-0 h-16 w-full bg-gray-900 flex justify-between items-center '>
                <div className='flex items-center my-2'>
                    <a href="">
                         <img src="/images/image.png" className='rounded-full h-12 mx-3 hover:brightness-125'  alt="" />
                    </a>
                   
                    <div className='flex flex-col'>
                        <h2 className='text-white  cursor-pointer ' style={{fontFamily:"Poppins"}}>Rahul</h2>
                        <h2 className='text-blue-200 text-sm' style={{fontFamily:"Poppins"}}>Click for Info</h2>
                    </div>
                </div>
                <div className='flex mr-5 items-center'>
                    <button
                    type="button"
                    className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2  dark:bg-gray-950 dark:hover:bg-blue-950 dark:focus:ring-gray-700 dark:border-gray-700"
                    >
                        <GeminiSVG/>

                    </button>

                    <input 
                    type="text" 
                     className={`mr-2 rounded-lg bg-sky-950 focus:bg-blue-950 text-white placeholder-gray-400 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 
                        ${isExpanded ? "w-56" : "w-0"} ${isExpanded ? "p-2":"p-0"}`}
                    placeholder="Search Chats..."
                    />


                    <IconSearch stroke={2} className="text-blue-100 hover:bg-blue-700 rounded-md p-2" size={42} onClick={toggle} />
                </div>
            </div>
            <div className='fixed bottom-0 w-full sm:w-3/5 z-20 '><Input/></div>
            
        </div>


   

  )
}
