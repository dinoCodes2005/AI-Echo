import React from "react";
import axios from "axios";

export default async function fetchUser() {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get(`http://127.0.0.1:8000/accounts/user/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while fetching the user: ", error);
  }
}
