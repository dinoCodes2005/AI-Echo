import React, { useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ChatRooms from "./ChatRooms";
import useIsMobile from "./UseIsMobile";
import fetchUser from "../api/fetch-user";
import { IconCashBanknoteEdit, IconChevronDown } from "@tabler/icons-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function Profile() {
  const isMobile = useIsMobile();
  const [user, setUser] = useState({});
  const [saved, setSaved] = useState(false);
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
    profileImage:
      user?.profile?.profileImage || "/profile_pics/default_profile_pic.jpg",
    bio: user?.profile?.bio || "",
    contact: user?.profile?.contact || "",
    age: user?.profile?.age || "",
    ai_tone: user?.profile?.ai_tone || "friendly",
    ai_response_length: user?.profile?.ai_response_length || "medium",
    preferred_domains: user?.profile?.preferred_domains || [
      "technology",
      "science",
    ],
    preferred_response_format:
      user?.profile?.preferred_response_format || "paragraph",
    preferred_language: user?.profile?.preferred_language || [
      "english",
      "hindi",
    ],
  });

  useEffect(() => {
    setProfile({
      profileImage:
        user?.profile?.profileImage || "/profile_pics/default_profile_pic.jpg",
      bio: user?.profile?.bio || "",
      contact: user?.profile?.contact || "",
      age: user?.profile?.age || "",
      ai_tone: user?.profile?.ai_tone || "friendly",
      ai_response_length: user?.profile?.ai_response_length || "medium",
      preferred_domains: user?.profile?.preferred_domains || [
        "technology",
        "science",
      ],
      preferred_response_format:
        user?.profile?.preferred_response_format || "paragraph",
      preferred_language: user?.profile?.preferred_language || [
        "english",
        "hindi",
      ],
    });
  }, [user]);

  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDomainChange = (domain) => {
    setProfile((prev) => {
      const domains = [...prev.preferred_domains];
      if (domains.includes(domain)) {
        return {
          ...prev,
          preferred_domains: domains.filter((d) => d !== domain),
        };
      } else {
        return {
          ...prev,
          preferred_domains: [...domains, domain],
        };
      }
    });
  };

  const handleLanguageChange = (language) => {
    setProfile((prev) => {
      const languages = [...prev.preferred_language];
      if (languages.includes(language)) {
        return {
          ...prev,
          preferred_language: languages.filter((d) => d !== language),
        };
      } else {
        return {
          ...prev,
          preferred_language: [...languages, language],
        };
      }
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("bio", profile.bio);
      formData.append("contact", profile.contact);
      formData.append("age", profile.age);
      formData.append("ai_tone", profile.ai_tone);
      formData.append("ai_response_length", profile.ai_response_length);
      formData.append(
        "preferred_response_format",
        profile.preferred_response_format
      );
      formData.append(
        "preferred_domains",
        JSON.stringify(profile.preferred_domains)
      );
      formData.append(
        "preferred_language",
        JSON.stringify(profile.preferred_language)
      );

      // handle image upload
      if (previewImage) {
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput && fileInput.files[0]) {
          formData.append("profileImage", fileInput.files[0]);
        }
      }
      const response = await axios.patch(
        "http://127.0.0.1:8000/accounts/update-profile/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        navigate("/default/");
      }
    } catch (error) {
      console.log("Error updating the profile data: ", error);
    }
  };

  const domains = [
    "technology",
    "science",
    "health",
    "business",
    "arts",
    "sports",
    "education",
    "entertainment",
  ];

  const languages = [
    "Hindi",
    "Bengali",
    "Tamil",
    "Telugu",
    "Marathi",
    "Gujarati",
    "Kannada",
    "Malayalam",
    "Punjabi",
    "Odia",
    "Urdu",
    "Assamese",
  ];

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
          {isMobile && <Navbar navbar={navbar} />}

          <div
            className="h-screen flex flex-col bg-repeat overflow-y-auto px-4"
            style={{ backgroundImage: "url('/images/background.jpg')" }}
          >
            <div className="max-w-4xl mx-auto w-full p-6 bg-slate-900/90 backdrop-blur-sm rounded-lg shadow-xl my-8">
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
              <h1 className="text-3xl font-bold text-cyan-100 mb-6">
                Profile Settings
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Image Section */}
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="w-full md:w-1/3">
                    <h2 className="text-xl font-semibold text-blue-200 mb-2">
                      Profile Image
                    </h2>
                    <div className="relative w-40 h-40 mx-auto md:mx-0">
                      <img
                        src={previewImage || user?.profile?.profileImage}
                        alt="Profile"
                        className="w-40 h-40 rounded-full object-cover border-4 border-blue-200"
                      />
                      <label
                        htmlFor="profileImage"
                        className="absolute bottom-0 right-0 bg-blue-950 text-cyan-100 p-2 rounded-full cursor-pointer hover:bg-blue-800 transition"
                      >
                        <IconCashBanknoteEdit stroke={2} />
                        <input
                          type="file"
                          id="profileImage"
                          name="profileImage"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="w-full md:w-2/3 space-y-4">
                    {/* Bio Section */}
                    <div>
                      <label
                        htmlFor="bio"
                        className="block text-blue-200 font-medium mb-1"
                      >
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={profile?.bio}
                        onChange={handleChange}
                        className="w-full bg-slate-950 resize-none text-cyan-100 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        rows="4"
                        placeholder="Tell us about yourself..."
                      ></textarea>
                    </div>

                    {/* Contact & Age */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="contact"
                          className="block text-blue-200 font-medium mb-1"
                        >
                          Contact Number
                        </label>
                        <input
                          type="tel"
                          id="contact"
                          name="contact"
                          value={profile?.contact}
                          onChange={handleChange}
                          className="w-full bg-slate-950 text-cyan-100 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          placeholder="+91 1234567890"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="age"
                          className="block text-blue-200 font-medium mb-1"
                        >
                          Age
                        </label>
                        <input
                          type="number"
                          id="age"
                          name="age"
                          value={profile?.age}
                          onChange={handleChange}
                          className="w-full bg-slate-950 text-cyan-100 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          placeholder="Your age"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-6">
                  <h2 className="text-xl font-semibold text-blue-200 mb-4">
                    AI Preferences
                  </h2>

                  {/* AI Tone */}
                  <div className="mb-6">
                    <label className="block text-blue-200 font-medium mb-2">
                      AI Tone
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {["professional", "friendly", "humorous", "mentor"].map(
                        (tone) => (
                          <label key={tone} className="flex items-center">
                            <input
                              type="radio"
                              name="ai_tone"
                              value={profile?.ai_tone}
                              checked={profile.ai_tone === tone}
                              onChange={handleChange}
                              className="hidden"
                            />
                            <div
                              className={`w-full text-center py-2 px-3 rounded-md cursor-pointer transition ${
                                profile.ai_tone === tone
                                  ? "bg-blue-200 text-slate-900 font-medium"
                                  : "bg-slate-950 text-cyan-100 hover:bg-slate-800"
                              }`}
                            >
                              {tone.charAt(0).toUpperCase() + tone.slice(1)}
                            </div>
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  {/* AI Response Length */}
                  <div className="mb-6">
                    <label className="block text-blue-200 font-medium mb-2">
                      Response Length
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { value: "short", label: "Short (1-2 sentences)" },
                        { value: "medium", label: "Medium (paragraph)" },
                        { value: "detailed", label: "Detailed" },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="radio"
                            name="ai_response_length"
                            value={option.value}
                            checked={
                              profile?.ai_response_length === option.value
                            }
                            onChange={handleChange}
                            className="hidden"
                          />
                          <div
                            className={`w-full text-center py-2 px-3 rounded-md cursor-pointer transition ${
                              profile?.ai_response_length === option.value
                                ? "bg-blue-200 text-slate-900 font-medium"
                                : "bg-slate-950 text-cyan-100 hover:bg-slate-800"
                            }`}
                          >
                            {option.label}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Preferred Domains */}
                  <div className="mb-6">
                    <label className="block text-blue-200 font-medium mb-2">
                      Preferred Domains of Conversation
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {domains.map((domain) => (
                        <button
                          key={domain}
                          type="button"
                          onClick={() => handleDomainChange(domain)}
                          className={`py-1.5 px-3 rounded-full text-sm transition ${
                            profile?.preferred_domains.includes(domain)
                              ? "bg-blue-200 text-slate-900 font-medium"
                              : "bg-slate-950 text-cyan-100 hover:bg-slate-800"
                          }`}
                        >
                          {domain.charAt(0).toUpperCase() + domain.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* preferred language of conversation */}
                  <div className="mb-6">
                    <label className="block text-blue-200 font-medium mb-2">
                      Preferred Language
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {languages.map((language) => (
                        <button
                          key={language}
                          type="button"
                          onClick={() => handleLanguageChange(language)}
                          className={`py-1.5 px-3 rounded-full text-sm transition ${
                            profile?.preferred_language.includes(language)
                              ? "bg-blue-200 text-slate-900 font-medium"
                              : "bg-slate-950 text-cyan-100 hover:bg-slate-800"
                          }`}
                        >
                          {language.charAt(0).toUpperCase() + language.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preferred Response Format */}
                  <div className="mb-6">
                    <label className="block text-blue-200 font-medium mb-2">
                      Response Format
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { value: "paragraph", label: "Paragraphs" },
                        { value: "bullet", label: "Bullet Points" },
                        { value: "step", label: "Step-by-Step" },
                        { value: "tabbed", label: "Tabbed View" },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="radio"
                            name="preferred_response_format"
                            value={option.value}
                            checked={
                              profile?.preferred_response_format ===
                              option.value
                            }
                            onChange={handleChange}
                            className="hidden"
                          />
                          <div
                            className={`w-full text-center py-2 px-3 rounded-md cursor-pointer transition ${
                              profile?.preferred_response_format ===
                              option.value
                                ? "bg-blue-200 text-slate-900 font-medium"
                                : "bg-slate-950 text-cyan-100 hover:bg-slate-800"
                            }`}
                          >
                            {option.label}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
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
    </div>
  );
}
