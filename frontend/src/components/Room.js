import Input from "./Input.js";
import { IconSearch } from "@tabler/icons-react";
import GeminiSVG from "./GeminiSVG.js";
import { useState, useReducer, useEffect, useRef, useMemo } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { IconDotsVertical } from "@tabler/icons-react";
import { handleMouseDown } from "./ChatRooms.js";
import ChatBubble from "./ChatBubble.js";
import axios from "axios";

export default function Room() {
  // const [isExpanded, setIsExpanded] = useState(false);

  const location = useLocation();
  const { slug } = useParams();
  const { room } = location.state || {};

  const [isExpanded, toggle] = useReducer((isExpanded) => !isExpanded, false);
  const [profile, setProfile] = useState(false);
  const [items, setItems] = useState([]);
  const [typedMessages, setTypedMessages] = useState([]);
  const [dropdown, setDropdown] = useState(false);

  const formatTime = (timeString) => {
    return timeString.slice(0, 5);
  };

  const formatDate = (dateString) => {
    return dateString.slice(5, 10);
  };

  //loads messages when the room changes
  useEffect(() => {
    const loadMessages = async () => {
      const newMessages = await fetchMessages();
      setItems(newMessages);
    };
    loadMessages();
  }, [slug]);

  //appends new messages to the room
  useEffect(() => {
    typedMessages.map((item, index) => (
      <ChatBubble
        className="px-5"
        message={item.message}
        date={formatDate(item.date)}
        time={formatTime(item.time)}
        key={item.id}
      />
    ));
  }, [typedMessages]);

  //for rendering the loaded messages which is passed to JSX
  const loadedMessages = items.map((item, index) => (
    <ChatBubble
      className="px-5"
      message={item.message_content}
      date={formatDate(item.date)}
      time={formatTime(item.time)}
      key={item.id}
    />
  ));

  //fetching message objects
  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/chatapp/api/get-message/`,
        {
          params: {
            room: room.slug,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  //handling form submit ; data is passed from the child to the parent here
  const handleFormSubmit = ({ message, date, time }) => {
    setTypedMessages(typedMessages.concat({ message, date, time }));
  };

  return (
    <div
      className="h-screen relative  w-full sm:w-3/5 bg-repeat flex-1 overflow-y-auto pb-14"
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
          <div className="relative">
            <button
              onClick={() => {
                setDropdown(!dropdown);
              }}
              type="button"
              className="relative overflow-hidden text-white bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-gray-950  dark:focus:ring-gray-700 dark:border-gray-700 before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-all before:duration-700 hover:before:left-[100%]"
            >
              <GeminiSVG />
            </button>
            <div
              className={`absolute flex right-0 top-[130%] rounded-md p-2 bg-slate-900 w-48 flex-col origin-top-right transition-all duration-150 ${
                dropdown ? "scale-1" : "scale-0"
              }`}
            >
              <div className="bg-transparent rounded-md p-2 hover:bg-blue-950 text-gray-300">
                Summarise Chat
              </div>
              <div className="bg-transparent rounded-md p-2 hover:bg-blue-950 text-gray-300">
                Talk with Gemini
              </div>
            </div>
          </div>

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
      {loadedMessages}
      <div className="fixed bottom-0 w-full sm:w-3/5 z-20 ">
        <Input parentValue={handleFormSubmit} />
      </div>
    </div>
  );
}
