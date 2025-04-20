import React from "react";
import { IconSquareRoundedX } from "@tabler/icons-react";

export default function SummariseChat(props) {
  return (
    <div
      className={`absolute flex right-0 top-[130%] rounded-md p-2 bg-slate-900 w-96 h-96  flex-col origin-top-right transition-all duration-150 z-20 ${
        props.summarise ? "scale-100" : "scale-0"
      }`}
    >
      <div className="flex justify-between items-center p-2">
        <p
          className=" text-xl text-blue-100 "
          style={{ fontFamily: "Poppins" }}
        >
          Summarised with Gemini
        </p>
        <button onClick={() => props.setSummarise(false)}>
          <IconSquareRoundedX
            stroke={2}
            className={`text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:bg-red-600 rounded-md p-2`}
            size={42}
          />
        </button>
      </div>
      <div
        className="p-2 flex flex-col justify-start items-start scrollbar-thumb-gray-950 size-full overflow-y-auto"
        style={{ maxHeight: "calc(100% - 60px)" }} // Adjust maxHeight as needed, considering the header
      >
        <h1
          className=" text-md text-blue-400 "
          style={{ fontFamily: "Poppins", wordBreak: "break-word" }}
        >
          {props.summarisedMessage}
        </h1>
      </div>
    </div>
  );
}
