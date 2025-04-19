import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import slugify from "slugify";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import axios from "axios";
import ChatRooms from "./ChatRooms";
import useIsMobile from "./UseIsMobile";

export default function CreateRoom() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [image, setImage] = useState("/images/image.png");
  const handleName = (e) => {
    setName(e.target.value);
  };

  const isMobile = useIsMobile();
  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const roomSlug = slugify(name, { lower: true, strict: true });
    formData.append("name", name);
    formData.append("slug", roomSlug);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput && fileInput.files[0]) {
      formData.append("image", fileInput.files[0]);
    }
    console.log(formData);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        "http://127.0.0.1:8000/chatapp/create-room/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status >= 200 && response.status <= 299) {
        navigate(`/default/?room_created=true`);
      }
    } catch (error) {
      console.error("failed creating room");
    }
  };

  return (
    <div className="h-full flex ">
      <PanelGroup direction="horizontal">
        {!isMobile && (
          <Panel minSize={20} defaultSize={30} maxSize={40}>
            <ChatRooms />
          </Panel>
        )}
        {!isMobile && (
          <PanelResizeHandle className="w-1 bg-gray-800 hover:bg-blue-600 transition-colors" />
        )}
        <Panel>
          <div
            className="h-screen flex flex-col bg-repeat justify-center items-center"
            style={{ backgroundImage: "url('/images/background.jpg')" }}
          >
            <div className="w-3/5 h-4/5 bg-slate-950/60 rounded-xl backdrop-blur-sm">
              <form action="" className="h-full" onSubmit={handleSubmit}>
                <div className="flex h-3/4 gap-4 flex-col justify-center items-center">
                  <label
                    htmlFor="image"
                    className="rounded-full hover:brightness-75"
                    style={{
                      backgroundImage: `url(${image})`,
                      display: "block",
                      width: "200px",
                      height: "200px",
                      cursor: "pointer",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></label>
                  <input
                    type="file"
                    onChange={handleImage}
                    src=""
                    alt="Room Photo"
                    id="image"
                    className="hidden"
                  />
                  <label htmlFor="room-name" className="text-gray-300">
                    Room Name
                  </label>
                  <input
                    onChange={handleName}
                    type="text"
                    id="room-name"
                    placeholder="Enter room name"
                    required
                    className="w-3/4 max-w-md p-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                  />

                  <button
                    type="submit"
                    className="text-gray-300 p-2 w-36 h-12 bg-blue-950 hover:bg-blue-900 rounded-md my-2"
                  >
                    Create Room
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
