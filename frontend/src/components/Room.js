import Input from "./Input.js";
import {
  IconBrandTelegram,
  IconChevronDown,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
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
import SummariseChat from "./SummariseChat.js";
import { IconDeselect } from "@tabler/icons-react";
import useIsMobile from "./UseIsMobile.js";
import Navbar from "./Navbar.js";
import { IconMoodSad } from "@tabler/icons-react";

export default function Room() {
  const location = useLocation();
  const { slug } = useParams();
  const { room } = location.state || {};
  const [isExpanded, toggle] = useReducer((isExpanded) => !isExpanded, false);
  const [profile, setProfile] = useState(false);
  const [items, setItems] = useState([]);
  const [typedMessages, setTypedMessages] = useState([]);
  const [dropdown, setDropdown] = useState(false);
  const [summarise, setSummarise] = useState(false);
  const messagesEndRef = useRef(null);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { username, isLoggedIn } = useCheckAuthentication();
  const [messages, setMessages] = useState([]);
  const [checkedMessages, setCheckedMessages] = useState([]);
  const [deselect, setDeselect] = useState(false);
  const [summarisedMessage, setSummarisedMessage] = useState(
    "No Messages Selected. Select Message using the ✔️ button beside the message to summarise them."
  );
  const [navbar, setNavbar] = useState(false);

  const isMobile = useIsMobile();

  const socketUrl = `ws://127.0.0.1:8000/ws/${slug}/`;

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    socketUrl,
    {
      onOpen: () => console.log("WebSocket connection opened on Frontend!"),
      shouldReconnect: (closeEvent) => true, // auto-reconnect
    }
  );

  useEffect(() => {
    console.log(checkedMessages);
  }, [checkedMessages]);

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

  const generateReply = (reply) => {
    setMessage(reply);
  };

  const handleSearch = (e) => {
    const regex = new RegExp(e.target.value, "i");
    messages.forEach((message) => {
      if (regex.test(message.message_content)) {
        const search = document.getElementById(message.id);
        if (search)
          search.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  };

  const summariseChat = (e) => {
    e.preventDefault();
    setDropdown(false);
    setSummarise(true);
    if (checkedMessages.length == 0) return;
    const sortedMessages = checkedMessages.sort((a, b) => a.id - b.id);
    const prompt = `You are given a list of chat messages between users.
    Summarize the conversation in plain text, with no formatting, symbols, or extra characters.
     Focus only on what was discussed. Messages:
    ${sortedMessages
      .map((msg) => `${msg.username.trim()}: ${msg.message.trim()}`)
      .join("\n")}
    My name is ${username}.`;
    fetch("http://127.0.0.1:8000/chatapp/api/fetch-reply/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt }),
    })
      .then((response) => {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        setSummarisedMessage("");
        let result = "";
        function readChunk() {
          reader.read().then(({ done, value }) => {
            if (done) return;
            const chunk = decoder.decode(value);
            result += chunk;
            setSummarisedMessage((prev) => prev + chunk);
            readChunk();
          });
        }
        readChunk();
      })
      .catch((error) => {
        console.log("Some error in getting reply in the frontend");
      });
  };

  return (
    <div className="h-screen flex overflow-hidden">
      <PanelGroup direction="horizontal">
        {!isMobile && (
          <Panel minSize={20} defaultSize={30} maxSize={40}>
            <div className="h-full ">
              <ChatRooms />
            </div>
          </Panel>
        )}

        {!isMobile && (
          <PanelResizeHandle className="w-1 bg-gray-800 hover:bg-blue-600 transition-colors" />
        )}

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
                <button
                  className="self-start m-2 hover:bg-red-600 rounded-md p-2 flex justify-center"
                  onClick={() => {
                    setCheckedMessages([]);
                    setDeselect(true);
                  }}
                >
                  <IconTrash
                    stroke={2}
                    className={`text-blue-100 focus:outline-none md:mr-2 focus:ring-2 focus:ring-blue-200  `}
                    size={20}
                  />
                  <h2
                    className=" text-md text-white hidden lg:inline-block"
                    style={{ fontFamily: "Poppins" }}
                  >
                    Delete
                  </h2>
                </button>
                <button
                  className="self-start m-2 hover:bg-red-600 rounded-md p-2 flex justify-center"
                  onClick={() => {
                    setCheckedMessages([]);
                    setDeselect(true);
                  }}
                >
                  <IconDeselect
                    stroke={2}
                    className={`text-blue-100 focus:outline-none md:mr-2 focus:ring-2 focus:ring-blue-200  `}
                    size={20}
                  />
                  <h2
                    className=" text-md text-white hidden  lg:inline-block "
                    style={{ fontFamily: "Poppins" }}
                  >
                    Deselect
                  </h2>
                </button>
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
                      <button onClick={summariseChat}> Summarise Chat</button>
                    </div>
                    <div className="bg-transparent rounded-md p-2 hover:bg-blue-950 text-gray-300 cursor-pointer">
                      Talk with Gemini
                    </div>
                  </div>

                  <SummariseChat
                    tabIndex={0}
                    summarise={summarise}
                    setSummarise={setSummarise}
                    summarisedMessage={summarisedMessage}
                    setSummarisedMessage={setSummarisedMessage}
                    setCheckedMessages={setCheckedMessages}
                  />
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
                    onKeyUp={handleSearch}
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
            {isMobile && <Navbar navbar={navbar} />}

            {/* Messages container */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {isMobile && (
                <div
                  onClick={() => {
                    setNavbar(!navbar);
                  }}
                  className="self-end mr-2 z-100 transparent right-0 fixed"
                >
                  <button
                    className={`mr-2 mt-2 origin-left duration-100 transition-all bg-slate-900 rounded p-1  `}
                  >
                    <IconChevronDown
                      stroke={2}
                      size={20}
                      className={`text-gray-400 hover:text-white ${
                        navbar && "rotate-180"
                      }`}
                    />
                  </button>
                </div>
              )}
              <div className="flex h-full flex-col pb-20">
                {messages.length > 0 ? (
                  messages.map((item, index) => (
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
                      messageId={item.id}
                      generateReply={generateReply}
                      sendJsonMessage={sendJsonMessage}
                      lastJsonMessage={lastJsonMessage}
                      setCheckedMessages={setCheckedMessages}
                      checkedMessages={checkedMessages}
                      deselect={deselect}
                      setDeselect={setDeselect}
                    />
                  ))
                ) : (
                  <div className="self-center my-auto text-white flex flex-col items-center gap-4 p-6 bg-slate-900 rounded-2xl shadow-xl border border-slate-800">
                    <h2 className="text-3xl font-semibold text-cyan-200">
                      This Room is Empty !!
                    </h2>
                    <IconMoodSad
                      stroke={2}
                      size={48}
                      className="text-blue-100"
                    />
                    <h2 className="text-lg text-center text-blue-100">
                      Send Messages Now !!
                    </h2>
                  </div>
                )}
                <div ref={messagesEndRef}></div>
              </div>
            </div>

            {/* Input area */}

            <div className="flex w-full p-4 bg-gray-900 relative items-end mt-2">
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
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    handleFormSubmit();
                  }
                }}
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
