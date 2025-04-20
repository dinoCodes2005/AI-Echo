import React, { useEffect, useState } from "react";
import { IconChevronDown, IconMessageChatbot } from "@tabler/icons-react";
import ChatRooms from "./ChatRooms";
import axios from "axios";
import useCheckAuthentication from "../api/check-auth";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import useIsMobile from "./UseIsMobile";
import Navbar from "./Navbar";

export default function About() {
  const { username, isLoggedIn } = useCheckAuthentication();
  const isMobile = useIsMobile();
  const [navbar, setNavbar] = useState(true);

  return (
    <>
      <div className="h-full flex">
        <PanelGroup direction="horizontal">
          {!isMobile && (
            <Panel minSize={20} defaultSize={30}>
              <ChatRooms />
            </Panel>
          )}
          <PanelResizeHandle />
          <Panel>
            {isMobile && <Navbar navbar={navbar} />}

            <div className="bg-blue-950 min-h-screen w-full flex flex-col justify-center items-center px-10 relative">
              {isMobile && (
                <div
                  onClick={() => {
                    setNavbar(!navbar);
                  }}
                  className="self-end mr-2 z-100 transparent right-0 absolute top-0"
                >
                  <button
                    className={`mr-2 mt-2 origin-left duration-100 transition-all bg-slate-900 rounded p-1`}
                  >
                    <IconChevronDown
                      stroke={2}
                      size={20}
                      className={`text-gray-400 hover:text-white ${
                        navbar && "rotate-180"
                      }`}
                    />
                  </button>
                </div>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </>
  );
}
