import React, { useState } from "react";
import SignupModal from "./SignupModal"; // Import Signup Modal
import "./Header.css";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="header">
        <button className="hamburger-menu">☰</button>
        <h3>ChatBot</h3>
        <button className="sign-up-btn" onClick={() => setIsModalOpen(true)}>Sign Up</button>
      </div>

      <SignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Header;
