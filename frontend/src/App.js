import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/Navbar.js";
import ChatRooms from "./components/ChatRooms.js";
import Room from "./components/Room.js";
import { useEffect, useState } from "react";
import DefaultRoom from "./components/DefaultRoom.js";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useParams } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <div className="h-full flex ">
          <ChatRooms />
          <Routes>
            <Route path="/" element={<DefaultRoom />} />
            <Route path="/room/:slug" element={<Room />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
