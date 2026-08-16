import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [mode, setMode] = useState("citizen");
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeGuide, setActiveGuide] = useState(null);

  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const [sosActive, setSosActive] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const [showNotifications, setShowNotifications] = useState(false);

  const [familyPlan, setFamilyPlan] = useState({
    meetingPoint: false,
    emergencyContact: false,
    familyKit: false,
    importantDocuments: false,
  });

  const [checklist, setChecklist] = useState({
    water: false,
    firstAid: false,
    torch: false,
    powerBank: false,
    documents: false,
    emergencyContacts: false,
  });

  const guides = {
    fire: {
      title: "🔥 Fire Emergency",
      points: [
        "Stay calm and move away from the fire.",
        "Use stairs instead of elevators.",
        "If there is smoke, stay low while moving.",
        "Call emergency services when safe.",
      ],
    },

    earthquake: {
      title: "🌍 Earthquake",
      points: [
        "Drop, cover and hold on.",
        "Stay away from windows and heavy objects.",
        "After shaking stops, move carefully to a safe area.",
        "Follow official emergency instructions.",
      ],
    },

    accident: {
      title: "🚗 Road Accident",
      points: [
        "Move to a safe location if possible.",
        "Check for immediate danger.",
        "Seek emergency medical assistance.",
        "Do not move an injured person unnecessarily unless there is immediate danger.",
      ],
    },

    flood: {
      title: "🌊 Flood",
      points: [
        "Move toward higher and safer ground.",
        "Avoid walking or driving through moving floodwater.",
        "Stay away from electrical equipment in wet areas.",
        "Follow official evacuation instructions.",
      ],
    },
  };

  const notifications = [
    {
      icon: "⚠️",
      title: "Safety Reminder",
      text: "Keep your emergency kit ready.",
    },
    {
      icon: "📱",
      title: "Emergency Contacts",
      text: "Make sure important emergency numbers are saved.",
    },
    {
      icon: "🔋",
      title: "Preparedness",
      text: "Keep your phone and power bank charged.",
    },
  ];

  /* ONLINE / OFFLINE */

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  /* AI CHAT */

  const askAI = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setReply("");

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `${mode} mode: ${message}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI response failed");
      }

      setReply(data.reply);
    } catch (error) {
      console.error(error);

      setReply(
        "AI Rakshak se connection nahi ho pa raha. Please check that the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  /* LOCATION */

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Your browser does not support location.");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLocationLoading(false);
      },
      () => {
        alert("Location permission denied. Please allow location access.");
        setLocationLoading(false);
      }
    );
  };

  /* SHARE LOCATION */

  const shareLocation = async () => {
    if (!location) {
      alert("First get your location.");
      return;
    }

    const text = `My emergency location: https://www.google.com/maps?q=${location.latitude},${location.longitude}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "AI Rakshak Emergency Location",
          text,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert("Location link copied.");
    }
  };

  /* CHECKLIST */

  const toggleChecklist = (item) => {
    setChecklist({
      ...checklist,
      [item]: !checklist[item],
    });
  };

  const completedItems = Object.values(checklist).filter(Boolean).length;
  const readiness = Math.round((completedItems / 6) * 100);

  /* FAMILY PLAN */

  const toggleFamilyPlan = (item) => {
    setFamilyPlan({
      ...familyPlan,
      [item]: !familyPlan[item],
    });
  };

  const familyCompleted = Object.values(familyPlan).filter(Boolean).length;
  const familyProgress = Math.round((familyCompleted / 4) * 100);

  return (
    <div className={`app ${darkMode ? "dark-mode" : ""}`}>

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="logo">
           AI <span>RAKSHAK</span>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#emergency">Emergency</a>
          <a href="#location">Location</a>
          <a href="#ai">AI</a>
          <a href="#family">Family</a>
        </div>

        <div className="nav-actions">

          <button
            className="icon-btn"
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle theme"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <button
            className="icon-btn notification-btn"
            onClick={() =>
              setShowNotifications(!showNotifications)
            }
          >
            🔔
            <span className="notification-dot"></span>
          </button>

        </div>

      </nav>

      {/* NOTIFICATIONS */}

      {showNotifications && (
        <div className="notification-panel">

          <div className="notification-header">
            <h3>🔔 Safety Notifications</h3>

            <button
              onClick={() => setShowNotifications(false)}
            >
              ✕
            </button>
          </div>

          {notifications.map((notification, index) => (
            <div className="notification-item" key={index}>
              <span>{notification.icon}</span>

              <div>
                <strong>{notification.title}</strong>
                <p>{notification.text}</p>
              </div>
            </div>
          ))}

        </div>
      )}

      {/* STATUS BAR */}

      <div className="status-bar">

        <span className={online ? "online" : "offline"}>
          {online ? "● Online" : "● Offline"}
        </span>

        <span>
          {online
            ? "AI services available"
            : "Offline safety features available"}
        </span>

      </div>

      {/* HERO */}

      <header className="hero" id="home">

        <div className="hero-content">

          <div className="india-tag">
            🇮🇳 CODE FOR THE NATION
          </div>

          <h1>
            AI Powered
            <span>Safety for India</span>
          </h1>

          <p className="description">
            AI Rakshak is an intelligent emergency and public
            safety assistant designed to help citizens prepare,
            respond and stay safe during emergencies.
          </p>

          <div className="buttons">

            <button
              className="emergency-btn"
              onClick={() => setSosActive(true)}
            >
              🚨 Emergency SOS
            </button>

            <a href="#emergency">
              <button className="guide-btn">
                🛡️ Safety Guides
              </button>
            </a>

          </div>

        </div>

        <div className="rakshak-symbol">

          <div className="shield-icon">
            🛡️
          </div>

          <div className="chakra">
            ☸
          </div>

        </div>

      </header>

      <div className="tricolor-strip">
        <div></div>
        <div></div>
        <div></div>
      </div>

      {/* RISK ALERT */}

      <section className="risk-section">

        <div className="risk-icon">
          ⚠️
        </div>

        <div>
          <span className="risk-label">
            SAFETY STATUS
          </span>

          <h2>
            Stay Prepared, Stay Safe
          </h2>

          <p>
            Keep your emergency contacts, location access and
            emergency kit ready before an incident occurs.
          </p>
        </div>

        <div className="risk-status">
          <strong>
            {readiness >= 70
              ? "LOW RISK"
              : readiness >= 40
              ? "MEDIUM RISK"
              : "HIGH RISK"}
          </strong>

          <small>
            Preparedness based
          </small>
        </div>

      </section>

      {/* EMERGENCY CONTACTS */}

      <section
        className="contacts-section"
        id="emergency"
      >

        <div className="section-tag">
          EMERGENCY SUPPORT
        </div>

        <h2>
          Emergency Contacts
        </h2>

        <p className="section-description">
          Quickly contact emergency services.
        </p>

        <div className="contact-grid">

          <a
            href="tel:112"
            className="contact-card emergency"
          >
            <span>🚨</span>
            <strong>112</strong>
            <small>National Emergency</small>
          </a>

          <a
            href="tel:100"
            className="contact-card"
          >
            <span>👮</span>
            <strong>100</strong>
            <small>Police</small>
          </a>

          <a
            href="tel:101"
            className="contact-card"
          >
            <span>🔥</span>
            <strong>101</strong>
            <small>Fire Service</small>
          </a>

          <a
            href="tel:108"
            className="contact-card"
          >
            <span>🚑</span>
            <strong>108</strong>
            <small>Ambulance</small>
          </a>

        </div>

      </section>

      {/* GUIDES */}

      <section className="section">

        <div className="section-tag">
          QUICK RESPONSE
        </div>

        <h2>
          Emergency Safety Guides
        </h2>

        <p className="section-description">
          Get basic safety instructions quickly.
        </p>

        <div className="cards">

          {Object.keys(guides).map((key) => (

            <button
              key={key}
              className={`card ${
                key === "fire"
                  ? "saffron"
                  : key === "earthquake"
                  ? "blue"
                  : key === "accident"
                  ? "red"
                  : "green"
              }`}
              onClick={() => setActiveGuide(guides[key])}
            >

              <div className="icon">
                {guides[key].title.split(" ")[0]}
              </div>

              <h3>
                {guides[key].title.substring(2)}
              </h3>

              <p>
                Tap to view safety steps.
              </p>

            </button>

          ))}

        </div>

      </section>

      {/* LOCATION */}

      <section
        className="location-section"
        id="location"
      >

        <div className="section-tag">
          LOCATION SAFETY
        </div>

        <h2>
          📍 Emergency Location
        </h2>

        <p>
          Get and share your current location during an emergency.
        </p>

        <div className="location-buttons">

          <button
            className="location-btn"
            onClick={getLocation}
            disabled={locationLoading}
          >
            {locationLoading
              ? "📍 Getting Location..."
              : "📍 Get My Location"}
          </button>

          {location && (
            <button
              className="share-location-btn"
              onClick={shareLocation}
            >
              📤 Share Location
            </button>
          )}

        </div>

        {location && (

          <div className="location-result">

            <h3>
              ✅ Location Detected
            </h3>

            <p>
              Latitude:
              <strong> {location.latitude.toFixed(6)}</strong>
            </p>

            <p>
              Longitude:
              <strong> {location.longitude.toFixed(6)}</strong>
            </p>

            <a
              className="map-btn"
              target="_blank"
              rel="noreferrer"
              href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
            >
              🗺️ Open on Map
            </a>

          </div>

        )}

      </section>

      {/* MODE */}

      <section className="mode-section">

        <div className="section-tag">
          PERSONALIZED SAFETY
        </div>

        <h2>
          Choose Your Rakshak Mode
        </h2>

        <div className="mode-container">

          <button
            className={`mode-card ${
              mode === "citizen" ? "active" : ""
            }`}
            onClick={() => setMode("citizen")}
          >
            <span>👤</span>
            <strong>Citizen</strong>
            <small>Emergency & Public Safety</small>
          </button>

          <button
            className={`mode-card ${
              mode === "forces" ? "active" : ""
            }`}
            onClick={() => setMode("forces")}
          >
            <span>🪖</span>
            <strong>Forces & Veterans</strong>
            <small>Support & preparedness</small>
          </button>

          <button
            className={`mode-card ${
              mode === "family" ? "active" : ""
            }`}
            onClick={() => setMode("family")}
          >
            <span>👨‍👩‍👧</span>
            <strong>Family</strong>
            <small>Family safety & preparedness</small>
          </button>

        </div>

      </section>

      {/* AI */}

      <section
        className="ai-section"
        id="ai"
      >

        <div className="section-tag">
          ARTIFICIAL INTELLIGENCE
        </div>

        <h2>
          🤖 AI Rakshak Assistant
        </h2>

        <p className="ai-intro">
          Ask questions about emergencies, preparedness and public safety.
        </p>

        <div className="ai-chat">

          <div className="chat-header">
            <span>🇮🇳 AI Rakshak</span>
            <span>● {online ? "Online" : "Offline"}</span>
          </div>

          <div className="chat-body">

            {!reply && !message && (
              <div className="bot-message">
                👋 Hello! I am AI Rakshak.
                How can I help you stay safe?
              </div>
            )}

            {message && (
              <div className="user-message">
                {message}
              </div>
            )}

            {loading && (
              <div className="bot-message">
                🤖 Thinking...
              </div>
            )}

            {reply && (
              <div className="bot-message">
                <strong>🇮🇳 AI Rakshak</strong>
                <p>{reply}</p>
              </div>
            )}

          </div>

          <div className="chat-input">

            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  askAI();
                }
              }}
              placeholder="Ask about an emergency..."
            />

            <button
              onClick={askAI}
              disabled={loading}
            >
              {loading ? "..." : "Ask"}
            </button>

          </div>

        </div>

      </section>

      {/* CHECKLIST */}

      <section className="checklist-section">

        <div className="section-tag">
          PREPAREDNESS
        </div>

        <h2>
          📋 Emergency Safety Checklist
        </h2>

        <p className="section-description">
          Complete these tasks to improve your emergency readiness.
        </p>

        <div className="checklist-grid">

          {[
            ["water", "💧", "Drinking Water", "Keep safe drinking water ready."],
            ["firstAid", "🩹", "First-Aid Kit", "Keep basic first-aid supplies."],
            ["torch", "🔦", "Flashlight", "Keep a working flashlight ready."],
            ["powerBank", "🔋", "Power Bank", "Keep communication devices charged."],
            ["documents", "📄", "Important Documents", "Keep essential documents accessible."],
            ["emergencyContacts", "📞", "Emergency Contacts", "Save important emergency numbers."],
          ].map(([key, icon, title, text]) => (

            <label
              key={key}
              className={
                checklist[key]
                  ? "check-item checked"
                  : "check-item"
              }
            >

              <input
                type="checkbox"
                checked={checklist[key]}
                onChange={() => toggleChecklist(key)}
              />

              <span>{icon}</span>

              <div>
                <strong>{title}</strong>
                <small>{text}</small>
              </div>

            </label>

          ))}

        </div>

        <div className="readiness-card">

          <div>
            <span>📊</span>

            <div>
              <h3>Emergency Readiness</h3>
              <p>{completedItems} / 6 tasks completed</p>
            </div>
          </div>

          <div className="score">
            <strong>{readiness}%</strong>

            <small>
              {readiness === 100
                ? "Fully Ready!"
                : readiness >= 50
                ? "Almost Ready"
                : "Needs Preparation"}
            </small>
          </div>

        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${readiness}%` }}
          ></div>
        </div>

      </section>

      {/* FAMILY SAFETY PLAN */}

      <section
        className="family-section"
        id="family"
      >

        <div className="section-tag">
          FAMILY SAFETY
        </div>

        <h2>
          👨‍👩‍👧 Family Safety Plan
        </h2>

        <p className="section-description">
          Prepare a simple family emergency plan.
        </p>

        <div className="family-grid">

          {[
            ["meetingPoint", "📍", "Safe Meeting Point"],
            ["emergencyContact", "📞", "Family Emergency Contact"],
            ["familyKit", "🎒", "Family Emergency Kit"],
            ["importantDocuments", "📄", "Important Documents"],
          ].map(([key, icon, title]) => (

            <button
              key={key}
              className={
                familyPlan[key]
                  ? "family-card completed"
                  : "family-card"
              }
              onClick={() => toggleFamilyPlan(key)}
            >

              <span>{icon}</span>

              <strong>{title}</strong>

              <small>
                {familyPlan[key]
                  ? "✓ Completed"
                  : "Tap to mark ready"}
              </small>

            </button>

          ))}

        </div>

        <div className="family-progress">

          <strong>
            Family Plan: {familyProgress}%
          </strong>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${familyProgress}%`,
              }}
            ></div>
          </div>

        </div>

      </section>

      {/* PATRIOT */}

      <section className="patriot-section">

        <div>
          <span className="flag">🇮🇳</span>

          <h2>
            Salute to Our Protectors
          </h2>

          <p>
            Technology for safety, preparedness and service to the nation.
          </p>
        </div>

        <div className="patriot-badge">
          🛡️
          <span>JAI HIND</span>
        </div>

      </section>

      {/* FOOTER */}

      <footer>

        <div className="tricolor-strip">
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div className="footer-logo">
           AI RAKSHAK
        </div>

        <p>
          Built for India • Technology for Safety
        </p>

        <small>
          Jai Hind 
        </small>

      </footer>

      {/* SOS MODAL */}

      {sosActive && (

        <div className="sos-overlay">

          <div className="sos-modal">

            <div className="sos-icon">
              🚨
            </div>

            <h2>
              Emergency SOS
            </h2>

            <p>
              If you are facing an immediate emergency,
              contact emergency services.
            </p>

            <a
              href="tel:112"
              className="call-112"
            >
              📞 Call 112
            </a>

            <button
              className="cancel-sos"
              onClick={() => setSosActive(false)}
            >
              Cancel
            </button>

          </div>

        </div>

      )}

      {/* GUIDE MODAL */}

      {activeGuide && (

        <div className="guide-overlay">

          <div className="guide-modal">

            <button
              className="close-button"
              onClick={() => setActiveGuide(null)}
            >
              ✕
            </button>

            <h2>
              {activeGuide.title}
            </h2>

            <div className="guide-points">

              {activeGuide.points.map((point, index) => (

                <div
                  key={index}
                  className="guide-point"
                >

                  <span>{index + 1}</span>

                  <p>{point}</p>

                </div>

              ))}

            </div>

            <button
              className="modal-button"
              onClick={() => setActiveGuide(null)}
            >
              Got it
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;