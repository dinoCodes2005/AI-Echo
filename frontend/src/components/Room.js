import Input from "./Input.js";
import { IconBrandTelegram, IconSearch } from "@tabler/icons-react";
import GeminiSVG from "./GeminiSVG.js";
import { useState, useReducer, useEffect, useRef } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { IconDotsVertical } from "@tabler/icons-react";
import ChatRooms from "./ChatRooms.js";
import ChatBubble from "./ChatBubble.js";
import Picker from "emoji-picker-react";
import { IconMoodSmileBeam } from "@tabler/icons-react";
import axios from "axios";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import useCheckAuthentication from "../api/check-auth.js";
import fetchUser from "../api/fetch-user.js";
import useWebSocket, { ReadyState } from "react-use-websocket";

export default function Room() {
  const location = useLocation();
  const { slug } = useParams();
  const { room } = location.state || {};
  const [isExpanded, toggle] = useReducer((isExpanded) => !isExpanded, false);
  const [profile, setProfile] = useState(false);
  const [items, setItems] = useState([]);
  const [typedMessages, setTypedMessages] = useState([]);
  const [dropdown, setDropdown] = useState(false);
  const messagesEndRef = useRef(null);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { username, isLoggedIn } = useCheckAuthentication();
  const [messages, setMessages] = useState([]);

  const socketUrl = `ws://127.0.0.1:8000/ws/${slug}/`;

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    socketUrl,
    {
      onOpen: () => console.log("WebSocket connection opened on Frontend!"),
      shouldReconnect: (closeEvent) => true, // auto-reconnect
    }
  );

  useEffect(() => {
    if (lastJsonMessage !== null) {
      setMessages((prev) => [...prev, lastJsonMessage]);
    }
  }, [lastJsonMessage]);

  const formatTime = (timeString) => {
    if (!timeString) return "--/--";
    return timeString.slice(0, 5);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "--/--";
    return dateString.slice(5, 10);
  };

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Loads messages when the room changes
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/chatapp/api/get-message/`,
          {
            params: {
              room: room?.slug,
            },
          }
        );
        setMessages(response.data);
      } catch (error) {
        console.log("Error:", error);
        setMessages([]);
      }
    };
    fetchMessages();
  }, [slug, room.slug, lastJsonMessage]);

  // Scroll to bottom when messages are loaded or new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFormSubmit = async () => {
    if (message.trim() !== "") {
      sendJsonMessage({ message: message, username: username, room: slug });
      setMessage("");
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    console.log(message);
  };

  return (
    <div className="h-screen flex overflow-hidden">
      <PanelGroup direction="horizontal">
        <Panel minSize={20} defaultSize={30} maxSize={40}>
          <div className="h-full overflow-hidden">
            <ChatRooms />
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-gray-800 hover:bg-blue-600 transition-colors" />

        <Panel>
          <div
            className="h-screen flex flex-col bg-repeat"
            style={{ backgroundImage: "url('/images/background.jpg')" }}
          >
            {/* Profile popup */}
            <div
              className={`absolute top-16 z-10 h-[600px] bg-slate-950 w-[350px] rounded-lg flex flex-col justify-start items-center p-6 ${
                profile ? "scale-1" : "scale-0"
              } origin-top-left transition-all duration-200`}
            >
              <img
                src={room?.image || "/placeholder.svg"}
                className="h-48 w-48 rounded-full mx-2 object-cover hover:brightness-125 mb-4"
                alt=""
              />
              <h2 className="text-white text-xl font-bold mb-2">
                {room?.name}
              </h2>
              <p className="text-gray-400">Click outside to close</p>
            </div>

            {/* Header */}
            <div className="h-16 w-full bg-gray-900 flex justify-between items-center shadow-md z-10">
              <div className="flex items-center my-2">
                <img
                  onClick={() => setProfile(!profile)}
                  src={room?.image || "/placeholder.svg"}
                  className="h-12 w-12 rounded-full mx-2 object-cover hover:brightness-125 cursor-pointer"
                  alt=""
                />

                <div className="flex flex-col">
                  <h2
                    className="text-white cursor-pointer"
                    style={{ fontFamily: "Poppins" }}
                  >
                    {room?.name}
                  </h2>
                  <h2
                    className="text-blue-200/50 hover:text-blue-200 text-sm"
                    style={{ fontFamily: "Poppins" }}
                  >
                    Click for Info
                  </h2>
                </div>
              </div>

              <div className="flex mr-5 items-center">
                <div className="relative">
                  <button
                    onClick={() => {
                      setDropdown(!dropdown);
                    }}
                    type="button"
                    className="relative overflow-hidden text-white bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-gray-950 dark:focus:ring-gray-700 dark:border-gray-700 before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-all before:duration-700 hover:before:left-[100%]"
                  >
                    <GeminiSVG />
                  </button>
                  <div
                    className={`absolute flex right-0 top-[130%] rounded-md p-2 bg-slate-900 w-48 flex-col origin-top-right transition-all duration-150 z-20 ${
                      dropdown ? "scale-1" : "scale-0"
                    }`}
                  >
                    <div className="bg-transparent rounded-md p-2 hover:bg-blue-950 text-gray-300 cursor-pointer">
                      Summarise Chat
                    </div>
                    <div className="bg-transparent rounded-md p-2 hover:bg-blue-950 text-gray-300 cursor-pointer">
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
                    className="text-blue-100 p-2 hover:bg-blue-700/30 rounded-md cursor-pointer"
                    size={42}
                    onClick={toggle}
                  />
                </div>

                <IconDotsVertical
                  stroke={2}
                  size={42}
                  className="inline-block sm:hidden text-gray-400 hover:text-white p-2 hover:bg-blue-700/30 rounded-md cursor-pointer"
                />
              </div>
            </div>

            {/* Messages container */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
              <div className="flex flex-col p-4 pb-20">
                {messages.map((item, index) => (
                  <ChatBubble
                    username={
                      item.user?.username ||
                      item.user ||
                      item.sender ||
                      "Unknown"
                    }
                    currentUser={username}
                    message={item.message_content}
                    date={formatDate(item.date)}
                    time={formatTime(item.time)}
                    key={item.id || index}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input area */}

            <div className="flex w-full p-4 bg-gray-900 relative items-end">
              <button
                onClick={() => setEmojiOpen(!emojiOpen)}
                className="flex items-center justify-center h-full bg-blue-500 mr-4 hover:bg-blue-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
              >
                <IconMoodSmileBeam stroke={2} />
              </button>

              {emojiOpen && (
                <div className="absolute bottom-16 left-0 z-50">
                  <Picker />
                </div>
              )}

              <input
                type="text"
                className="flex w-full p-2 focus:outline-none focus:ring-sky-700 focus:ring-2 mr-2 bg-sky-950 focus:bg-blue-950 text-white rounded-xl h-10"
                placeholder="Type a message"
                value={message}
                onChange={handleChange}
              />

              <button
                onClick={handleFormSubmit}
                className="flex items-center justify-center h-full bg-blue-500 hover:bg-blue-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
              >
                <IconBrandTelegram stroke={2} />
              </button>
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
