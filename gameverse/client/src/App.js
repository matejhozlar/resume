import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Content from "./Content";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "./styles.css";

function App() {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState("home");
  const [isRegistering, setIsRegistering] = useState(false);

  if (!user) {
    return isRegistering ? (
      <RegisterForm
        onRegister={(newUser) => {
          if (newUser) {
            setUser(newUser);
          } else {
            setIsRegistering(false); // Go back to login
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
    <div className="main-container">
      <Sidebar onPageChange={setActivePage} />
      <Content activePage={activePage} />
    </div>
  );
}

export default App;
