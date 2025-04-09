import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./BootScreen.css";

const bootLines = [
  "[✓] Loading assets...",
  "[✓] Initializing shaders...",
  "[✓] Establishing connection to the arcade...",
  "[✓] Ready.",
  "> WELCOME TO GAMEVERSE",
];

function BootScreen({ onFinish }) {
  const [visibleLines, setVisibleLines] = useState([]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setVisibleLines((lines) => [...lines, bootLines[i]]);
      i++;
      if (i >= bootLines.length) {
        clearInterval(interval);
        setTimeout(() => {
          onFinish?.();
        }, 2000);
      }
    }, 1000);

    const skip = () => {
      clearInterval(interval);
      onFinish?.();
    };

    window.addEventListener("keydown", skip);
    window.addEventListener("mousedown", skip);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("mousedown", skip);
    };
  }, [onFinish]);

  return (
    <div className="crt">
      <div className="boot-sequence">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          [BOOTING GAMEVERSE SYSTEM...]
        </motion.h2>

        {visibleLines.map((line, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.3 }}
          >
            {line}
          </motion.p>
        ))}
      </div>

      <div className="skip-hint">Press any key or click to skip</div>
    </div>
  );
}

export default BootScreen;
