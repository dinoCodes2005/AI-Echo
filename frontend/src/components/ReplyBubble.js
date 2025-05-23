import React, { useEffect, useState } from "react";
import { IconArrowDown, IconTrash } from "@tabler/icons-react";
import { IconCheck } from "@tabler/icons-react";
import { IconChecks } from "@tabler/icons-react";
import axios from "axios";
import fetchUser from "../api/fetch-user";
import useIsMobile from "./UseIsMobile";

export default function ReplyBubble(props) {
  const [pop, setPop] = useState(false);
  const [reply, setReply] = useState(false);
  const [replyingTo, setReplyingTo] = useState(false);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [time, setTime] = useState("");
  const [selected, setSelected] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setUsername(props.username);
    setMessage(props.message);
    setTime(props.time);
  }, []);

  useEffect(() => {
    props.setReply({
      messageId: props.messageId,
      message: message,
      username: username,
    });
  }, [replyingTo]);
  useEffect(() => {
    if (props.deselect) {
      setSelected(false);
      props.setDeselect(false);
    }
  }, [props.deselect]);

  useEffect(
    (e) => {
      if (
        props.lastJsonMessage !== null &&
        props.lastJsonMessage.type === "delete_success" &&
        props.lastJsonMessage.messageId === props.messageId
      ) {
        setMessage("Message has been deleted by " + props.username);
      }
    },
    [props.lastJsonMessage]
  );

  const handleDelete = async () => {
    props.sendJsonMessage({
      type: "delete_message",
      messageId: props.messageId,
      username: username,
    });
  };

  const replyWithGemini = async () => {
    const prompt = `Give me a single, appropriate reply for this message, naturally blending ${props.profile.preferred_language} and English, mirroring the sender's style of language mixing. Prioritize responding in ${props.profile.preferred_language} while seamlessly incorporating English words and phrases where natural and relevant to the conversation. Avoid generating separate sentences or thoughts in different languages.
    (Information about the sender and preference :
    Name: ${props.username},
    Age: ${props.profile.age},
    AI Response Length : ${props.profile.ai_response_length},
    AI Tone : ${props.profile.ai_tone},
    Preferred Domains : ${props.profile.preferred_domains},
    Preferred Response Format : ${props.profile.preferred_response_format}).

    (Instruction: Respond in plain text only. No formatting, no markdown, no symbols like , #, or quotes. Only the message):

    Message : '${username} -> ${message}'`;
    console.log(prompt);
    fetch("http://127.0.0.1:8000/chatapp/api/fetch-reply/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt }),
    })
      .then((response) => {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let result = "";
        function readChunk() {
          reader.read().then(({ done, value }) => {
            if (done) return;
            const chunk = decoder.decode(value);
            result += chunk;
            props.generateReply(result);
            readChunk();
          });
        }
        readChunk();
      })
      .catch((error) => {
        console.log("Some error in getting reply in the frontend");
      });
  };

  const handleSelect = () => {
    if (selected) {
      props.setCheckedMessages([...props.checkedMessages]);
    } else {
      props.setCheckedMessages([
        ...props.checkedMessages,
        {
          id: props.messageId,
          username: props.username,
          message: message,
        },
      ]);
    }
    setSelected(!selected);
  };

  return (
    <div
      id={props.messageId}
      className={`flex relative m-4 space-x-3 max-w-[600px] px-0 sm:px-5 ${
        props.currentUser !== props.username ? "" : "self-end  mb-4"
      }`}
      onMouseEnter={() => {
        setPop(true);
      }}
      onMouseLeave={() => {
        setPop(false);
      }}
    >
      <img
        className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 object-cover"
        src={props.message_object?.user?.profile?.profileImage}
      ></img>
      {props.username === props.currentUser && (
        <div
          className={`absolute bottom-[50%] origin-bottom-right transition-all z-[100] duration-200 rounded bg-gray-950 left-1/3 p-2 ${
            reply ? "scale-1" : "scale-0"
          }`}
        >
          <button
            className="w-full text-left px-3 py-2 hover:bg-red-600 rounded hover:text-white flex items-center transition-colors text-red-400"
            onClick={handleDelete}
          >
            <IconTrash stroke={2} className={`text- mr-2`} size={20} />
            Delete
          </button>
        </div>
      )}
      <div className="flex items-center  ">
        <div
          className={`${
            props.currentUser === props.username
              ? "bg-gray-950"
              : "bg-slate-900"
          } flex flex-col p-3 rounded-r-lg w-full rounded-bl-lg`}
        >
          <div className="flex justify-between">
            <p className="text-sm w-auto text-cyan-400 mb-2 font-semibold">
              {username}
            </p>
            {selected && props.checkedMessages.length != 0 && (
              <IconChecks
                stroke={2}
                size={18}
                tabIndex={0}
                className="text-gray-400 hover:text-white mb-2 ml-2"
              />
            )}
          </div>

          <p className="text-sm text-cyan-100">{message} </p>
          <span className="text-xs  text-cyan-100/70 leading-none mt-2 ">
            {time}
          </span>
        </div>
        {pop && (
          <div
            className={`ml-2 bg-slate-900 rounded-full p-1 transition-all duration-200 ease-in-out transform ${
              pop
                ? "opacity-100 translate-x-0 pointer-events-auto"
                : "opacity-0 translate-x-2 pointer-events-none"
            }`}
          >
            <IconCheck
              stroke={2}
              size={18}
              onClick={handleSelect}
              tabIndex={0}
              className="text-gray-400 hover:text-white mb-2"
            />
            <IconArrowDown
              stroke={2}
              size={20}
              onClick={() => setReply(!reply)}
              onBlur={() => setTimeout(() => setReply(false), 200)}
              tabIndex={0}
              className="text-gray-400 hover:text-white"
            />
          </div>
        )}
      </div>
      {props.currentUser !== props.username && (
        <div
          className={`bg-slate-900 rounded-lg w-40 p-2 shadow-lg overflow-hidden flex flex-col gap-1 right-0 top-8 z-30 transition-all duration-200 ease-in-out origin-left
            ${isMobile && "absolute "}
    ${
      reply
        ? "opacity-100 translate-x-0 pointer-events-auto"
        : "opacity-0 translate-x-4 pointer-events-none"
    }`}
          tabIndex={0}
          onBlur={() => setReply(false)}
        >
          <>
            <button
              onClick={() => setReplyingTo(true)}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 rounded transition-colors text-cyan-200"
            >
              Reply
            </button>
            <button
              className="w-full text-left px-3 py-2 hover:bg-slate-800 rounded transition-colors text-cyan-200"
              onClick={replyWithGemini}
            >
              Reply With AI
            </button>
            <button
              className="w-full text-left px-3 py-2 hover:bg-slate-800 rounded transition-colors text-cyan-200"
              onClick={replyWithGemini}
            >
              Summarise
            </button>
          </>
        </div>
      )}
    </div>
  );
}
