import React from "react";
import ChangePasswordForm from "./ChangePasswordForm";
import ChangeUsernameForm from "./ChangeUsernameForm";
import TicTacToeInfo from "./TicTacToeInfo";
import SimonGameInfo from "./SimonGameInfo";
import PexesoInfo from "./PexesoInfo";
import Home from "./Home";
import ZombieArenaInfo from "./ZombieArena/ZombieArenaInfo";
import ZombieArena from "./ZombieArena/ZombieArena";

function Content({ activePage, onPageChange }) {
  const renderContent = () => {
    switch (activePage) {
      case "tic-tac-toe":
        return <TicTacToeInfo />;
      case "simon":
        return <SimonGameInfo />;
      case "pexeso":
        return <PexesoInfo />;
      case "account":
        return <ChangePasswordForm />;
      case "username":
        return <ChangeUsernameForm />;
      case "zombiearena":
        return <ZombieArenaInfo onPageChange={onPageChange} />;
      case "zombiearena-play":
        return <ZombieArena />;
      case "home":
        return <Home />;
      default:
        return <Home />;
    }
  };

  return <div className="content">{renderContent()}</div>;
}

export default Content;
