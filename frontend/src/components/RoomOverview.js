import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import slugify from "slugify";
import { IconPin } from "@tabler/icons-react";
import { IconPinFilled } from "@tabler/icons-react";

export default function RoomOverview(props) {
  const [latestMessage, setLatestMessage] = useState("");

  const currentSlug = slugify(props.name, { lower: true, strict: true });
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
      className={`transition-all duration-200 ease-in-out  hover:bg-blue-900 h-20 rounded-lg my-2 flex justify-between px-2 items-center cursor-pointer ${
        slugify(props.name.toLowerCase()) === slug ? "bg-blue-900" : ""
      }`}
      onmouse
    >
      <div className="flex w-full ">
        <img
          src={props.image}
          className="h-12 w-12 rounded-full mr-2 object-cover"
          alt=""
        />
        <div className="flex flex-col overflow-hidden w-full">
          <div className="flex justify-between">
            <h2
              className="text-white truncate"
              style={{ fontFamily: "Poppins" }}
            >
              {props.name}
            </h2>

            {/* <IconPin onClick={} stroke={1} className="text-white" />
            <IconPinFilled stroke={1} className="text-white" /> */}
          </div>

          <div className="flex justify-between">
            <h2
              className="text-blue-300 truncate"
              style={{ fontFamily: "Poppins" }}
            >
              {latestMessage[latestMessage.length - 1] ? (
                <>
                  ~{latestMessage[latestMessage.length - 1]?.user?.username}:
                  &nbsp;
                  {latestMessage[latestMessage.length - 1]?.message_content}
                </>
              ) : (
                "New Room Created !!"
              )}
            </h2>
            <h2
              className="text-blue-200 truncate"
              style={{ fontFamily: "Poppins" }}
            >
              {latestMessage[latestMessage.length - 1]?.time.slice(0, 5)}
            </h2>
          </div>
        </div>
      </div>

      {/* <h2 className='text-blue-200 truncate'>{props.date}</h2> */}
    </div>
  );
}
