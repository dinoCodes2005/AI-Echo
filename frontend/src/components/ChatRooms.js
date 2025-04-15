import React, { useState, useEffect } from "react";
import RoomOverview from "./RoomOverview.js";
import { IconEdit } from "@tabler/icons-react";
import { IconFilter } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { IconHeart } from "@tabler/icons-react";
import { IconUserCircle } from "@tabler/icons-react";
import { IconMessage } from "@tabler/icons-react";
import { IconX } from "@tabler/icons-react";
import { IconLibraryPlus } from "@tabler/icons-react";
import { IconLogout2 } from "@tabler/icons-react";
import axios from "axios";

export default function ChatRooms() {
  const fetch_rooms_url = "http://127.0.0.1:8000/chatapp/chat-rooms/";
  const navigate = useNavigate();
  //set rooms is for fetching the room objects
  const [rooms, setRooms] = useState([]);
  //set query is for searching
  const [query, setQuery] = useState("");
  useEffect(() => {
    fetch(fetch_rooms_url)
      .then((response) => response.json())
      .then((data) => setRooms(data))
      .catch((error) => console.error("Error fetching data", { error }));
  }, []);
  const searchedRoom = rooms.filter((room) =>
    room.name.toLowerCase().match(query.toLowerCase())
  );

  const [edit, setEdit] = useState(false);
  const [filter, setFilter] = useState(false);
  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    const accessToken = localStorage.getItem("accessToken");
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      if (refreshToken) {
        const response = await axios.post(
          "http://127.0.0.1:8000/accounts/logout/",
          { refresh: refreshToken },
          config
        );
        console.log(response);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="bg-blue-950 h-screen hidden sm:flex flex-col px-5 border-r border-black">
        <div className="px-3 mt-5 flex justify-between">
          <h2
            className=" text-3xl text-blue-100 "
            style={{ fontFamily: "Poppins" }}
          >
            Chats
          </h2>
          <div className="flex gap-4">
            <button onClick={handleLogout}>
              <IconLogout2
                stroke={2}
                className={`text-blue-100 focus:outline-none bg-red-800 focus:ring-2 focus:ring-blue-200 hover:bg-red-600 rounded-md p-2 ${
                  edit ? "bg-blue-700" : "bg-transparent"
                }`}
                size={42}
              />
            </button>
            <div className="relative">
              <IconEdit
                stroke={2}
                tabIndex={0}
                className={`text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:bg-blue-700 rounded-md p-2 ${
                  edit ? "bg-blue-700" : "bg-transparent"
                }`}
                size={42}
                onClick={() => {
                  setEdit((edit) => !edit);
                  if (filter) setFilter((filter) => false);
                }}
              />
              <div
                className={`absolute px-1 pb-1 top-[120%] bg-blue-600/40 backdrop-blur-sm h-auto origin-top-left ${
                  edit ? "scale-1" : "scale-0"
                } z-10 transition-all duration-200 rounded-md `}
              >
                <h2 className="p-2 text-white">New Chat</h2>
                <div className="h-[50px] p-2 rounded-md">
                  <input
                    type="text"
                    name=""
                    id=""
                    className="h-8 focus:outline-none p-1 rounded-md"
                    placeholder="Search by Room name"
                  />
                </div>
                <Link to={`/create-room/`}>
                  <div className="h-[50px] p-2 flex hover:bg-blue-500/40 rounded-md  items-center">
                    <IconLibraryPlus stroke={2} className=" text-white mr-2" />
                    <h2 className="text-blue-200 text-sm ">New Room</h2>
                  </div>
                </Link>
                <div className="p-2 text-blue-200 text-md">
                  Frequently Contacted
                </div>
              </div>
            </div>

            <div className="relative">
              <IconFilter
                stroke={2}
                tabIndex={0}
                className={`text-blue-100 hover:bg-blue-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                  filter ? "bg-blue-700" : "bg-transparent"
                } `}
                size={42}
                onClick={() => {
                  setFilter((filter) => !filter);
                  if (edit) setEdit((edit) => false);
                }}
              />
              <div
                className={`absolute px-1 pb-1 top-[120%] h-auto bg-blue-600/40 backdrop-blur-sm origin-top-left ${
                  filter ? "scale-1" : "scale-0"
                } z-10 transition-all duration-200 rounded-md `}
              >
                <h2 className="p-2 text-white">Filter Chats by</h2>
                <div className="h-[45px] p-2 w-[200px] hover:bg-blue-500/40 rounded-md flex items-center">
                  <IconMessage stroke={2} className="mr-2 text-blue-300" />
                  <h2 className="text-white text-sm">Unread</h2>
                </div>
                <div className="h-[45px] p-2 w-[200px] hover:bg-blue-500/40 rounded-md flex items-center">
                  <IconHeart stroke={2} className="mr-2 text-blue-300" />
                  <h2 className="text-white text-sm">Favourites</h2>
                </div>
                <div className="h-[45px] p-2 w-[200px] hover:bg-blue-500/40 rounded-md flex items-center">
                  <IconUserCircle stroke={2} className="mr-2 text-blue-300" />
                  <h2 className="text-white text-sm">Contacts</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 px-3 py-2 gap-2 overflow-auto overflow-y-auto h-full ">
          <div className="px-3 pt-5 mb-2 ">
            <div className="w-full ">
              <div className="relative flex items-center w-full h-12 rounded-full focus-within:shadow-lg bg-blue-900 focus:bg-gray-900 overflow-hidden">
                <div className="grid place-items-center h-full w-12 text-gray-300 cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  className="peer h-full w-full outline-none text-sm text-blue-100 placeholder-blue-100 px-2 pr-2 bg-blue-900 focus:bg-gray-900"
                  type="text"
                  id="search"
                  placeholder="Search something.."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <IconX
                  stroke={2}
                  className={`text-white cursor-pointer origin-right transition-all duration-200 ${
                    query.length > 0 ? "w-16" : "w-0"
                  }`}
                  onClick={() => setQuery("")}
                />
              </div>
            </div>
          </div>
          {searchedRoom.length > 0 ? (
            searchedRoom.map((room) => (
              <Link key={room.slug} to={`/room/${room.slug}`} state={{ room }}>
                <RoomOverview
                  name={room.name}
                  message={room.name}
                  image={room.image}
                />
              </Link>
            ))
          ) : (
            <h2 className="text-2xl text-white mt-10 ">No Result</h2>
          )}
        </div>
      </div>
    </>
  );
}
