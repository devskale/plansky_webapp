import { PromptConfig } from '../types';

export const prompts: PromptConfig[] = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Grundlegende Raumanalyse mit Maßangaben v0.1',
    prompt: `Analysiere diesen 2D Raumplan und extrahiere die folgenden Informationen:

1. Projektname, Architekt und Datum:
   - Falls KEIN Projektname sichtbar ist, generiere einen passenden Namen basierend auf den erkennbaren Planungselementen.
   - Beispiele für generierte Namen:
     * Bei Wohnräumen: "Wohnungsgrundriss"
     * Bei Büroräumen: "Bürofläche"
     * Bei medizinischen Räumen: "Praxis"
     * Bei gemischter Nutzung: "Mehrzweckgebäude"
     * Raumplan

2. Liste aller Räume mit:
   - Raumnummer (fortlaufend, beginnend bei 001)
   - Beschreibung/Verwendungszweck
   - Größe in Quadratmetern
   - Bodenbelag (falls angegeben)
   - Raumhöhe (falls angegeben)

3. Kategorisiere die Räume nach ihrer Funktion:
   - Wohnbereich (Wohnen, Schlafen, Küche)
   - Sanitär (Bad, WC)
   - Verkehr (Flur, Treppenhaus)
   - Technik (Heizung, Lager)
   - Büro (Arbeiten, Besprechung)
   - Medizinisch (Behandlung, Wartezimmer)
   - Aussenbereich (Terrasse, Balkon)

Formatiere die Antwort als strukturiertes JSON-Objekt mit folgender Struktur:
{
  "projectName": "string", // MUSS gefüllt sein, entweder mit sichtbarem oder generiertem Namen
  "architect": "string",   // Name des Architekten oder "Unbekannt"
  "date": "string",       // Datum im Format TT.MM.JJJJ
  "rooms": [
    {
      "number": "string",         // Fortlaufende Nummer (001, 002, ...)
      "description": "string",    // Raumbeschreibung
      "category": "string",       // Kategorie aus der obigen Liste
      "size": number,            // Größe in m²
      "floorMaterial": "string", // Bodenbelag oder "Nicht angegeben"
      "ceilingHeight": number    // Raumhöhe in m oder 0 wenn nicht angegeben
    }
  ]
}`
  },
  {
    id: 'detailed',
    name: 'Detailed',
    description: 'Comprehensive analysis including materials and connections',
    prompt: `Perform a detailed analysis of this architectural drawing and extract:
1. Project Information:
   - Project name and type
   - Architect details
   - Date and revision number
2. Room Analysis:
   - Room number and name
   - Purpose and category
   - Precise measurements (m²)
   - Floor materials and specifications
   - Ceiling height and type
   - Wall materials
3. Connections and Layout:
   - Door locations and types
   - Window positions
   - Adjacent rooms
4. Special Features:
   - Built-in furniture
   - Technical installations
   - Special requirements

Format as JSON:
{
  "projectName": "string",
  "architect": "string",
  "date": "string",
  "rooms": [
    {
      "number": "string",
      "description": "string",
      "category": "string",
      "size": number,
      "floorMaterial": "string",
      "ceilingHeight": number,
      "wallMaterial": "string",
      "doors": [{"type": "string", "connectsTo": "string"}],
      "windows": number,
      "specialFeatures": ["string"]
    }
  ]
}`
  },
  {
    id: 'simple',
    name: 'Simple',
    description: 'Basic room list with sizes',
    prompt: `Create a simple room list from this architectural drawing:
1. Extract:
   - Project name
   - Room numbers
   - Room descriptions
   - Room sizes

Format as JSON:
{
  "projectName": "string",
  "architect": "string",
  "date": "string",
  "rooms": [
    {
      "number": "string",
      "description": "string",
      "category": "string",
      "size": number,
      "floorMaterial": "string",
      "ceilingHeight": number
    }
  ]
}`
  }
];