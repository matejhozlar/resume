import React, { useState } from "react";
import Sidebar from "./Sidebar";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Header from "./Layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Home";
import TicTacToeInfo from "./TicTacToeInfo";
import SimonGameInfo from "./SimonGameInfo";
import PexesoInfo from "./PexesoInfo";
import ZombieArenaInfo from "./ZombieArena/ZombieArenaInfo";
import ZombieArena from "./ZombieArena/ZombieArena";
import Leaderboard from "./Leaderboards";
import CharacterCreation from "./CharCreation/CharacterCreation";
import ChangePasswordForm from "./ChangePasswordForm";
import ChangeUsernameForm from "./ChangeUsernameForm";
import DeleteAccForm from "./DeleteAccForm";
import DisplayTest from "./DisplayTest";
import PlayerProfile from "./PlayerProfile";

import "./styles.css";

function App() {
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  if (!user) {
    return isRegistering ? (
      <RegisterForm
        onRegister={(newUser) => {
          if (newUser) setUser(newUser);
          else setIsRegistering(false);
        }}
      />
    ) : (
      <LoginForm
        onLogin={(loggedInUser) => {
          if (loggedInUser) setUser(loggedInUser);
        }}
        onSwitchToRegister={() => setIsRegistering(true)}
      />
    );
  }

  return (
    <Router>
      <div className="app-wrapper">
        <Header isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
        <div className="main-container">
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tic-tac-toe" element={<TicTacToeInfo />} />
              <Route path="/simon" element={<SimonGameInfo />} />
              <Route path="/pexeso" element={<PexesoInfo />} />
              <Route path="/zombiearena" element={<ZombieArenaInfo />} />
              <Route path="/zombiearena/play" element={<ZombieArena />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route
                path="/character-creation"
                element={<CharacterCreation />}
              />
              <Route
                path="/settings/account"
                element={<ChangePasswordForm />}
              />
              <Route
                path="/settings/username"
                element={<ChangeUsernameForm />}
              />
              <Route
                path="/settings/delete-account"
                element={<DeleteAccForm />}
              />
              <Route path="/multiplayer" element={<DisplayTest />} />
              <Route path="/profile" element={<PlayerProfile />} />
              <Route path="/profile/:id" element={<PlayerProfile />} />
              {/* fallback route */}
              <Route path="*" element={<Home />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
