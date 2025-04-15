import React, { useEffect, useState } from "react";
import axios from "axios";
import refreshToken from "./refreshToken";

export default function useCheckAuthentication() {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const checkLoggedInUser = async () => {
      try {
        await refreshToken();
        const token = localStorage.getItem("accessToken");
        if (token) {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const response = await axios.get(
            "http://127.0.0.1:8000/accounts/user/",
            config
          );
          setUsername(response.data.username);
          setIsLoggedIn(true);
        } else {
          setUsername("");
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
        setUsername("");
      }
    };

    checkLoggedInUser();
  }, []);
  return { username, isLoggedIn };
}
