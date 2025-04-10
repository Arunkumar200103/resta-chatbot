import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import { FaPaperPlane } from "react-icons/fa";
import "./App.css";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [detectedLocation, setDetectedLocation] = useState([]);
  const [step, setStep] = useState(0);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedPlace, setSelectedPlace] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [inputText, setInputText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [cities, setCities] = useState([]);
  const [places, setPlaces] = useState({});
  const [placesCurrentPage, setPlacesCurrentPage] = useState(1);

  const citiesPerPage = 4;
  const placesPerPage = 4;

  const totalPages = Math.ceil(cities.length / citiesPerPage);
  const messagesEndRef = useRef(null);

  const gameOptions = ["Chess", "Carrom", "Table Tennis", "Arcade", "Virtual Reality", "Foosball"];
  const musicOptions = ["Rock", "Jazz", "Classical", "Pop", "Hip-hop", "Electronic"];
  const foodOptions = ["Pizza", "Burger", "Pasta", "Biryani", "Sushi", "Tacos"];
  const drinkOptions = ["Coffee", "Tea", "Juice", "Soda", "Cocktail", "Mocktail"];

  useEffect(() => {
    detectLocation();
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/cities")
      .then((res) => res.json())
      .then((data) => {
        setCities(data);
        console.log("Cities fetched:", data);
      })
      .catch((error) => {
        console.error("Error fetching cities:", error);
      });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      let options = [];
      if (step === 1) options = detectedLocation;
      if (step === 2) options = cities.slice((currentPage - 1) * citiesPerPage, currentPage * citiesPerPage);
      if (step === 3) options = places[selectedCity] || [];

      if (event.key === "ArrowDown") {
        setSelectedIndex((prev) => (prev + 1) % options.length);
      } else if (event.key === "ArrowUp") {
        setSelectedIndex((prev) => (prev - 1 + options.length) % options.length);
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (inputText.trim()) {
          handleInputSubmit();
        } else if (options.length > 0) {
          handleSelection(options[selectedIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, selectedCity, selectedIndex, detectedLocation, inputText, currentPage]);

  const detectLocation = () => {
    setTimeout(() => {
      setDetectedLocation(["Nearby POP1", "Nearby POP2", "Nearby POP3"]);
      setMessages([{ text: "Detected your location! Here are the top nearby POPs:", sender: "bot" }]);
      setStep(1);
    }, 2000);
  };

  const handleManualSelection = () => {
    setMessages((prev) => [...prev, { text: "Please select a city:", sender: "bot" }]);
    setStep(2);
    setSelectedIndex(0);
  };

  const handleSelection = (choice) => {
    setMessages((prev) => [...prev, { text: `You selected ${choice}`, sender: "user" }]);

    if (step === 1 || step === 2) {
      setSelectedCity(choice);
      setPlacesCurrentPage(1);
      setSelectedIndex(0);

      fetch(`http://localhost:8080/places/${choice}`)
        .then((res) => res.json())
        .then((data) => {
          setPlaces((prev) => ({ ...prev, [choice]: data }));
          setMessages((prev) => [...prev, { text: `You selected ${choice}. Now choose a POP place:`, sender: "bot" }]);
          setStep(3);
        })
        .catch((err) => console.error("Error fetching places:", err));
    } else if (step === 3) {
      setSelectedPlace(choice);
      setMessages((prev) => [...prev, { text: `You selected ${choice}. Here are the details:`, sender: "bot" }]);
      setStep(4);
      setSelectedIndex(0);
    } else if (step === 4 && choice === "Games") {
      setMessages((prev) => [...prev, { text: "You selected Games. Choose a game:", sender: "bot" }]);
      setStep(5);
    } else if (step === 4 && choice === "Music") {
      setMessages((prev) => [...prev, { text: "You selected Music. Choose a genre:", sender: "bot" }]);
      setStep(6);
    } else if (step === 4 && choice === "Food") {
      setMessages((prev) => [...prev, { text: "You selected Food. Choose a dish:", sender: "bot" }]);
      setStep(7);
    } else if (step === 4 && choice === "Drinks") {
      setMessages((prev) => [...prev, { text: "You selected Drinks. Choose your drink:", sender: "bot" }]);
      setStep(8);
    } else if (step === 4) {
      setMessages((prev) => [...prev, { text: `You selected ${choice}. Enjoy your time at ${selectedPlace}! 🎉`, sender: "bot" }]);
    } else if (step === 5) {
      setMessages((prev) => [...prev, { text: `You selected ${choice}. Enjoy your game! 🎮`, sender: "bot" }]);
    } else if (step === 6) {
      setMessages((prev) => [...prev, { text: `You selected ${choice} music. Enjoy your tunes! 🎶`, sender: "bot" }]);
    } else if (step === 7) {
      setMessages((prev) => [...prev, { text: `You selected ${choice}. Enjoy your meal! 🍽️`, sender: "bot" }]);
    } else if (step === 8) {
      setMessages((prev) => [...prev, { text: `You selected ${choice}. Enjoy your drink! 🍹`, sender: "bot" }]);
    }
  };

  const handleInputSubmit = () => {
    if (!inputText.trim()) return;

    let options = [];
    if (step === 1) options = detectedLocation;
    if (step === 2) options = cities;
    if (step === 3) options = places[selectedCity] || [];

    if (options.includes(inputText.trim())) {
      handleSelection(inputText.trim());
    } else {
      setMessages((prev) => [...prev, { text: "Invalid option, please try again.", sender: "bot" }]);
    }
    setInputText("");
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      setSelectedIndex(0);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      setSelectedIndex(0);
    }
  };

  return (
    <div className="app-container">
      <Header />

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
                    <button
                      key={idx}
                      className={`option-btn ${selectedIndex === idx ? "active" : ""}`}
                      onClick={() => handleSelection(pop)}
                    >
                      {pop}
                    </button>
                  ))}
                  <button
                    className={`option-btn manual-btn ${selectedIndex === detectedLocation.length ? "active" : ""}`}
                    onClick={handleManualSelection}
                  >
                    Select Manually
                  </button>
                </div>
              )}

              {step === 2 && (
                <>
                  <div className="options-grid">
                  {cities
  .slice((currentPage - 1) * citiesPerPage, currentPage * citiesPerPage)
  .map((city, idx) => (
    <button
      key={idx}
      className={`option-btn ${selectedIndex === idx ? "active" : ""}`}
      onClick={() => handleSelection(city.name)}
    >
      {city.name}
    </button>
  ))}

                  </div>
                  <div className="extra-buttons">
                    <button className="option-btn extra-btn" onClick={handlePreviousPage} disabled={currentPage === 1}>
                      Prev
                    </button>
                    <button className="option-btn extra-btn">
                      {currentPage}/{totalPages}
                    </button>
                    <button className="option-btn extra-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>
                      Next
                    </button>
                  </div>
                </>
              )}

              {step === 3 && selectedCity && (
                <>
                  <div className="options-grid">
                  {cities.find(c => c.name === selectedCity)?.places.map((place, idx) => (
  <button
    key={idx}
    className={`option-btn ${selectedIndex === idx ? "active" : ""}`}
    onClick={() => handleSelection(place)}
  >
    {place}
  </button>
))}

                  </div>
                </>
              )}

              {step === 4 && selectedPlace && (
                <div className="options-grid">
                  {["Games", "Music", "Food", "Drinks"].map((option, idx) => (
                    <button
                      key={idx}
                      className={`option-btn ${selectedIndex === idx ? "active" : ""}`}
                      onClick={() => handleSelection(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {step >= 5 && step <= 8 && (
                <div className="options-grid">
                  {(step === 5 ? gameOptions :
                    step === 6 ? musicOptions :
                    step === 7 ? foodOptions : drinkOptions).map((item, idx) => (
                      <button
                        key={idx}
                        className={`option-btn ${selectedIndex === idx ? "active" : ""}`}
                        onClick={() => handleSelection(item)}
                      >
                        {item}
                      </button>
                    ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Type your choice..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button onClick={handleInputSubmit} className="send-btn">
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
