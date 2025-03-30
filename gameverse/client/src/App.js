import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Content from "./Content";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Header from "./Layout";
import "./styles.css";

function App() {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState("home");
  const [isRegistering, setIsRegistering] = useState(false);

  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  if (!user) {
    return isRegistering ? (
      <RegisterForm
        onRegister={(newUser) => {
          if (newUser) {
            setUser(newUser);
          } else {
            setIsRegistering(false);
          }
        }}
      />
    ) : (
      <LoginForm
        onLogin={(loggedInUser) => {
          if (loggedInUser) {
            setUser(loggedInUser);
          }
        }}
        onSwitchToRegister={() => setIsRegistering(true)}
      />
    );
  }

  return (
    <div className="app-wrapper">
      {/* Render the header at the top */}
      <Header isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

      {/* Main layout container */}
      <div className="main-container">
        {/* Pass collapse props to the Sidebar */}
        <Sidebar
          onPageChange={setActivePage}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          toggleSidebar={toggleSidebar}
        />
        <Content activePage={activePage} onPageChange={setActivePage} />
      </div>
    </div>
  );
}

export default App;
