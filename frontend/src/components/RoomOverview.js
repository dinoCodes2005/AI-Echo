import React from "react";
import { useParams } from "react-router-dom";
import slugify from "slugify";

export default function RoomOverview(props) {
  const { slug } = useParams();
  return (
    <div
      className={`transition-all duration-200 ease-in-out  hover:bg-blue-900 h-20 rounded-lg my-2 flex justify-between px-2 items-center cursor-pointer ${
        slugify(props.name.toLowerCase()) === slug ? "bg-blue-900" : ""
      }`}
    >
      <div className="flex ">
        <img
          src={props.image}
          className="h-12 w-12 rounded-full mr-2 object-cover"
          alt=""
        />
        <div className="flex flex-col overflow-hidden">
          <h2 className="text-white truncate" style={{ fontFamily: "Poppins" }}>
            {props.name}
          </h2>
          <h2
            className="text-blue-200 truncate"
            style={{ fontFamily: "Poppins" }}
          >
            {props.message}
          </h2>
        </div>
      </div>

      {/* <h2 className='text-blue-200 truncate'>{props.date}</h2> */}
    </div>
  );
}
