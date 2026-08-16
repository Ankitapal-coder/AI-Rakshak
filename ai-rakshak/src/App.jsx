import "./App.css";
import { useState } from "react";

function App() {
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const emergencyGuides = {
    medical: {
      title: "🚑 Medical Emergency",
      steps: [
        "Stay calm and assess the situation.",
        "Move to a safe place if necessary.",
        "Contact appropriate emergency services.",
        "Follow instructions from trained responders.",
      ],
    },

    fire: {
      title: "🔥 Fire Emergency",
      steps: [
        "Move away from fire and smoke.",
        "Alert people nearby.",
        "Use a safe exit and avoid elevators.",
        "Contact fire and emergency services.",
      ],
    },

    disaster: {
      title: "🌊 Disaster Emergency",
      steps: [
        "Stay calm and follow official safety instructions.",
        "Move away from immediate hazards.",
        "Keep essential supplies with you.",
        "Check on family members when safe.",
      ],
    },

    other: {
      title: "🚨 Emergency",
      steps: [
        "Move to a safe location.",
        "Identify what kind of help is needed.",
        "Contact the appropriate emergency service.",
        "Follow instructions from trained responders.",
      ],
    },
  };

  const handleEmergency = (type) => {
    setSelectedEmergency(emergencyGuides[type]);

    setTimeout(() => {
      document
        .getElementById("guide-result")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    setChat((previous) => [
      ...previous,
      {
        type: "user",
        text: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI response failed");
      }

      setChat((previous) => [
        ...previous,
        {
          type: "bot",
          text: data.reply,
        },
      ]);
    } catch (error) {
      console.error(error);

      setChat((previous) => [
        ...previous,
        {
          type: "bot",
          text:
            "⚠️ AI Rakshak se connection nahi ho pa raha. Please check that the backend server is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">

      {/* NAVBAR */}
      <header className="navbar">

        <div className="logo">
          🛡️ AI <span>RAKSHAK</span>
        </div>

        <nav>
          <a href="#home">Home</a>
          <a href="#emergency-center">Emergency</a>
          <a href="#ai">AI Rakshak</a>
          <a href="#nation">Nation</a>
        </nav>

      </header>

      <main>

        {/* HERO */}
        <section className="hero" id="home">

          <div className="hero-content">

            <p className="india-tag">
              🇮🇳 PROTECT • PREPARE • SERVE
            </p>

            <h1>
              Technology for Safety.
              <span>Courage for the Nation.</span>
            </h1>

            <p className="description">
              AI Rakshak is an AI-powered emergency companion
              designed to help citizens, families and our nation's
              protectors respond smarter during critical situations.
            </p>

            <div className="buttons">

              <button
                className="emergency-btn"
                onClick={() =>
                  document
                    .getElementById("emergency-center")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                🚨 Emergency Help
              </button>

              <button
                className="guide-btn"
                onClick={() =>
                  document
                    .getElementById("ai")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                🤖 Ask AI Rakshak
              </button>

            </div>

          </div>

          <div className="rakshak-symbol">

            <div className="chakra">
              ☸
            </div>

            <div className="shield-icon">
              🛡️
            </div>

          </div>

        </section>

        {/* TRICOLOR */}
        <div className="tricolor-strip">
          <div></div>
          <div></div>
          <div></div>
        </div>

        {/* EMERGENCY CENTER */}
        <section
          className="emergency-center"
          id="emergency-center"
        >

          <p className="section-tag">
            QUICK RESPONSE
          </p>

          <h2>
            Emergency Center
          </h2>

          <p>
            Select the situation you are facing and get
            appropriate safety guidance.
          </p>

          <div className="emergency-options">

            <button
              className="emergency-option"
              onClick={() => handleEmergency("medical")}
            >
              🚑
              <span>Medical</span>
            </button>

            <button
              className="emergency-option"
              onClick={() => handleEmergency("fire")}
            >
              🔥
              <span>Fire</span>
            </button>

            <button
              className="emergency-option"
              onClick={() => handleEmergency("disaster")}
            >
              🌊
              <span>Disaster</span>
            </button>

            <button
              className="emergency-option"
              onClick={() => handleEmergency("other")}
            >
              🚨
              <span>Other Emergency</span>
            </button>

          </div>

          {selectedEmergency && (
            <div
              className="guide-result"
              id="guide-result"
            >

              <h2>
                {selectedEmergency.title}
              </h2>

              <ul>

                {selectedEmergency.steps.map(
                  (step, index) => (
                    <li key={index}>
                      <strong>
                        {index + 1}.
                      </strong>{" "}
                      {step}
                    </li>
                  )
                )}

              </ul>

            </div>
          )}

        </section>

        {/* AI RAKSHAK */}
        <section
          className="ai-section"
          id="ai"
        >

          <p className="section-tag">
            AI-POWERED ASSISTANCE
          </p>

          <h2>
            Meet AI Rakshak 🤖
          </h2>

          <p className="ai-intro">
            Describe your situation and AI Rakshak
            will help you understand the safest
            next steps.
          </p>

          <div className="ai-chat">

            {/* HEADER */}
            <div className="chat-header">

              <div>
                🛡️ AI Rakshak Assistant
              </div>

              <span>
                ● Online
              </span>

            </div>

            {/* CHAT */}
            <div className="chat-body">

              <div className="bot-message">

                🇮🇳 Namaste! I'm AI Rakshak.

                <br />

                Tell me what emergency or safety
                situation you're facing.

              </div>

              {chat.map((item, index) => (

                <div
                  key={index}
                  className={
                    item.type === "user"
                      ? "user-message"
                      : "bot-message"
                  }
                >
                  {item.text}
                </div>

              ))}

              {loading && (
                <div className="bot-message">
                  🤖 AI Rakshak is thinking...
                </div>
              )}

            </div>

            {/* INPUT */}
            <div className="chat-input">

              <input
                type="text"
                placeholder="Describe your situation..."
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSend();
                  }
                }}
              />

              <button
                onClick={handleSend}
                disabled={loading}
              >
                {loading
                  ? "..."
                  : "Send ➤"}
              </button>

            </div>

          </div>

        </section>

        {/* NATION */}
        <section
          className="nation-section"
          id="nation"
        >

          <p className="section-tag">
            THE SPIRIT OF RAKSHAK
          </p>

          <h2>
            Everyone Can Be a Rakshak.
          </h2>

          <p>
            From our brave forces to every responsible
            citizen, protecting the nation begins with
            awareness and preparedness.
          </p>

          <div className="nation-cards">

            <div>
              <span>🪖</span>

              <h3>
                Our Forces
              </h3>

              <p>
                Honouring those who protect our nation.
              </p>
            </div>

            <div>
              <span>👨‍👩‍👧</span>

              <h3>
                Our Families
              </h3>

              <p>
                Prepared families build safer communities.
              </p>
            </div>

            <div>
              <span>🤝</span>

              <h3>
                Our Citizens
              </h3>

              <p>
                Every citizen can help, respond and protect.
              </p>
            </div>

          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer>

        <div className="footer-logo">
          🛡️ AI Rakshak 🇮🇳
        </div>

        <p>
          Technology for Safety • Courage for the Nation
        </p>

        <small>
          Built with the spirit of India.
        </small>

      </footer>

    </div>
  );
}

export default App;