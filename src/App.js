import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const cities = ["Chennai", "Erode", "Kovai", "Bengaluru", "Trichy"];
const places = {
  Chennai: ["CentralPark POP", "TimesSquare", "Marina Beach", "Anna Nagar", "Egmore", "Tambaram", "T Nagar"],
  Erode: ["Hollywood POP", "TymHub POP", "Thiran POP", "Tidel Park", "Erode East", "Karur", "Bhavani"],
  Kovai: ["Isha POP", "Navy POP", "Cloud POP", "Kovai Estates", "Saravanampatti", "Coimbatore", "Peelamedu"],
};

const App = () => {
  const [messages, setMessages] = useState([]);
  const [detectedLocation, setDetectedLocation] = useState([]);
  const [step, setStep] = useState(0);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    detectLocation();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      let options = [];
      if (step === 1) options = detectedLocation;
      if (step === 2) options = cities;
      if (step === 3) options = places[selectedCity] || [];

      if (event.key === "ArrowDown") {
        setSelectedIndex((prev) => (prev + 1) % options.length);
      } else if (event.key === "ArrowUp") {
        setSelectedIndex((prev) => (prev - 1 + options.length) % options.length);
      } else if (event.key === "Enter") {
        if (options.length > 0) handleSelection(options[selectedIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, selectedCity, selectedIndex, detectedLocation]);

  const detectLocation = () => {
    setTimeout(() => {
      setDetectedLocation(["Nearby POP1", "Nearby POP2", "Nearby POP3"]);
      setMessages([{ text: "Detected your location! Here are the top nearby POPs:", sender: "bot" }]);
      setStep(1);
    }, 2000);
  };

  const handleManualSelection = () => {
    setMessages([{ text: "Please select a city:", sender: "bot" }]);
    setStep(2);
    setSelectedIndex(0);
  };

  const handleSelection = (choice) => {
    if (step === 2) {
      setSelectedCity(choice);
      setMessages([{ text: `You selected ${choice}. Now choose a POP place:`, sender: "bot" }]);
      setStep(3);
      setSelectedIndex(0);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-box">
        <div className="chat-container">
          <div className="messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}

            {step === 1 && (
              <div className="options-grid">
                {detectedLocation.map((pop, idx) => (
                  <button key={idx} className={`option-btn ${selectedIndex === idx ? "active" : ""}`}>
                    {pop}
                  </button>
                ))}
                <button className={`option-btn manual-btn ${selectedIndex === detectedLocation.length ? "active" : ""}`} onClick={handleManualSelection}>
                  Select Manually
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="options-grid">
                {cities.map((city, idx) => (
                  <button key={idx} className={`option-btn ${selectedIndex === idx ? "active" : ""}`} onClick={() => handleSelection(city)}>
                    {city}
                  </button>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="options-grid">
                {places[selectedCity]?.map((place, idx) => (
                  <button key={idx} className={`option-btn ${selectedIndex === idx ? "active" : ""}`}>
                    {place}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
