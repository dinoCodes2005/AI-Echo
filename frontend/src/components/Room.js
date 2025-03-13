import Input from "./Input.js";
import { IconSearch } from "@tabler/icons-react";
import GeminiSVG from "./GeminiSVG.js";
import { useState, useReducer, useEffect, useRef } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { IconDotsVertical } from "@tabler/icons-react";

export default function Room() {
  // const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const { slug } = useParams();
  const { room } = location.state || {};
  console.log(room);

  const [isExpanded, toggle] = useReducer((isExpanded) => !isExpanded, false);
  const [profile, setProfile] = useState(false);

  // const socket = useRef(null);
  // useEffect(()=>{

  // },[])

  return (
    <div
      className="h-screen relative  w-full sm:w-3/5  bg-repeat flex-1 overflow-y-auto "
      style={{ backgroundImage: "url('/images/background.jpg')" }}
    >
      <div
        className={`absolute top-16 z-10 h-[600px] bg-slate-950 w-[350px] rounded-lg flex justify-center items-center ${
          profile ? "scale-1" : "scale-0"
        } origin-top-left transition-all duration-200`}
      >
        <img
          src={room.image}
          className="h-48 w-48 rounded-full mx-2 object-cover hover:brightness-125"
          alt=""
        />
      </div>
      <div className="sticky top-0 h-16 w-full bg-gray-900 flex justify-between items-center ">
        <div className="flex items-center my-2">
          <a onClick={() => setProfile(!profile)}>
            <img
              src={room.image}
              className="h-12 w-12 rounded-full mx-2 object-cover hover:brightness-125"
              alt=""
            />
          </a>

          <div className="flex flex-col">
            <Link>
              <h2
                className="text-white  cursor-pointer "
                style={{ fontFamily: "Poppins" }}
              >
                {room.name}
              </h2>
              <h2
                className="text-blue-200/50 hover:text-blue-200 text-sm"
                style={{ fontFamily: "Poppins" }}
              >
                Click for Info
              </h2>
            </Link>
          </div>
        </div>
        <div className="flex mr-5 items-center">
          <button
            type="button"
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2  dark:bg-gray-950 dark:hover:bg-blue-950 dark:focus:ring-gray-700 dark:border-gray-700"
          >
            <GeminiSVG />
          </button>

          <div className="hidden sm:flex">
            <input
              type="text"
              className={`mr-2 rounded-lg bg-sky-950 focus:bg-blue-950 text-white placeholder-gray-400 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 
                        ${isExpanded ? "w-56" : "w-0"} ${
                isExpanded ? "p-2" : "p-0"
              }`}
              placeholder="Search Chats..."
            />

            <IconSearch
              stroke={2}
              className="text-blue-100  p-2 hover:bg-blue-700/30 rounded-md"
              size={42}
              onClick={toggle}
            />
          </div>

          <IconDotsVertical
            stroke={2}
            size={42}
            className="inline-block sm:hidden text-gray-400 hover:text-white p-2 hover:bg-blue-700/30 rounded-md"
          />
        </div>
      </div>
      <div className="fixed bottom-0 w-full sm:w-3/5 z-20 ">
        <Input />
      </div>
    </div>
  );
}
