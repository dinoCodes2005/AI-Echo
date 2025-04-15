import React from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function refreshToken() {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error("Invalid token:", error);
      return true;
    }
  };
  const getToken = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/accounts/token/refresh/",
        { refresh: refreshToken }
      );
      if (response.data && response.data.access)
        localStorage.setItem("accessToken", response.data.access);
    } catch (error) {
      console.log("Error refreshing Token : ", error);
    }
  };
  isTokenExpired(accessToken) && getToken();
}
