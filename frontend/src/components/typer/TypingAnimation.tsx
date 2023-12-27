import React from "react";
import { TypeAnimation } from "react-type-animation";

const TypingAnimation = () => {
  return (
    <TypeAnimation
      sequence={[
        "Personalized Stretching Routines 🧘‍♀️",
        1200,
        "Enhanced Mobility 🤸‍♂️",
        1000,
        "Reduce Stress & Improve Posture 🚶‍♀️",
        1500,
        "Empower Your Movement, One Stretch at a time 🏃‍♀️",
        1500,
        "Your Partner in Flexibility🏄‍♂️",
        1500,
      ]}
      speed={50}
      style={{
        fontSize: "60px",
        color: "white",
        display: "inline-block",
        textShadow: "1px 1px 20px #000",
      }}
      repeat={Infinity}
    />
  );
};

export default TypingAnimation;
