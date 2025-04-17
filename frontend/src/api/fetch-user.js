import React from "react";
import axios from "axios";

export default async function fetchUser(id) {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/accounts/fetch-user/${id}/`
    );
    return response.data.username;
  } catch (error) {
    console.error("Error while fetching the user: ", error);
  }
}
