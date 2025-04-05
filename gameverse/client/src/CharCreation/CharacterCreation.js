import React, { useState } from "react";
import eyeOptions from "../assets/CharCreation/eyes/eyes";
import baseBody from "../assets/CharCreation/body/body.png";
import glasses from "../assets/CharCreation/glasses/glasses.js";
import hairstyles from "../assets/CharCreation/hairstyles/hairstyles.js";
import shirts from "../assets/CharCreation/shirts/shirts.js";
import pants from "../assets/CharCreation/pants/pants.js";
import shoes from "../assets/CharCreation/shoes/shoes.js";

const CharacterCreator = () => {
  const shoesKeys = ["none", ...Object.keys(shoes)];
  const [selectedShoes, setSelectedShoes] = useState("none");

  const pantsKeys = ["none", ...Object.keys(pants)];
  const [selectedPants, setSelectedPants] = useState("none");

  const shirtKeys = ["none", ...Object.keys(shirts)];
  const [selectedShirt, setSelectedShirt] = useState("none");

  const hairKeys = ["none", ...Object.keys(hairstyles)];
  const [selectedHair, setSelectedHair] = useState("none");

  const eyeKeys = ["none", ...Object.keys(eyeOptions)];
  const [selectedEyes, setSelectedEyes] = useState("none");

  const glassesKeys = ["none", ...Object.keys(glasses)];
  const [selectedGlasses, setSelectedGlasses] = useState("none");

  const handleSave = () => {
    const data = {
      eyeColor: selectedEyes,
      glasses: selectedGlasses,
      hairstyle: selectedHair,
      shirt: selectedShirt,
      pants: selectedPants,
      shoes: selectedShoes,
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
                {key === "none"
                  ? "None"
                  : key.charAt(0).toUpperCase() + key.slice(1)}
              </option>
            ))}
          </select>

          <label>Glasses</label>
          <select
            value={selectedGlasses}
            onChange={(e) => setSelectedGlasses(e.target.value)}
          >
            {glassesKeys.map((key) => (
              <option key={key} value={key}>
                {key === "none"
                  ? "None"
                  : key.charAt(0).toUpperCase() + key.slice(1)}
              </option>
            ))}
          </select>

          <label>Hairstyle</label>
          <select
            value={selectedHair}
            onChange={(e) => setSelectedHair(e.target.value)}
          >
            {hairKeys.map((key) => (
              <option key={key} value={key}>
                {key === "none"
                  ? "None"
                  : key.charAt(0).toUpperCase() + key.slice(1)}
              </option>
            ))}
          </select>

          <label>Shirt</label>
          <select
            value={selectedShirt}
            onChange={(e) => setSelectedShirt(e.target.value)}
          >
            {shirtKeys.map((key) => (
              <option key={key} value={key}>
                {key === "none"
                  ? "None"
                  : key.charAt(0).toUpperCase() + key.slice(1)}
              </option>
            ))}
          </select>

          <label>Pants</label>
          <select
            value={selectedPants}
            onChange={(e) => setSelectedPants(e.target.value)}
          >
            {pantsKeys.map((key) => (
              <option key={key} value={key}>
                {key === "none"
                  ? "None"
                  : key.charAt(0).toUpperCase() + key.slice(1)}
              </option>
            ))}
          </select>

          <label>Shoes</label>
          <select
            value={selectedShoes}
            onChange={(e) => setSelectedShoes(e.target.value)}
          >
            {shoesKeys.map((key) => (
              <option key={key} value={key}>
                {key === "none"
                  ? "None"
                  : key.charAt(0).toUpperCase() + key.slice(1)}
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
            {selectedEyes !== "none" && (
              <img
                src={eyeOptions[selectedEyes]}
                alt="Eyes"
                className="character-layer"
              />
            )}
            {selectedGlasses !== "none" && (
              <img
                src={glasses[selectedGlasses]}
                alt="Glasses"
                className="character-layer"
              />
            )}
            {selectedHair !== "none" && (
              <img
                src={hairstyles[selectedHair]}
                alt="Hairstyle"
                className="character-layer"
              />
            )}
            {selectedShirt !== "none" && (
              <img
                src={shirts[selectedShirt]}
                alt="Shirt"
                className="character-layer"
              />
            )}
            {selectedPants !== "none" && (
              <img
                src={pants[selectedPants]}
                alt="Pants"
                className="character-layer"
              />
            )}
            {selectedShoes !== "none" && (
              <img
                src={shoes[selectedShoes]}
                alt="Shoes"
                className="character-layer"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreator;
