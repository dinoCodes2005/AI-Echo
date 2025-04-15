import React, { useEffect, useRef, useState } from "react";
import { IconBrandTelegram } from "@tabler/icons-react";
import { IconMicrophone } from "@tabler/icons-react";
import { IconTrash } from "@tabler/icons-react";
import Picker from "emoji-picker-react";
import axios from "axios";
import useCheckAuthentication from "../api/fetchUser";

export default function Input(props) {
  const [micActive, setMicActive] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [slug, setSlug] = useState("");
  const { username, isLoggedIn } = useCheckAuthentication();

  useEffect(() => {
    const url = window.location.href;
    const slug = url.split("/").pop();
    setSlug(slug);
  }, []);

  console.log(slug, props.message);

  const handleChange = (e) => {
    setMessage(e.target.value);
    console.log(message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/chatapp/api/create/",
        {
          message: message,
          room: slug,
          user: username,
        }
      );

      if (response.data.success) {
        props.parentValue({
          message: message,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setMessage("");
  };

  return (
    <>
      <Picker
        className={`origin-bottom-left absolute transition-all duration-100 ${
          emojiOpen ? "scale-1 hidden" : "scale-0 inline-block"
        }`}
      />

      <div class="flex flex-row items-center h-16 bg-gray-900 w-full px-4">
        <button
          class=" flex items-center justify-center h-full w-12 text-gray-400 hover:text-white"
          onClick={() => {
            setEmojiOpen(!emojiOpen);
          }}
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </button>
        <button class="flex items-center justify-center text-gray-400 hover:text-white">
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            ></path>
          </svg>
        </button>
        <div class="flex-grow w-full ml-4">
          <div class="relative w-full flex items-center justify-center">
            <button
              className={`absolute left-0 p-2 top-0 origin-left transition-all duration-200 flex items-center justify-center h-full w-12 text-red-600 ${
                micActive ? "scale-1" : "scale-0"
              }`}
              onClick={() => setMicActive(!micActive)}
            >
              <IconTrash stroke={2} />
            </button>

            <form action="" className="flex w-full" onSubmit={handleSubmit}>
              <input
                type="text"
                class={`flex w-full focus:outline-none focus:ring-sky-700 focus:ring-2 mr-2 bg-sky-950 focus:bg-blue-950 text-white rounded-xl ${
                  micActive ? "pl-10" : "pl-4"
                } h-10`}
                placeholder="Type a message"
                value={message}
                onChange={handleChange}
              />
              <button
                class="flex items-center justify-center bg-blue-500 hover:bg-blue-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
                onClick={handleSubmit}
              >
                <IconBrandTelegram stroke={2} />
              </button>
            </form>

            <button
              className={` flex items-center cursor-pointer justify-center h-full w-12 text-gray-400 hover:text-white transition-all duration-200 ${
                micActive
                  ? "bg-blue-700 scale-[1.3] rounded-full text-white"
                  : "bg-transparent rounded-md"
              } `}
              onClick={() => setMicActive(!micActive)}
            >
              <IconMicrophone stroke={2} className="rounded-md" />
            </button>
          </div>
        </div>
        <div class="ml-4"></div>
      </div>
    </>
  );
}
