const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const MeetingBingoField = require('./src/models/MeetingBingoField');
const InformaticsLectureTerm = require('./src/models/InformaticsLecutreTerm');
const bingoRoutes = require('./src/routes/bingoRoutes');

const app = express();

app.use(cors());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/', bingoRoutes);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/meetingBingoDB';

const meetingBingoStrings = [
    "Synergien schaffen", "Low-hanging fruits", "Deep Dive", "Auf dem Radar haben", "Think outside the box",
    "Win-Win-Situation", "Paradigmenwechsel", "Customer Journey", "Holistische Betrachtung", "Agile Methoden",
    "Bandbreite", "Value Proposition", "Quick Win", "Touchpoint", "Skalierbar",
    "Benchmark", "Bottom Line", "Thought Leadership", "Best Practice", "Blue Sky Thinking",
    "Core Competency", "Disruptiv", "Empowerment", "Evangelisieren", "Gamification",
    "Growth Hacking", "Key Performance Indicator (KPI)", "Learnings", "Monetarisieren", "Omnichannel",
    "Out-of-the-box-Lösung", "Performance Marketing", "Proof of Concept (PoC)", "Roadmap", "Storytelling",
    "Target Audience", "Thought Process", "Unique Selling Proposition (USP)", "User Experience (UX)", "Value Add",
    "Whitepaper", "Work-Life-Balance", "Zero-Sum Game", "Am Ende des Tages", "Die PS auf die Straße bringen",
    "Im Endeffekt", "Wir müssen das mal spiegeln", "Auf den Punkt bringen", "Das müssen wir challengen", "Wir müssen agil sein",
    "Das liegt auf dem Tisch", "Wir müssen in die Umsetzung gehen", "Das ist ein No-Brainer", "Wir müssen mal granularer werden", "Wir sind hier auf Augenhöhe",
    "Das ist eine Hypothese", "Das ist kein Rocket Science", "Wir müssen die Hausaufgaben machen", "Das ist ein Game Changer", "Wir müssen das neu denken",
    "Das ist outgesourced", "Da müssen wir ran", "Das müssen wir verproben", "Das ist ein Hebel", "Wir müssen das mal durchdeklinieren",
    "Das ist eine Krücke", "Wir sind auf einem guten Weg", "Das ist eine Baustelle", "Wir müssen das in den Griff bekommen", "Wir müssen das Thema aufgreifen",
    "Das ist ein Muss", "Das ist ein Nice-to-have", "Wir müssen das abstimmen", "Das ist kein Hexenwerk", "Das ist die Quintessenz",
    "Wir müssen das priorisieren", "Das ist ein Kompromiss", "Wir müssen das jetzt skalieren", "Das ist ein Quick Fix", "Wir müssen das nachschärfen",
    "Das ist ein Paradigmenwechsel", "Wir müssen das im Blick haben", "Das ist ein Gebot der Stunde", "Wir müssen das jetzt umsetzen", "Das ist ein Alleinstellungsmerkmal",
    "Wir müssen das durchziehen", "Das ist ein Mehrwert", "Wir müssen das aufsetzen", "Das ist eine Win-Win-Situation", "Wir müssen das jetzt angehen",
    "Das ist ein Meilenstein", "Wir müssen das sicherstellen", "Das ist ein Schritt in die richtige Richtung", "Wir müssen das optimieren", "Das ist ein kritischer Erfolgsfaktor",
    "Wir müssen das berücksichtigen", "Das ist eine Vision", "Wir müssen das analysieren", "Das ist ein Statement", "Wir müssen das kommunizieren"
];

