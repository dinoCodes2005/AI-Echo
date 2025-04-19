import React, { useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ChatRooms from "./ChatRooms";
import useIsMobile from "./UseIsMobile";
import fetchUser from "../api/fetch-user";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Settings() {
  const isMobile = useIsMobile();
  const [user, setUser] = useState({});
  const navigate = useNavigate();

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
        <div
          className="h-screen flex flex-col justify-center items-center bg-repeat overflow-y-auto"
          style={{ backgroundImage: "url('/images/background.jpg')" }}
        >
          <div className="max-w-4xl mx-auto w-full p-6 bg-slate-900/90 backdrop-blur-sm rounded-lg shadow-xl my-8">
            <h1 className="text-3xl font-bold text-cyan-100 mb-6">
              Credentials
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
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
              </div>
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div>
                  <label
                    htmlFor="username"
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
              <div className="flex justify-start">
                <button
                  type="submit"
                  className="bg-blue-200 hover:bg-blue-300 text-slate-900 font-medium py-2 px-6 rounded-md transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </Panel>
    </PanelGroup>
  );
}
