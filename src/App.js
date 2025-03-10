import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar.js'
import ChatRooms from './components/ChatRooms.js'
import Room from './components/Room.js'



function App() {
  return (
    <>
    <Navbar/>
    <div className='h-full flex '>
      <ChatRooms/>
      <Room/>
      </div>
    </>
  );
}

export default App;
