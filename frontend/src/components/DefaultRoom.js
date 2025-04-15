import React, { useEffect, useState } from "react";
import { IconMessageChatbot } from "@tabler/icons-react";
import ChatRooms from "./ChatRooms";
import axios from "axios";
import useCheckAuthentication from "../api/fetchUser";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export default function DefaultRoom() {
  const { username, isLoggedIn } = useCheckAuthentication();
  return (
    <>
      <div className="h-full flex ">
        <PanelGroup direction="horizontal">
          <Panel minSize={20} defaultSize={30}>
            <ChatRooms />
          </Panel>
          <PanelResizeHandle />
          <Panel>
            <div className="bg-blue-950 h-full w-full flex flex-col justify-center items-center px-10">
              <IconMessageChatbot
                stroke={2}
                color="white"
                size={80}
                className="opacity-55 "
              />
              <h2
                className="text-3xl text-white font-semibold"
                style={{ fontFamily: "Poppins" }}
              >
                AI Echo
              </h2>
              <h2 className="text-xl text-cyan-200 font-semibold opacity-70">
                Chat Seamlessly with users via AI generated replies
              </h2>
              <h2 className="text-xl text-cyan-200 font-semibold opacity-90">
                @{username}
              </h2>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </>
  );
}
