"use client";

import { useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ChatRooms from "./ChatRooms";
import useIsMobile from "./UseIsMobile";
import fetchUser from "../api/fetch-user";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IconChevronDown } from "@tabler/icons-react";
import Navbar from "./Navbar";

export default function Settings() {
  const isMobile = useIsMobile();
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [navbar, setNavbar] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const userData = await fetchUser();
      console.log(userData);
      setUser(userData);
    };
    fetchData();
  }, []);

  const [profile, setProfile] = useState({
    username: user?.username,
    first_name: user?.first_name,
    last_name: user?.last_name,
    email: user?.email,
  });

  useEffect(() => {
    setProfile({
      username: user?.username || "",
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
    });
  }, [user]);

  const handleSubmit = async (e) => {
    let formData = new FormData();
    e.preventDefault();
    formData = {
      username: profile.username,
      first_name: profile.first_name,
      last_name: profile.last_name,
      email: profile.email,
    };
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch(
        "http://127.0.0.1:8000/accounts/update-credentials/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        navigate("/default/");
      }
    } catch (error) {
      console.log("Error updating the Credentials: ", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
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
        {isMobile && <Navbar navbar={navbar} />}
        {isMobile && (
          <div
            onClick={() => {
              setNavbar(!navbar);
            }}
            className="self-end mr-2 z-100 transparent right-0 fixed"
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
        <div
          className="h-full mb-2 flex items-center justify-center bg-repeat px-4 py-10"
          style={{ backgroundImage: "url('/images/background.jpg')" }}
        >
          <div className="w-full max-w-5xl mx-auto">
            <div className="bg-slate-900/90 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Left side - Profile info */}
                <div className="md:w-1/3 bg-slate-950/50 p-8 flex flex-col justify-center">
                  <div className="text-center mb-6">
                    {!user?.profile?.profileImage ? (
                      <div className="w-24 h-24 mx-auto bg-blue-200 rounded-full flex items-center justify-center text-slate-900 text-2xl font-bold mb-4">
                        <>
                          {profile?.first_name?.[0]}
                          {profile?.last_name?.[0]}
                        </>
                      </div>
                    ) : (
                      <img
                        src={user?.profile?.profileImage}
                        alt=""
                        className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                      />
                    )}
                    <h2 className="text-xl font-bold text-cyan-100">
                      {profile?.first_name} {profile?.last_name}
                    </h2>
                    <p className="text-blue-200 text-sm mt-1">
                      @{profile?.username}
                    </p>
                  </div>

                  <div className="border-t border-slate-700 pt-6 mt-2">
                    <p className="text-gray-400 text-sm mb-1">Account Status</p>
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 ${
                          user?.is_active ? "bg-green-500" : "bg-red-600"
                        } rounded-full mr-2`}
                      ></div>
                      <span className="text-cyan-100">Active</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-1 mt-2">
                      Date Joined
                    </p>
                    <span className="text-cyan-100">
                      {new Date(user?.date_joined).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Right side - Form */}
                <div className="md:w-2/3 p-8">
                  <h1 className="text-3xl font-bold text-cyan-100 mb-6">
                    Credentials
                  </h1>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="username"
                          className="block text-blue-200 font-medium mb-1"
                        >
                          Username
                        </label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          value={profile?.username}
                          onChange={handleChange}
                          className="w-full bg-slate-950 text-cyan-100 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          placeholder="john_doe"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-blue-200 font-medium mb-1"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={profile?.email}
                          onChange={handleChange}
                          className="w-full bg-slate-950 text-cyan-100 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          placeholder="johndoe@gmail.com"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="first_name"
                          className="block text-blue-200 font-medium mb-1"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          id="first_name"
                          name="first_name"
                          value={profile?.first_name}
                          onChange={handleChange}
                          className="w-full bg-slate-950 text-cyan-100 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="last_name"
                          className="block text-blue-200 font-medium mb-1"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="last_name"
                          name="last_name"
                          value={profile?.last_name}
                          onChange={handleChange}
                          className="w-full bg-slate-950 text-cyan-100 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        className="bg-blue-200 hover:bg-blue-300 text-slate-900 font-medium py-3 px-8 rounded-md transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Panel>
    </PanelGroup>
  );
}
