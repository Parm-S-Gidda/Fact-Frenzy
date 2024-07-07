import logo from './logo.svg';
import './App.css';
import HomePage from './homepage/homepage';
import Lobby from './lobby/lobby';
import PlayerGame from './playerGame/playerGame';
import HostGame from './hostGame/hostGame';
import ScreenGame from './screenGame/screenGame';
import NameSelection from './name-selection/nameSelection';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import {WebSocketProvider} from './websocketContext/websocketContext';

function App() {
  return (
    <WebSocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/name-selection" element={<NameSelection />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/playerGame" element={<PlayerGame />} />
          <Route path="/hostGame" element={<HostGame />} />
          <Route path="/screenGame" element={<ScreenGame />} />
        </Routes>
      </Router>
    </WebSocketProvider>
  );
}

export default App;