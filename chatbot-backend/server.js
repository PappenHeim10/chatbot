// Importiere die benötigten Bibliotheken
const express = require('express'); // Web-Framework
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Gemini SDK
const dotenv = require('dotenv'); // Für Umgebungsvariablen
const cors = require('cors'); // Für Cross-Origin Requests

// Lade Umgebungsvariablen aus der .env Datei
dotenv.config();

// Initialisiere Express
const app = express();
// Definiere den Port, auf dem der Server laufen soll
// Nutze den Port aus der Umgebungsvariable oder standardmäßig 3001
const port = process.env.PORT || 3001;

// --- Middleware ---
// Erlaube Anfragen von anderen Origins (z.B. deiner React App auf localhost:3000)
// Für Produktion solltest du die erlaubten Origins spezifischer konfigurieren!
app.use(cors());
// Erlaube dem Server, JSON-Daten im Request Body zu lesen
app.use(express.json());

// --- Gemini AI Initialisierung ---
// Hole den API-Schlüssel aus den Umgebungsvariablen
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("FEHLER: GEMINI_API_KEY nicht in .env Datei gefunden!");
  process.exit(1); // Beende den Server, wenn der Schlüssel fehlt
}
// Initialisiere den Gemini AI Client
const genAI = new GoogleGenerativeAI(apiKey);
// Wähle das Modell (passe es bei Bedarf an)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"}); // Oder "gemini-pro", etc.

// --- API Endpunkt (Das ist deine REST-Schnittstelle) ---
// Definiere eine Route, die auf POST-Anfragen an /api/chat hört
app.post('/api/chat', async (req, res) => {
  try {
    // Hole die Nachricht des Benutzers aus dem Request Body
    // Deine React App muss die Nachricht im Body als { "message": "Benutzertext" } senden
    const userMessage = req.body.message;

    // Prüfe, ob eine Nachricht gesendet wurde
    if (!userMessage) {
      return res.status(400).json({ error: 'Keine Nachricht im Request Body gefunden.' });
    }

    console.log(`Nachricht vom Frontend erhalten: "${userMessage}"`);

    // Sende die Nachricht an die Gemini API über das SDK
    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const botResponseText = response.text();

    console.log(`Antwort von Gemini erhalten: "${botResponseText}"`);

    // Sende die Antwort des Bots als JSON zurück an das Frontend
    res.json({ reply: botResponseText });

  } catch (error) {
    // Fehlerbehandlung, falls etwas beim API-Aufruf schiefgeht
    console.error("Fehler bei der Kommunikation mit der Gemini API:", error);
    res.status(500).json({ error: 'Fehler bei der Verarbeitung der Anfrage durch die AI.' });
  }
});

// --- Server Start ---
// Starte den Server und lasse ihn auf dem definierten Port lauschen
app.listen(port, () => {
  console.log(`Backend-Server läuft auf http://localhost:${port}`);
});