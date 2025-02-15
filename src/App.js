import React, { useState, useEffect, useRef } from "react";
import Header from "./Header"; // Import Header component
import { FaPaperPlane } from "react-icons/fa"; // Import send icon
import "./App.css";

const cities = ["Chennai", "Erode", "Kovai", "Bengaluru", "Trichy", "Kolkata", "Jaipur", "Hyderabad"];
const places = {
  Chennai: ["CentralPark POP", "TimesSquare", "Marina Beach", "Anna Nagar", "Egmore", "Tambaram", "T Nagar"],
  Erode: ["Hollywood POP", "TymHub POP", "Thiran POP", "Tidel Park", "Erode East", "Karur", "Bhavani"],
  Kovai: ["Isha POP", "Navy POP", "Cloud POP", "Kovai Estates", "Saravanampatti", "Coimbatore", "Peelamedu"],
  Bengaluru: ["Electronic City", "MG Road", "Indiranagar", "Whitefield", "Koramangala"],
  Trichy: ["Rock Fort", "Srirangam", "Central Bus Stand", "Thillai Nagar"],
  Kolkata: ["Howrah Bridge", "Victoria Memorial", "Park Street", "Salt Lake"],
  Jaipur: ["Amber Fort", "Hawa Mahal", "City Palace", "Johri Bazaar"],
  Hyderabad: ["Charminar", "Hitech City", "Golkonda Fort", "Banjara Hills"]
};

const App = () => {
  const [messages, setMessages] = useState([]);
  const [detectedLocation, setDetectedLocation] = useState([]);
  const [step, setStep] = useState(0);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedPlace, setSelectedPlace] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [inputText, setInputText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const citiesPerPage = 4;
  const [placesCurrentPage, setPlacesCurrentPage] = useState(1);
  const placesPerPage = 4;

  const totalPages = Math.ceil(cities.length / citiesPerPage);
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

  const gameOptions = ["Chess", "Carrom", "Table Tennis", "Arcade", "Virtual Reality", "Foosball"];
  const musicOptions = ["Rock", "Jazz", "Classical", "Pop", "Hip-hop", "Electronic"];
  const foodOptions = ["Pizza", "Burger", "Pasta", "Biryani", "Sushi", "Tacos"];
  const drinkOptions = ["Coffee", "Tea", "Juice", "Soda", "Cocktail", "Mocktail"];

  const handleSelection = (choice) => {
    setMessages((prev) => [...prev, { text: `You selected ${choice}`, sender: "user" }]);

    if (step === 1 || step === 2) {
      setSelectedCity(choice);
      setPlacesCurrentPage(1);
      setMessages((prev) => [...prev, { text: `You selected ${choice}. Now choose a POP place:`, sender: "bot" }]);
      setStep(3);
      setSelectedIndex(0);
    }
    else if (step === 3) {
      setSelectedPlace(choice);
      setMessages((prev) => [...prev, { text: `You selected ${choice}. Here are the details:`, sender: "bot" }]);
      setStep(4);
      setSelectedIndex(0);
    }

    // 🎮 Games Selection
    else if (step === 4 && choice === "Games") {
      setMessages((prev) => [...prev, { text: "You selected Games. Choose a game:", sender: "bot" }]);
      setStep(5);
    }
    // 🎵 Music Selection
    else if (step === 4 && choice === "Music") {
      setMessages((prev) => [...prev, { text: "You selected Music. Choose a genre:", sender: "bot" }]);
      setStep(6);
    }
    // 🍔 Food Selection
    else if (step === 4 && choice === "Food") {
      setMessages((prev) => [...prev, { text: "You selected Food. Choose a dish:", sender: "bot" }]);
      setStep(7);
    }
    // 🥤 Drinks Selection
    else if (step === 4 && choice === "Drinks") {
      setMessages((prev) => [...prev, { text: "You selected Drinks. Choose your drink:", sender: "bot" }]);
      setStep(8);
    }
    else if (step === 4) {
      setMessages((prev) => [...prev, { text: `You selected ${choice}. Enjoy your time at ${selectedPlace}! 🎉`, sender: "bot" }]);
    }
    // 🕹️ Game Selection
    else if (step === 5) {
      setMessages((prev) => [...prev, { text: `You selected ${choice}. Enjoy your game! 🎮`, sender: "bot" }]);
    }
    // 🎶 Music Genre Selection
    else if (step === 6) {
      setMessages((prev) => [...prev, { text: `You selected ${choice} music. Enjoy your tunes! 🎶`, sender: "bot" }]);
    }
    // 🍽️ Food Item Selection
    else if (step === 7) {
      setMessages((prev) => [...prev, { text: `You selected ${choice}. Enjoy your meal! 🍽️`, sender: "bot" }]);
    }
    // 🍹 Drinks Selection
    else if (step === 8) {
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
      <Header /> {/* Include Header Component */}

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
                  <button className={`option-btn manual-btn ${selectedIndex === detectedLocation.length ? "active" : ""}`} onClick={handleManualSelection}>
                    Select Manually
                  </button>
                </div>
              )}

              {step === 2 && (
                <>
                  <div className="options-grid">
                    {cities.slice((currentPage - 1) * citiesPerPage, currentPage * citiesPerPage).map((city, idx) => (
                      <button
                        key={idx}
                        className={`option-btn ${selectedIndex === idx ? "active" : ""}`}
                        onClick={() => handleSelection(city)}
                      >
                        {city}
                      </button>
                    ))}
                  </div>

                  {/* Pagination Controls */}
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
                    {places[selectedCity]?.map((place, idx) => (
                      <button key={idx} className={`option-btn ${selectedIndex === idx ? "active" : ""}`} onClick={() => handleSelection(place)}>
                        {place}
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
              {/* New Container for Selected Place Details */}
              {step === 4 && selectedPlace && (
                <>
                  <div className="options-grid">
                    {["Games", "Music", "Food", "Drinks"].map((option, idx) => (
                      <button key={idx} className={`option-btn ${selectedIndex === idx ? "active" : ""}`}
                        onClick={() => handleSelection(option)} >
                        {option}
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

              {step === 5 && (
                <>
                  <div className="options-grid">
                    {gameOptions.map((game, idx) => (
                      <button key={idx} className="option-btn" onClick={() => handleSelection(game)}>
                        {game}
                      </button>
                    ))}
                  </div>

                </>
              )}

              {step === 6 && (
                <>
                  <div className="options-grid">
                    {musicOptions.map((music, idx) => (
                      <button key={idx} className="option-btn" onClick={() => handleSelection(music)}>
                        {music}
                      </button>
                    ))}
                  </div>

                </>
              )}

              {step === 7 && (
                <>
                  <div className="options-grid">
                    {foodOptions.map((food, idx) => (
                      <button key={idx} className={`option-btn ${selectedIndex === idx ? "active" : ""}`}
                        onClick={() => handleSelection(food)}>
                        {food}
                      </button>
                    ))}
                  </div>

                </>
              )}

              {step === 8 && (
                <>
                  <div className="options-grid">
                    {drinkOptions.map((drink, idx) => (
                      <button key={idx} className={`option-btn ${selectedIndex === idx ? "active" : ""}`}
                        onClick={() => handleSelection(drink)}>
                        {drink}
                      </button>
                    ))}
                  </div>

                </>
              )}



              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Keyboard input with send icon */}
          <div className="chat-input">
            <input type="text" placeholder="Type your choice..." value={inputText} onChange={(e) => setInputText(e.target.value)} />
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
