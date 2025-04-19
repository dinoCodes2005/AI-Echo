import "./App.css";
import ChatRooms from "./components/ChatRooms.js";
import CreateRoom from "./components/CreateRoom.js";
import Room from "./components/Room.js";
import DefaultRoom from "./components/DefaultRoom.js";
import LoginPage from "./components/LoginPage.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./components/RegisterPage.js";
import ProtectedRoutes from "./components/ProtectedRoutes.js";
import useIsMobile from "./components/UseIsMobile.js";
import Navbar from "./components/Navbar.js";
import Profile from "./components/Profile.js";
import Settings from "./components/Settings.js";

function App() {
  const isMobile = useIsMobile();
  return (
    <>
      <Router>
        <>
          <Routes>
            <Route path="/login/" element={<LoginPage />}></Route>
            <Route path="/register/" element={<RegisterPage />}></Route>
            <Route element={<ProtectedRoutes />}>
              <Route path="/settings/" element={<Settings />}></Route>
              <Route path="/profile/" element={<Profile />}></Route>
              <Route path="/default/" element={<DefaultRoom />} />
              <Route path="/room/:slug" element={<Room />} />
              <Route path="/create-room/" element={<CreateRoom />} />
            </Route>
          </Routes>
        </>
      </Router>
    </>
  );
}

export default App;
