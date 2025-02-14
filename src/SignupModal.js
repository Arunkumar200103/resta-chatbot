import React, { useState } from "react";
import "./SignupModal.css";

const SignupModal = ({ isOpen, onClose }) => {
  const [isSignup, setIsSignup] = useState(true);

  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>{isSignup ? "Sign Up" : "Sign In"}</h2>

        <form>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          {isSignup && <input type="text" placeholder="Username" required />}
          <button type="submit">{isSignup ? "Sign Up" : "Sign In"}</button>
        </form>

        <p onClick={() => setIsSignup(!isSignup)} className="switch-auth">
          {isSignup ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        </p>
      </div>
    </div>
  );
};

export default SignupModal;
