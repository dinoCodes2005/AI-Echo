import React from 'react';
import { IconMessageChatbot } from '@tabler/icons-react';

export default function DefaultRoom() {
  return (
    <div className='bg-blue-950 w-3/5 flex flex-col justify-center items-center'>
      <IconMessageChatbot stroke={2} color="white" size={80} className='opacity-55 ' />
      <h2 className='text-3xl text-white font-semibold' style={{fontFamily:"Poppins"}}>AI Echo</h2>
      <h2 className='text-xl text-cyan-200 font-semibold opacity-70'>Chat Seamlessly with users via AI generated replies</h2>
    </div>
  )
}
