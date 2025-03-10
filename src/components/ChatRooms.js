import React, { useState } from "react";
import Search from './Search.js'
import RoomOverview from "./RoomOverview.js";
import { IconEdit } from '@tabler/icons-react';
import { IconFilter } from '@tabler/icons-react';

export default function ChatRooms() {

const rooms = [
  { name: "General Chat", lastMessage: "Hey everyone, what's up?", date: "2024-03-01 14:30" },
  { name: "Gaming Hub", lastMessage: "Anyone up for a Valorant match?", date: "2024-03-02 18:45" },
  { name: "Tech Talk", lastMessage: "Did you check out the new AI update?", date: "2024-03-03 09:15" },
  { name: "Movies & TV", lastMessage: "Oppenheimer was amazing, thoughts?", date: "2024-02-28 22:00" },
  { name: "Music Lovers", lastMessage: "New Drake album just dropped!", date: "2024-03-04 16:10" },
  { name: "Coding Club", lastMessage: "How do I optimize this React component?", date: "2024-03-05 11:20" },
  { name: "Photography", lastMessage: "Check out this sunset I captured!", date: "2024-03-06 19:30" },
  { name: "Work Discussions", lastMessage: "Meeting rescheduled to 3 PM.", date: "2024-03-07 08:50" },
  { name: "Fitness Freaks", lastMessage: "Leg day is the best day!", date: "2024-03-08 12:25" },
  { name: "Foodies", lastMessage: "Tried that new sushi place, it’s fire!", date: "2024-03-09 14:55" },
  { name: "Travel Buddies", lastMessage: "Just landed in Paris!", date: "2024-03-01 17:40" },
  { name: "Book Club", lastMessage: "Starting 'Atomic Habits' this week!", date: "2024-02-27 10:05" },
  { name: "Crypto & Stocks", lastMessage: "Bitcoin is on the rise again!", date: "2024-02-29 21:15" },
  { name: "Meme Sharing", lastMessage: "😂😂 This meme killed me!", date: "2024-03-03 13:20" },
  { name: "Random Chats", lastMessage: "What’s your go-to midnight snack?", date: "2024-03-04 00:45" }
];

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
                <RoomOverview name = {room.name} message = {room.lastMessage} date = {room.date}/>
            ))}
        </div>
    
    </div>
    </>
  );
}

