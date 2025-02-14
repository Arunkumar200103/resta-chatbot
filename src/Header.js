import React, { useState } from "react";
import SignupModal from "./SignupModal"; // Import Signup Modal
import "./Header.css";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState([
    "React Hooks",
    "JavaScript ES6",
    "Node.js API",
    "CSS Flexbox",
  ]); // Example search history

  return (
    <>
      <div className="header">
        {/* Hamburger menu */}
        <button className="hamburger-menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          ☰
        </button>

        <h3>ChatBot</h3>

        <button className="sign-up-btn" onClick={() => setIsModalOpen(true)}>Sign Up</button>
      </div>

      {/* Dropdown Menu for Search History */}
      {isMenuOpen && (
        <div className="dropdown-menu">
          <h4>Search History</h4>
          <ul>
            {searchHistory.length > 0 ? (
              searchHistory.map((search, index) => (
                <li key={index}>{search}</li>
              ))
            ) : (
              <li>No recent searches</li>
            )}
          </ul>
        </div>
      )}

      {/* Signup Modal */}
      <SignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Header;
