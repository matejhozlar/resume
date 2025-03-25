import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Content from "./Content";
import "./styles.css";

function App() {
  // const [backendData, setBackendData] = useState([{}]);

  // useEffect(() => {
  //   fetch("/api")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setBackendData(data);
  //     });
  // }, []);
  const [activePage, setActivePage] = useState("home");

  return (
    <div className="main-container">
      <Sidebar onPageChange={setActivePage} />
      <Content activePage={activePage} />
    </div>
  );
}

export default App;
