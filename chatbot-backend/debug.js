// --- Gemini AI Initialisierung ---

// 1. Importiere das gesamte Paket
const genaiPackage = require("@google/generative-ai");
console.log("Importiertes @google/genai Paket vorhanden."); // Einfacher Log

// 2. VERSUCH: Greife direkt auf die Eigenschaft zu
const GoogleGenerativeAI_Class = genaiPackage.GoogleGenerativeAI;
console.log("Wert von GoogleGenerativeAI über direkten Zugriff:", GoogleGenerativeAI_Class);

// 3. Prüfe, ob es jetzt eine Funktion ist
if (typeof GoogleGenerativeAI_Class !== 'function') {
   console.error("FEHLER: GoogleGenerativeAI ist auch über direkten Zugriff keine Funktion!");
   // Optional: Gib nochmal das ganze Paket aus, um sicherzugehen
   console.log("Ganzes Paket nochmal:", genaiPackage);
   process.exit(1);
}

// Hole den API-Schlüssel (stelle sicher, dass das VORHER passiert ist)
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("FEHLER: GEMINI_API_KEY nicht gefunden!");
  process.exit(1);
}

// 4. Versuche, die Instanz mit der direkt zugegriffenen Klasse zu erstellen
console.log("Versuche, 'new GoogleGenerativeAI_Class(apiKey)' auszuführen...");
const genAI = new GoogleGenerativeAI_Class(apiKey);
console.log("GoogleGenerativeAI Instanz erfolgreich erstellt.");

// Wähle das Modell
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"}); // Oder anderes Modell
console.log("Modell erfolgreich geholt.");

// ... Rest des Codes ...