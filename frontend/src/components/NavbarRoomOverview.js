import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import slugify from "slugify";

export default function NavbarRoomOverview(props) {
  const [latestMessage, setLatestMessage] = useState("");

  const currentSlug = slugify(props?.room?.name, { lower: true, strict: true });
  const { slug } = useParams();
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    `ws://127.0.0.1:8000/ws/${currentSlug}/`,
    {
      onOpen: () => console.log("WebSocket connection opened on Frontend!"),
      shouldReconnect: (closeEvent) => true, // auto-reconnect
    }
  );

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/chatapp/api/get-message/`,
          {
            params: {
              room: currentSlug,
            },
          }
        );
        console.log(response.data);
        setLatestMessage(response.data);
      } catch (error) {
        console.log("Error:", error);
        setLatestMessage();
      }
    };
    fetchMessages();
  }, [slug, lastJsonMessage]);
  return (
    <div
      className={`min-w-[200px] transition-all duration-200 ease-in-out hover:bg-blue-900 h-20 rounded-lg flex px-2 items-center cursor-pointer ${
        slugify(props.room.name.toLowerCase()) === currentSlug
          ? "bg-blue-900"
          : ""
      }`}
    >
      <img
        src={props.room.image}
        className="h-10 w-10 rounded-full mr-2 object-cover"
        alt=""
      />
      <div className="flex flex-col justify-center w-full overflow-hidden">
        <h2
          className="text-white truncate text-sm"
          style={{ fontFamily: "Poppins" }}
        >
          {props.room.name}
        </h2>
        <div className="flex items-center justify-between text-blue-200 text-xs w-full">
          <span className="truncate" style={{ fontFamily: "Poppins" }}>
            {latestMessage[latestMessage.length - 1] && (
              <>
                ~{latestMessage[latestMessage.length - 1]?.user?.username}:{" "}
                {latestMessage[latestMessage.length - 1]?.message_content}
              </>
            )}
          </span>
          <span style={{ fontFamily: "Poppins" }} className="text-white">
            {latestMessage[latestMessage.length - 1]?.time?.slice(0, 5)}
          </span>
        </div>
      </div>
    </div>
  );
}
