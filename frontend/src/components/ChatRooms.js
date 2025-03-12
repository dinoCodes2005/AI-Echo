import React, { useState,useEffect } from "react";
import Search from './Search.js'
import RoomOverview from "./RoomOverview.js";
import { IconEdit } from '@tabler/icons-react';
import { IconFilter } from '@tabler/icons-react';
import { Link } from "react-router-dom";

const fetch_rooms_url = "http://127.0.0.1:8000/chatapp/chat-rooms/";
export default function ChatRooms() {



  const [rooms,setRooms] = useState([]);

    useEffect(()=>{
      fetch(fetch_rooms_url)
      .then((response) => response.json())
      .then((data) => setRooms(data))
      .catch((error) => console.error("Error fetching data",{error}))
    },[])



  return (
    <>
    <div className="bg-blue-950 w-2/5 h-screen hidden sm:flex flex-col resize-x px-5 border-r border-black">
        <div className="px-3 mt-5 flex justify-between">
          <h2 className=" text-3xl text-blue-100 " style={{fontFamily:"Poppins"}}>Chats</h2>
          <div className="flex gap-4">
              <IconEdit stroke={2} className="text-blue-100 hover:bg-blue-700 rounded-md p-2" size={42} />
              <IconFilter stroke={2} className="text-blue-100 hover:bg-blue-700 rounded-md p-2" size={42} />
          </div>
        </div>
        
        <Search/>
        <div className="flex-1 px-3 py-2 gap-2 overflow-auto overflow-y-auto h-full">

            {rooms.map((room)=>(
              <Link key={room.slug} to = {`/room/${room.slug}`} state={{room}}><RoomOverview name = {room.name} message = {room.name} image = {room.image} /></Link>   
            ))}
        </div>
    
    </div>
    </>
  );
}

