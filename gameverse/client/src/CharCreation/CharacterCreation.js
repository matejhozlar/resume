import React, { useState } from "react";
import eyeOptions from "../assets/CharCreation/eyes/eyes";
import baseBody from "../assets/CharCreation/body/body.png";

const CharacterCreator = () => {
  const eyeKeys = Object.keys(eyeOptions);
  const [selectedEyes, setSelectedEyes] = useState(eyeKeys[0]);

  const handleSave = () => {
    const data = {
      eyeColor: selectedEyes,
      // more customization can go here
    };
    console.log("Saving character:", data);
    alert("Character saved!");
  };

  return (
    <div className="character-creator-wrapper new-style">
      <div className="character-creator-box">
        {/* LEFT PANEL: OPTIONS */}
        <div className="creator-options-panel">
          <h2>Character Creation</h2>

          <label>Eye Color</label>
          <select
            value={selectedEyes}
            onChange={(e) => setSelectedEyes(e.target.value)}
          >
            {eyeKeys.map((key) => (
              <option key={key} value={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </option>
            ))}
          </select>

          <button className="custom-btn save-btn" onClick={handleSave}>
            Save Character
          </button>
        </div>

        {/* RIGHT PANEL: PREVIEW */}
        <div className="creator-preview-panel">
          <div className="character-body preview-character">
            <img src={baseBody} alt="Base Body" className="character-layer" />
            <img
              src={eyeOptions[selectedEyes]}
              alt="Eyes"
              className="character-layer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreator;
