import React, { useState } from "react";
import { IconArrowDown } from "@tabler/icons-react";

export default function ChatBubble(props) {
  const [pop, setPop] = useState(false);
  return (
    <div
      className="flex m-4 space-x-3 max-w-[600px]"
      onMouseEnter={() => {
        setPop(true);
      }}
      onMouseLeave={() => {
        setPop(false);
      }}
    >
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
      <div className="flex items-center">
        <div className="bg-slate-900 flex flex-col p-3 rounded-r-lg max-w-full rounded-bl-lg">
          <p className="text-sm text-cyan-100">{props.message} </p>
          <span className="text-xs  text-cyan-100/70 leading-none mt-2 ">
            {props.time}
          </span>
        </div>
        <div
          className={`ml-2 origin-left duration-100 transition-all bg-slate-900 rounded-full p-1  ${
            pop ? "scale-1" : "scale-0"
          }`}
        >
          <IconArrowDown
            stroke={2}
            size={20}
            className="text-gray-400 hover:text-white"
          />
        </div>
      </div>
    </div>
  );
}