const informaticsLectureStrings = [
    "Algorithmus", "Datenstruktur", "Künstliche Intelligenz", "Maschinelles Lernen", "Objektorientierte Programmierung",
    "Datenbankmanagementsysteme", "Netzwerkprotokolle", "Compilerbau", "Betriebssysteme", "Software-Engineering",
    "Big Data", "Cloud Computing", "Cybersicherheit", "Datenbankmodellierung", "Deep Learning",
    "Funktionale Programmierung", "Graphentheorie", "Hamming-Distanz", "Hash-Funktion", "Informationstheorie",
    "Kryptographie", "Lineare Algebra", "Logikprogrammierung", "Monte-Carlo-Simulation", "Neuronale Netze",
    "Open Source", "Parallelverarbeitung", "Quantencomputing", "Rekursion", "Relationsalgebra",
    "Suchmaschinenoptimierung", "Turing-Maschine", "Versionskontrolle", "Virtuelle Realität", "Webentwicklung",
    "XOR-Gatter", "YACC (Yet Another Compiler Compiler)", "Zustandsmaschine", "Abstrakte Klasse", "Asymptotische Komplexität",
    "Backtracking", "Baumstruktur", "Binärbaum", "Cache-Speicher", "Client-Server-Architektur",
    "Datenbanknormalisierung", "Deterministischer Automat", "Distributed Systems", "Entwurfsmuster", "Fehlerkorrekturcodes",
    "Finite-Elemente-Methode", "Framework", "Generische Programmierung", "Garbage Collection", "Hardware-Abstraktionsschicht",
    "Imperative Programmierung", "Indizierung", "Integrierte Entwicklungsumgebung (IDE)", "Join-Operation", "Komplexitätstheorie",
    "Kontextfreies Grammatik", "Lazy Evaluation", "Lebenszyklus eines Objekts", "Middleware", "Multithreading",
    "Non-relational Database (NoSQL)", "NP-Vollständigkeit", "Open Systems Interconnection (OSI) Modell", "Parallelisierung", "Petri-Netz",
    "Polymorphismus", "Prozesssynchronisation", "Prototyping", "Queue (Warteschlange)", "Random Access Memory (RAM)",
    "Reguläre Ausdrücke", "Robotics", "Semantik", "Sequenzdiagramm", "Simulationsmodell",
    "Skalierbarkeit", "Softwaretest", "Stack (Stapel)", "Synchrone und asynchrone Kommunikation", "TCP/IP",
    "Transaktion", "Unified Modeling Language (UML)", "Unit Testing", "Vererbung", "Verteilte Datenbanken",
    "Web Service", "XML (Extensible Markup Language)", "Zufallszahlengenerator", "Zugriffsmodifikator", "Abfragenoptimierung",
    "API (Application Programming Interface)", "B-Baum", "Blockchain", "Bytecode", "Datenflussdiagramm"
];


async function initializeDatabase() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Verbindung zu MongoDB hergestellt.');

        const meetingCount = await MeetingBingoField.countDocuments();
        if (meetingCount === 0) {
            console.log('MeetingBingoFields Collection ist leer. Befülle mit Daten...');
            const docs = meetingBingoStrings.map(s => ({ phrase: s }));
            await MeetingBingoField.insertMany(docs);
            console.log(`${docs.length} Dokumente in MeetingBingoFields eingefügt.`);
        } else {
            console.log('MeetingBingoFields Collection enthält bereits Daten. Überspringe Befüllung.');
        }

        const informaticsCount = await InformaticsLectureTerm.countDocuments();
        if (informaticsCount === 0) {
            console.log('InformaticsLectureTerms Collection ist leer. Befülle mit Daten...');
            const docs = informaticsLectureStrings.map(s => ({ term: s }));
            await InformaticsLectureTerm.insertMany(docs);
            console.log(`${docs.length} Dokumente in InformaticsLectureTerms eingefügt.`);
        } else {
            console.log('InformaticsLectureTerms Collection enthält bereits Daten. Überspringe Befüllung.');
        }

    } catch (error) {
        console.error('Fehler bei der Datenbankinitialisierung:', error);
        process.exit(1);
    }
}

app.get('/', (req, res) => {
    res.send('Willkommen zur Bullshit Bingo App!');
});

if (process.env.NODE_ENV !== 'test') {
    initializeDatabase().then(() => {
        app.listen(PORT, () => {
            console.log(`Server läuft auf Port ${PORT}`);
        });
    });
}

module.exports = app;
