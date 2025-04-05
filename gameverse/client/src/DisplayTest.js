import React from "react";

function DisplayTest() {
  const userId = localStorage.getItem("userId");
  console.log("User ID:", userId);
  return (
    <img
      src={`http://localhost:5000/avatars/${userId}.png`}
      alt="User avatar"
      width={320}
      height={320}
    />
  );
}

export default DisplayTest;
