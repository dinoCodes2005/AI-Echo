import React, { useEffect, useState } from "react";
import { IconArrowDown } from "@tabler/icons-react";
import { IconArrowDownBar } from "@tabler/icons-react";
import { IconChevronDown } from "@tabler/icons-react";
import { Link, useParams } from "react-router-dom";
import RoomOverview from "./RoomOverview";
import slugify from "slugify";

export default function Navbar(props) {
  const [rooms, setRooms] = useState([]);
  const fetch_rooms_url = "http://127.0.0.1:8000/chatapp/chat-rooms/";
  const { slug } = useParams();

  useEffect(() => {
    fetch(fetch_rooms_url)
      .then((response) => response.json())
      .then((data) => setRooms(data))
      .catch((error) => console.error("Error fetching data", { error }));
  }, []);
  return (
    <div
      className={`${
        props.navbar ? "h-auto py-2" : "h-0 py-0"
      } px-3 gap-2 overflow-x-auto scrollbar-hide  overflow-y-hidden origin-top transition-all duration-200 bg-slate-950`}
    >
      <div className="flex flex-nowrap space-x-4">
        {rooms.map((room) => (
          <Link key={room.slug} to={`/room/${room.slug}`} state={{ room }}>
            <div
              className={`min-w-[200px] transition-all duration-200 ease-in-out hover:bg-blue-900 h-20 rounded-lg flex justify-between px-2 items-center cursor-pointer ${
                slugify(room.slug.toLowerCase()) === slug ? "bg-blue-900" : ""
              }`}
            >
              <div className="flex">
                <img
                  src={room.image}
                  className="h-12 w-12 rounded-full mr-2 object-cover"
                  alt=""
                />
                <div className="flex flex-col overflow-hidden">
                  <h2
                    className="text-white truncate"
                    style={{ fontFamily: "Poppins" }}
                  >
                    {room.name}
                  </h2>
                  <h2
                    className="text-blue-200 truncate"
                    style={{ fontFamily: "Poppins" }}
                  >
                    {room.name}
                  </h2>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
