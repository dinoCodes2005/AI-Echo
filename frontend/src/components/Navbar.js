import React, { useEffect, useState } from "react";
import {
  IconArrowDown,
  IconHelpCircle,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { IconArrowDownBar } from "@tabler/icons-react";
import { IconChevronDown } from "@tabler/icons-react";
import { Link, useParams } from "react-router-dom";
import RoomOverview from "./RoomOverview";
import slugify from "slugify";
import NavbarRoomOverview from "./NavbarRoomOverview";
import fetchUser from "../api/fetch-user";

export default function Navbar(props) {
  const [rooms, setRooms] = useState([]);
  const fetch_rooms_url = "http://127.0.0.1:8000/chatapp/chat-rooms/";
  const [latestMessage, setLatestMessage] = useState("");
  const [user, setUser] = useState();

  const { slug } = useParams();

  useEffect(() => {
    fetch(fetch_rooms_url)
      .then((response) => response.json())
      .then((data) => setRooms(data))
      .catch((error) => console.error("Error fetching data", { error }));

    const fetchData = async () => {
      const userData = await fetchUser();
      setUser(userData.profile);
    };
    fetchData();
  }, []);

  return (
    <div
      className={`${
        props.navbar ? "h-auto py-2" : "h-0 py-0"
      } px-3 gap-2  scrollbar-hide overflow-y-hidden origin-top transition-all duration-200 bg-slate-950`}
    >
      <div className="flex justify-end items-center space-x-4 mb-2 text-cyan-100 text-xl ">
        <Link to={""}>
          <IconHelpCircle size={22} />
        </Link>
        <Link to={"/settings/"}>
          <IconSettings size={22} />
        </Link>
        <Link to={"/profile/"}>
          <img
            className="size-6 rounded-full object-cover"
            src={user?.profileImage}
            alt=""
          />
        </Link>
      </div>

      <div className="flex flex-nowrap space-x-4 overflow-x-auto scrollbar-hide scrollbar scrollbar-thin">
        {rooms.map((room) => (
          <Link key={room.slug} to={`/room/${room.slug}`} state={{ room }}>
            <NavbarRoomOverview room={room} />
          </Link>
        ))}
      </div>
    </div>
  );
}
