import React, { useState, useEffect } from "react";
import Sidebar from "./components/sidebar/Sidebar.jsx";
import LoginForm from "./components/auth/LoginForm.jsx";
import RegisterForm from "./components/auth/RegisterForm.jsx";
import Header from "./components/header/Layout.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/home/Home.jsx";
import TicTacToeInfo from "./components/singleplayer/TicTacToeInfo.jsx";
import SimonGameInfo from "./components/singleplayer/SimonGameInfo.jsx";
import PexesoInfo from "./components/singleplayer/PexesoInfo.jsx";
import ZombieArenaInfo from "./ZombieArena/ZombieArenaInfo";
import ZombieArena from "./ZombieArena/ZombieArena";
import Leaderboard from "./components/leaderboards/Leaderboards.jsx";
import CharacterCreation from "./CharCreation/CharacterCreation.js";
import ChangePasswordForm from "./components/userSettings/ChangePasswordForm.jsx";
import ChangeUsernameForm from "./components/userSettings/ChangeUsernameForm.jsx";
import DeleteAccForm from "./components/userSettings/DeleteAccForm.jsx";
import DisplayTest from "./DisplayTest";
import PlayerProfile from "./components/playerProfile/PlayerProfile.jsx";
import BootScreen from "./components/BootScreen/BootScreen.jsx";

import "./styles.css";

function App() {
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showBoot, setShowBoot] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/auth/status", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
          setShowBoot(true);
        }
      } catch (err) {
        console.error("Failed to check auth:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

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
          if (loggedInUser) {
            setUser(loggedInUser);
            setShowBoot(true);
          }
        }}
        onSwitchToRegister={() => setIsRegistering(true)}
      />
    );
  }

  if (showBoot) {
    return <BootScreen onFinish={() => setShowBoot(false)} />;
  }

  return (
    <Router>
      <div className="app-wrapper">
        <Header isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
        <div className="main-container">
          <Sidebar
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            onLogout={() => setUser(null)}
          />

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
