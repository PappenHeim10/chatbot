import React, { useState } from 'react';
import './App.css';

function App() {

  // Zustand für die Chat-Nachrichten (ein Array von Objekten)
  // Jedes Objekt repräsentiert eine Nachricht mit Sender ('user' oder 'bot') und Text
  const [messages, setMessages] = useState([]);

  
  // Zustand für den aktuellen Text im Eingabefeld
  const [input, setInput] = useState('');

  // (Optional) Zustand, um anzuzeigen, ob wir auf eine Antwort warten
  const [isLoading, setIsLoading] = useState(false);

  // Funktion, die aufgerufen wird, wenn der Nutzer eine Nachricht sendet
  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    const messageToSend = input; // Speichere die Eingabe vor dem Leeren
    setInput('');
    setIsLoading(true);

    try {
      // --- API-AUFRUF AN DEIN NODE.JS BACKEND ---
      const response = await fetch('http://localhost:3001/api/chat', { // URL deines Backends
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Sende die Nachricht im Body als JSON-Objekt
        body: JSON.stringify({ message: messageToSend })
      });

      // Prüfe, ob die Anfrage erfolgreich war (Status-Code 2xx)
      if (!response.ok) {
          // Versuche, die Fehlermeldung vom Backend zu lesen
          const errorData = await response.json().catch(() => ({ error: 'Unbekannter Fehler vom Backend' }));
          throw new Error(errorData.error || `HTTP Fehler: ${response.status}`);
      }

      // Lese die JSON-Antwort vom Backend
      const data = await response.json();
      const botMessage = { sender: 'bot', text: data.reply }; // 'reply' muss mit dem übereinstimmen, was dein Backend sendet

      // Füge die Bot-Nachricht zum Chatverlauf hinzu
      setMessages(prevMessages => [...prevMessages, botMessage]);
      // --- ENDE API-AUFRUF ---

    } catch (error) {
      console.error("Fehler beim Abrufen der Bot-Antwort:", error);
      const errorMessage = { sender: 'bot', text: `Sorry, ein Fehler ist aufgetreten: ${error.message}` };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Platzhalter für die Backend-Kommunikation ---
  // Diese Funktion simuliert den Aufruf an dein Backend und die Gemini API
  // In einer echten Anwendung würde diese Logik im Backend leben.
  const getBotResponse = async (userInput) => {
    console.log("Sende an (simuliertes) Backend:", userInput);
    // Simuliere eine Netzwerkverzögerung
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Gib eine einfache, simulierte Antwort zurück
    return `Ich bin eine simulierte Antwort auf "${userInput}"`;
    // Später: Hier würde dein Backend die echte Gemini API aufrufen
  };


  // Funktion, die aufgerufen wird, wenn sich der Text im Eingabefeld ändert
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Mein Gemini Chatbot</h1>
      </header>
      <div className="chat-window">
        {/* Zeigt alle Nachrichten an */}
        <div className="message-list">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {/* Zeigt den Text der Nachricht an */}
              <p>{msg.text}</p>
            </div>
          ))}
          {/* Zeigt eine Ladeanzeige, während der Bot antwortet */}
          {isLoading && <div className="message bot typing-indicator">Bot schreibt...</div>}
        </div>
        {/* Formular zum Senden von Nachrichten */}
        <form onSubmit={handleSendMessage} className="message-input-form">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Schreib eine Nachricht..."
            // Deaktiviert das Eingabefeld während des Ladens
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {/* Ändert den Button-Text während des Ladens */}
            {isLoading ? 'Senden...' : 'Senden'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;