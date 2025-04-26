import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import { FaPaperPlane, FaCalendarAlt, FaClock, FaUsers } from "react-icons/fa";
import "./App.css";

const ChatBot = () => {
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
  
  // New reservation state
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(1);
  const [activityChoice, setActivityChoice] = useState("");
  const [activityOption, setActivityOption] = useState("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [reservationComplete, setReservationComplete] = useState(false);

  const citiesPerPage = 4;
  const placesPerPage = 4;
  const totalPages = Math.ceil(cities.length / citiesPerPage);
  const messagesEndRef = useRef(null);

  const gameOptions = ["Chess", "Carrom", "Table Tennis", "Arcade", "Virtual Reality", "Foosball"];
  const musicOptions = ["Rock", "Jazz", "Classical", "Pub", "Hip-hop", "Electronic"];
  const foodOptions = ["Pizza", "Burger", "Pasta", "Biryani", "Sushi", "Tacos"];
  const drinkOptions = ["Coffee", "Tea", "Juice", "Soda", "Cocktail", "Mocktail"];

  // Generate available times for the next 7 days
  const generateAvailableTimes = () => {
    return ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM", "8:00 PM"];
  };

  useEffect(() => {
    detectLocation();
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/cities")
      .then((res) => res.json())
      .then((data) => {
        setCities(data);
      })
      .catch(() => {
        const staticCities = [
            { id: 1, name: 'Bengaluru' },
            { id: 2, name: 'Chennai' },
            { id: 3, name: 'Erode' },
            { id: 4, name: 'Hyderabad' },
            { id: 5, name: 'Jaipur' },
            { id: 6, name: 'Kolkata' },
            { id: 7, name: 'Kovai' },
            { id: 8, name: 'Trichy' },
          ];
        setCities(staticCities);
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
      setDetectedLocation(["Nearby Pub1", "Nearby Pub2", "Nearby Pub3"]);
      setMessages([{ text: "Detected your location! Here are the top nearby Pubs:", sender: "bot" }]);
      setStep(1);
    }, 2000);
  };

  const handleManualSelection = () => {
    setMessages((prev) => [...prev, { text: "Please select a city:", sender: "bot" }]);
    setStep(2);
    setSelectedIndex(0);
  };

  const handleSelection = (choice) => {
    setMessages((prev) => [...prev, { text: `You selected ${choice.name || choice}`, sender: "user" }]);
  
    if (step === 1 || step === 2) {
      setSelectedCity(choice.name);
      setPlacesCurrentPage(1);
      setSelectedIndex(0);
  
      fetch(`http://localhost:8080/places/byCity/${choice.id}`)
        .then((res) => res.json())
        .then((data) => {
          setPlaces((prev) => ({ ...prev, [choice.name]: data }));
          setMessages((prev) => [
            ...prev,
            { text: `You selected ${choice.name}. Now choose a Pub place:`, sender: "bot" },
          ]);
          setStep(3);
        })
        .catch((err) => {
          console.error('Error fetching places:', err);
  
          const staticPlaces = [
            { name: 'Electronic City', cityId: 1 },
            { name: 'MG Road', cityId: 1 },
            { name: 'Indiranagar', cityId: 1 },
            { name: 'Whitefield', cityId: 1 },
            { name: 'Koramangala', cityId: 1 },
            { name: 'CentralPark Pub', cityId: 2 },
            { name: 'TimesSquare', cityId: 2 },
            { name: 'Marina Beach', cityId: 2 },
            { name: 'Anna Nagar', cityId: 2 },
            { name: 'Egmore', cityId: 2 },
            { name: 'Tambaram', cityId: 2 },
            { name: 'T Nagar', cityId: 2 },
            { name: 'Hollywood Pub', cityId: 3 },
            { name: 'TymHub Pub', cityId: 3 },
            { name: 'Thiran Pub', cityId: 3 },
            { name: 'Tidel Park', cityId: 3 },
            { name: 'Erode East', cityId: 3 },
            { name: 'Karur', cityId: 3 },
            { name: 'Bhavani', cityId: 3 },
            { name: 'Charminar', cityId: 4 },
            { name: 'Hitech City', cityId: 4 },
            { name: 'Golkonda Fort', cityId: 4 },
            { name: 'Banjara Hills', cityId: 4 },
            { name: 'Amber Fort', cityId: 5 },
            { name: 'Hawa Mahal', cityId: 5 },
            { name: 'City Palace', cityId: 5 },
            { name: 'Johri Bazaar', cityId: 5 },
            { name: 'Howrah Bridge', cityId: 6 },
            { name: 'Victoria Memorial', cityId: 6 },
            { name: 'Park Street', cityId: 6 },
            { name: 'Salt Lake', cityId: 6 },
            { name: 'Isha Pub', cityId: 7 },
            { name: 'Navy Pub', cityId: 7 },
            { name: 'Cloud Pub', cityId: 7 },
            { name: 'Kovai Estates', cityId: 7 },
            { name: 'Saravanampatti', cityId: 7 },
            { name: 'Coimbatore', cityId: 7 },
            { name: 'Peelamedu', cityId: 7 },
            { name: 'Rock Fort', cityId: 8 },
            { name: 'Srirangam', cityId: 8 },
            { name: 'Central Bus Stand', cityId: 8 },
            { name: 'Thillai Nagar', cityId: 8 },
          ];
  
          setPlaces((prev) => ({
            ...prev,
            [choice.name]: staticPlaces.filter(place => place.cityId === choice.id)
          }));
  
          setMessages((prev) => [
            ...prev,
            { text: `You selected ${choice.name}. Now choose a Pub place:`, sender: "bot" },
          ]);
          setStep(3);
        });
    } else if (step === 3) {
      setSelectedPlace(choice.name);
      setMessages((prev) => [
        ...prev,
        { text: `You selected ${choice.name}. Here are the details:`, sender: "bot" },
      ]);
      setStep(4);
      setSelectedIndex(0);
    } else if (step === 4) {
      if (["Games", "Music", "Food", "Drinks"].includes(choice)) {
        const nextStep = { Games: 5, Music: 6, Food: 7, Drinks: 8 }[choice];
        setActivityChoice(choice);
        setMessages((prev) => [...prev, { text: `You selected ${choice}. Choose an option:`, sender: "bot" }]);
        setStep(nextStep);
      } else {
        setMessages((prev) => [...prev, { text: `You selected ${choice}. Enjoy your time at ${selectedPlace}! 🎉`, sender: "bot" }]);
      }
    } else if (step >= 5 && step <= 8) {
      setActivityOption(choice);
      
      // After selecting the specific activity option, move to reservation step
      setMessages((prev) => [
        ...prev, 
        { text: `Great choice! Would you like to make a reservation for ${choice} at ${selectedPlace}?`, sender: "bot" }
      ]);
      setStep(9);
    } else if (step === 9) {
      if (choice === "Yes") {
        setAvailableTimes(generateAvailableTimes());
        const today = new Date();
        setDate(today.toISOString().split('T')[0]);
        
        setMessages((prev) => [
          ...prev,
          { text: "Great! Let's make your reservation. Please select a date:", sender: "bot" }
        ]);
        setIsDatePickerOpen(true);
        setStep(10);
      } else {
        setMessages((prev) => [
          ...prev,
          { text: `No problem! Enjoy your time at ${selectedPlace}! Feel free to visit anytime.`, sender: "bot" }
        ]);
        // Restart the flow
        setTimeout(() => {
          setMessages([{ text: "Would you like to start a new search?", sender: "bot" }]);
          setStep(1);
        }, 3000);
      }
    }
  };
  
  const handleDateSelection = (selectedDate) => {
    setDate(selectedDate);
    setIsDatePickerOpen(false);
    
    setMessages((prev) => [
      ...prev,
      { text: `You selected date: ${selectedDate}`, sender: "user" },
      { text: "Please select a time slot:", sender: "bot" }
    ]);
    
    setStep(11);
  };
  
  const handleTimeSelection = (selectedTime) => {
    setTime(selectedTime);
    
    setMessages((prev) => [
      ...prev,
      { text: `You selected time: ${selectedTime}`, sender: "user" },
      { text: "How many guests will be joining?", sender: "bot" }
    ]);
    
    setStep(12);
  };
  
  const handleGuestSelection = (guestCount) => {
    setGuests(guestCount);
    
    // Show reservation summary
    setMessages((prev) => [
      ...prev,
      { text: `${guestCount} guests`, sender: "user" },
      { 
        text: `Reservation Summary:
        
Location: ${selectedPlace}, ${selectedCity}
Activity: ${activityChoice} - ${activityOption}
Date: ${date}
Time: ${time}
Guests: ${guestCount}

Would you like to confirm this reservation?`, 
        sender: "bot" 
      }
    ]);
    
    setStep(13);
  };
  
  const handleReservationConfirmation = (confirmed) => {
    if (confirmed) {
      // Make the reservation
      // In a real app, you would send this to a backend
      const reservationId = Math.floor(Math.random() * 10000);
      
      setReservationComplete(true);
      setMessages((prev) => [
        ...prev,
        { text: "Confirm", sender: "user" },
        { 
          text: `Your reservation is confirmed! Reservation #${reservationId}

Location: ${selectedPlace}, ${selectedCity}
Activity: ${activityChoice} - ${activityOption}
Date: ${date}
Time: ${time}
Guests: ${guests}

A confirmation has been sent to your email. We're looking forward to seeing you!

Would you like to make another reservation?`, 
          sender: "bot" 
        }
      ]);
      
      setStep(14);
    } else {
      setMessages((prev) => [
        ...prev,
        { text: "Cancel", sender: "user" },
        { text: "No problem. Let's start over. What would you like to do?", sender: "bot" }
      ]);
      
      // Reset to city selection
      setStep(2);
      setSelectedIndex(0);
    }
  };

  const handleInputSubmit = () => {
    if (!inputText.trim()) return;

    let options = [];
    if (step === 1) options = detectedLocation;
    if (step === 2) options = cities.map((c) => c.name);
    if (step === 3) options = (places[selectedCity] || []).map((p) => p.name);

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
  
  const getNextSevenDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push({
        value: date.toISOString().split('T')[0],
        display: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      });
    }
    return days;
  };
  
  const renderCalendar = () => {
    const days = getNextSevenDays();
    
    return (
      <div className="calendar-container">
        <div className="calendar-header">
          <FaCalendarAlt /> Select a Date
        </div>
        <div className="date-grid">
          {days.map((day, idx) => (
            <button
              key={idx}
              className="date-btn"
              onClick={() => handleDateSelection(day.value)}
            >
              {day.display}
            </button>
          ))}
        </div>
      </div>
    );
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
                  {detectedLocation.map((Pub, idx) => (
                    <button
                      key={idx}
                      className={`option-btn ${selectedIndex === idx ? "active" : ""}`}
                      onClick={() => handleSelection(Pub)}
                    >
                      {Pub}
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
                          onClick={() => handleSelection({ id: city.id, name: city.name })}
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
                <div className="options-grid">
                  {places[selectedCity]?.map((place, idx) => (
                    <button
                      key={idx}
                      className={`option-btn ${selectedIndex === idx ? "active" : ""}`}
                      onClick={() => handleSelection(place)}
                    >
                      {place.name}
                    </button>
                  ))}
                </div>
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
              
              {step === 9 && (
                <div className="options-grid">
                  {["Yes", "No"].map((choice, idx) => (
                    <button
                      key={idx}
                      className={`option-btn ${selectedIndex === idx ? "active" : ""}`}
                      onClick={() => handleSelection(choice)}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              )}
              
              {step === 10 && isDatePickerOpen && renderCalendar()}
              
              {step === 11 && (
                <div className="options-grid">
                  {availableTimes.map((timeSlot, idx) => (
                    <button
                      key={idx}
                      className="option-btn"
                      onClick={() => handleTimeSelection(timeSlot)}
                    >
                      <FaClock /> {timeSlot}
                    </button>
                  ))}
                </div>
              )}
              
              {step === 12 && (
                <div className="options-grid">
                  {[1, 2, 3, 4, 5, 6, 8, 10].map((count, idx) => (
                    <button
                      key={idx}
                      className="option-btn"
                      onClick={() => handleGuestSelection(count)}
                    >
                      <FaUsers /> {count} {count === 1 ? 'guest' : 'guests'}
                    </button>
                  ))}
                </div>
              )}
              
              {step === 13 && (
                <div className="options-grid confirmation-grid">
                  <button
                    className="option-btn confirm-btn"
                    onClick={() => handleReservationConfirmation(true)}
                  >
                    Confirm Reservation
                  </button>
                  <button
                    className="option-btn cancel-btn"
                    onClick={() => handleReservationConfirmation(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}
              
              {step === 14 && (
                <div className="options-grid">
                  <button
                    className="option-btn"
                    onClick={() => {
                      setStep(1);
                      setMessages([{ text: "Where would you like to go?", sender: "bot" }]);
                    }}
                  >
                    Make New Reservation
                  </button>
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

export default ChatBot;