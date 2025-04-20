import React, { useEffect, useState } from "react";
import { IconChevronDown, IconMessageChatbot } from "@tabler/icons-react";
import ChatRooms from "./ChatRooms";
import axios from "axios";
import useCheckAuthentication from "../api/check-auth";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import useIsMobile from "./UseIsMobile";
import Navbar from "./Navbar";

export default function DefaultRoom() {
  const { username, isLoggedIn } = useCheckAuthentication();
  const isMobile = useIsMobile();
  const [navbar, setNavbar] = useState(true);
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  // Typing animation effect - more subtle and minimalistic
  useEffect(() => {
    const text = "Chat Seamlessly with users via AI generated replies";
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= text.length) {
        setTypedText(text.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 70); // Slightly slower for a more elegant feel

    return () => clearInterval(typingInterval);
  }, []);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 700); // Slower blink for a calmer feel

    return () => clearInterval(cursorInterval);
  }, []);

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
              {/* Clean, minimalistic container with subtle border */}
              <div className="flex flex-col items-center p-10 rounded-lg border border-cyan-800/30 bg-blue-900/20 backdrop-blur-sm transition-all duration-500 hover:border-cyan-700/50">
                {/* Icon with subtle fade-in */}
                <div className="mb-6 opacity-0 animate-fade-in">
                  <IconMessageChatbot
                    stroke={1.5}
                    color="white"
                    size={70}
                    className="opacity-85"
                  />
                </div>

                {/* Title with clean, minimal styling */}
                <h2
                  className="text-3xl text-white font-semibold mb-3 opacity-0 animate-fade-in animation-delay-300"
                  style={{ fontFamily: "Poppins" }}
                >
                  AI Echo
                </h2>

                {/* Subtitle with typing animation */}
                <div className="text-center mb-6 opacity-0 animate-fade-in animation-delay-600">
                  <h2 className="text-lg text-cyan-200 font-medium opacity-80 min-h-[28px]">
                    {typedText}
                    {showCursor && <span className="text-cyan-100">|</span>}
                  </h2>
                </div>

                {/* Username with subtle highlight */}
                <div className="mt-2 opacity-0 animate-fade-in animation-delay-900">
                  <h2 className="text-lg text-cyan-100 font-medium opacity-90 transition-all duration-300 hover:opacity-100">
                    @{username}
                  </h2>
                </div>

                {/* Simple, elegant button */}
                <button className="mt-8 px-8 py-2.5 bg-transparent border border-cyan-700 text-cyan-200 rounded-md transition-all duration-300 opacity-0 animate-fade-in animation-delay-1200 hover:bg-cyan-900/30 hover:border-cyan-600 hover:text-white">
                  Start Chatting
                </button>
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>

      {/* Minimal CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }

        .animation-delay-600 {
          animation-delay: 600ms;
        }

        .animation-delay-900 {
          animation-delay: 900ms;
        }

        .animation-delay-1200 {
          animation-delay: 1200ms;
        }
      `}</style>
    </>
  );
}
