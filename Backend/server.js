import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import connectDB from "./src/config/db.js";
import dotenv from "dotenv";

dotenv.config();

import MeetingBingoField from "./src/models/MeetingBingoField.js";
import InformaticsLectureTerm from "./src/models/InformaticsLecutreTerm.js";
import PresentationTerms from "./src/models/PresentationTerms.js";

import bingoRoutes from "./src/routes/bingoRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import gameRoutes from "./src/routes/gameRoutes.js";

const app = express();

connectDB();

const allowedOrigins = [
	"http://localhost:7456",
	"http://julius.flxkln.de:7456",
	process.env.FRONTEND_ORIGIN,
];

app.use(
	cors({
		origin: function (origin, callback) {
			if (!origin || allowedOrigins.indexOf(origin) !== -1) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		credentials: true,
	})
);

const PORT = process.env.PORT || 3000;

const MONGO_URI =
	process.env.MONGO_URI || "mongodb://localhost:27017/meetingBingoDB";

const meetingBingoStrings = [
	"Das müssen wir nochmal challengen",
	"Ich geb das mal in die Runde",
	"Lass uns da drüber fliegen",
	"Das ist jetzt nicht zielführend",
	"Wir müssen das groß denken",
	"Da fehlt mir noch der Buy-in",
	"Das ist ein klassisches Bottleneck",
	"Da sehe ich Synergien",
	"Das ist ein Low-Hanging Fruit",
	"Wir bleiben da mal dran",
	"Lass uns das parken",
	"Das ist ein Quick Win",
	"Wir müssen das priorisieren",
	"Das ist ein Top-Down-Ansatz",
	"Ich nehm das mal mit",
	"Das ist noch nicht spruchreif",
	"Ich sehe da Red Flags",
	"Das geben wir ins Backlog",
	"Ich hab da ein Bauchgefühl",
	"Das ist noch sehr holistisch",
	"Das war nicht abgestimmt",
	"Das schieben wir in Q3",
	"Das liegt nicht in meinem Scope",
	"Da brauchen wir mehr Alignment",
	"Wir müssen das sauber spielen",
	"Das ist ein Kommunikationsproblem",
	"Das ist eine strategische Frage",
	"Das müssen wir intern klären",
	"Ich seh da keinen Mehrwert",
	"Das ist ein guter Punkt",
	"Wir müssen da agil bleiben",
	"Das ist ein guter Case",
	"Das sollten wir nochmal spiegeln",
	"Wir müssen das anders denken",
	"Da sind wir noch nicht ready",
	"Das ist noch zu unkonkret",
	"Das ist ein Use Case",
	"Ich seh da Ressourcenprobleme",
	"Das muss ins große Ganze",
	"Wir müssen das skalieren",
	"Das ist nicht unsere Ownership",
	"Das braucht ein sauberes Setup",
	"Da fehlt noch das Mindset",
	"Das müssen wir ausrollen",
	"Das hat keine Prio aktuell",
	"Das ist kein Muss-Thema",
	"Wir müssen das onboarden",
	"Ich seh da Reibungsverluste",
	"Das geht so nicht live",
	"Wir brauchen ein klares Commitment",
	"Ich glaub, das ist Konsens",
	"Das ist noch nicht final",
	"Das nehme ich als Feedback",
	"Ich leite das mal weiter",
	"Das machen wir as soon as possible",
	"Das ist noch im Review",
	"Das ist ein Draft, kein Ergebnis",
	"Wir brauchen mehr Visibilität",
	"Wir brauchen ein Status-Update",
	"Das müssen wir eng begleiten",
	"Ich glaub, das reicht für heute",
	"Das war jetzt viel Input",
	"Wir sind da zu silo-mäßig",
	"Da fehlt der Business Impact",
	"Ich sehe da noch Potenzial",
	"Das ist ein langfristiges Ziel",
	"Das ist jetzt sehr operativ",
	"Da sind wir zu detailliert",
	"Wir denken das zu klein",
	"Das eskaliere ich mal kurz",
	"Ich klär das auf C-Level",
	"Wir brauchen da Top-Management-Support",
	"Das ist Teil des Big Pictures",
	"Das ist ein Leuchtturmprojekt",
	"Da hängen wir gerade hinterher",
	"Wir reden vorbei",
	"Das ist noch nicht belastbar",
	"Wir müssen das sauber cutten",
	"Ich geb dir da recht",
	"Das ist ein reines Erwartungsmanagement",
	"Das ist kein Rocket Science",
	"Das ist eine klassische Win-Win-Situation",
	"Das klingt jetzt härter als gemeint",
	"Ich seh da keinen Widerspruch",
	"Wir müssen auf die Timeline achten",
	"Das hängt alles zusammen",
	"Das ist nur ein Teilerfolg",
	"Wir müssen das sauber dokumentieren",
	"Da brauchen wir ein klares Zielbild",
	"Wir setzen da auf Vertrauen",
	"Ich seh da einen Zielkonflikt",
	"Wir sind da noch in der Findungsphase",
	"Wir drehen uns im Kreis",
	"Das muss in die Breite",
	"Das müssen wir in den Kontext setzen",
	"Das braucht eine Roadmap",
	"Das ist jetzt sehr politisch",
	"Das darf nicht zur Dauerlösung werden",
	"Da sind wir uns nicht ganz einig",
	"Das sind nur weiche Faktoren",
	"Ich seh da keinen Showstopper",
	"Wir müssen da besser kommunizieren",
	"Das ist eher ein Kulturthema",
	"Das ist ein strategischer Hebel",
	"Das ist nicht zielführend genug",
	"Wir müssen es erst evaluieren",
	"Das gehört nicht auf diese Ebene",
	"Wir dürfen das große Ganze nicht verlieren",
	"Das ist eher eine Learning Journey",
	"Wir müssen das mitnehmen",
	"Da ist noch Luft nach oben",
	"Das ist jetzt sehr kurzfristig",
	"Wir arbeiten da bereits dran",
	"Das wird aktuell neu gedacht",
	"Da ist noch kein grünes Licht",
	"Das ist aktuell nicht vermittelbar",
	"Das ist ein Work in Progress",
	"Wir sind da auf einem guten Weg",
	"Das muss noch durch die Gremien",
	"Das ist politisch schwierig",
	"Wir müssen das konsolidieren",
	"Das hat auf dieser Ebene nichts verloren",
	"Wir brauchen einen Schulterschluss",
	"Das ist noch nicht kommuniziert",
	"Wir arbeiten in Iterationen",
	"Das ist eine Frage der Perspektive",
	"Wir müssen das nochmal vertiefen",
	"Das kann so nicht stehenbleiben",
	"Wir sollten das querdenken",
	"Das ist eine gewachsene Struktur",
	"Das wird zu stark verkürzt",
	"Das ist noch in der Mache",
	"Wir müssen das breiter aufsetzen",
	"Das ist ein sensibles Thema",
	"Das geht aktuell nicht durch",
	"Wir brauchen ein einheitliches Verständnis",
	"Das ist eine Frage der Ressourcen",
	"Wir müssen uns da committen",
	"Das steht aktuell nicht zur Debatte",
	"Da müssen wir drüber iterieren",
	"Das ist eher strategisch zu sehen",
	"Wir müssen das intern abbilden",
	"Das ist nicht in Stein gemeißelt",
	"Wir brauchen mehr Datenbasis",
	"Wir müssen das objektivieren",
	"Das hat noch keinen festen Rahmen",
	"Wir setzen auf Eigenverantwortung",
	"Das ist aus heutiger Sicht sinnvoll",
	"Das ist eher ein Soft-Faktor",
	"Das Thema hat viele Facetten",
	"Wir sind da noch nicht final",
	"Das ist auf der Agenda",
];

const informaticsLectureStrings = [
	"Das ist nicht klausurrelevant",
	"Ich schweife kurz mal ab",
	"Wer das versteht, bekommt Punkte",
	"Ich habe da was vorbereitet",
	"Das ist ein gutes Beispiel",
	"Nur zur Veranschaulichung, natürlich",
	"Das kommt garantiert nicht dran",
	"Schreiben Sie das bitte mit",
	"Das steht nicht auf der Folie",
	"Sie dürfen mir da vertrauen",
	"Das ist ein bisschen tricky",
	"Das müssen Sie nicht können",
	"Ich zeig das kurz in Paint",
	"Sie sehen es gleich selbst",
	"Das ist jetzt sehr vereinfacht",
	"Das kommt in der Prüfung",
	"Ich bin da überfragt gerade",
	"Das sehen Sie in Moodle",
	"Das ist reines Grundwissen",
	"Das kennen Sie ja schon",
	"Das klingt jetzt schlimmer als es ist",
	"Das ist nicht meine Folie",
	"Bitte nicht auswendig lernen",
	"Das klären wir nächstes Mal",
	"Das hab ich woanders geklaut",
	"Sie dürfen das gerne googeln",
	"Das war jetzt zu schnell?",
	"Das ist reine Interpretation",
	"Das bitte nur mit Sternchen",
	"Ich hoffe, Sie sehen was",
	"Ich hör Sie nicht mehr",
	"Jetzt wird’s ein bisschen mathematisch",
	"Das sagt auch Wikipedia so",
	"Das ist kein Hexenwerk",
	"Jetzt bitte nicht abschalten",
	"Das ist jetzt sehr technisch",
	"Ich mach’s ganz kurz",
	"Das ist kein Witz",
	"Das ist jetzt kein Spaß",
	"Ich erklär das nochmal anders",
	"Das müssen Sie nicht verstehen",
	"Ich glaub, das reicht jetzt",
	"Ich mach das aus dem Kopf",
	"Das brauchen Sie nie wieder",
	"Das prüfe ich so nicht",
	"Ich glaube, das passt jetzt",
	"Das kann man so sehen",
	"Sie sehen, worauf ich hinauswill",
	"Jetzt mal ganz praktisch gedacht",
	"Da gehen die Meinungen auseinander",
	"Ich seh da noch Fragezeichen",
	"Das steht auch im Skript",
	"Bitte jetzt nicht abschweifen",
	"Das ist jetzt sehr wichtig",
	"Ich frag das gerne mal ab",
	"Das ist gefährliches Halbwissen",
	"Sie dürfen gerne widersprechen",
	"Das ist wirklich nicht schwer",
	"Das war verständlich",
	"Ich erklär das gleich nochmal",
	"Wir sind ein bisschen hinterher",
	"Das sehen wir gleich nochmal",
	"Das mache ich nur einmal",
	"Jetzt nicht erschrecken bitte",
	"Sie dürfen auch schmunzeln",
	"Das hab ich nicht vorbereitet",
	"Ich improvisier das mal kurz",
	"Das ist rein theoretisch gemeint",
	"Jetzt wird’s ein bisschen trocken",
	"Ich hol mal etwas weiter aus",
	"Jetzt bitte nicht wegpennen",
	"Ich mach’s gleich wieder spannend",
	"Das sehen Sie im nächsten Modul",
	"Das klingt schlimmer als es ist",
	"Das besprechen wir gleich noch",
	"Das merken Sie sich am besten",
	"Das haben wir ja besprochen",
	"Ich brauch mal eben einen Stift",
	"Sie sehen das",
	"Jetzt mal ein realistisches Beispiel",
	"Das war jetzt ironisch gemeint",
	"Wir sind gleich durch damit",
	"Das schreibe ich mal an",
	"Das machen wir nächste Woche",
	"Ich bin da ganz ehrlich",
	"Das kommt sehr oft dran",
	"Ich hab das selbst nicht verstanden",
	"Sie dürfen das anders sehen",
	"Sie können das auch googeln",
	"Das führt zu weit jetzt",
	"Das müssen Sie selbst rausfinden",
	"Jetzt wird’s ein bisschen nerdig",
	"Das ist jetzt keine Klausurfrage",
	"Ich dachte, das wüssten Sie",
	"Wir gehen da gleich nochmal drüber",
	"Ich bin kein Mathematiker, aber…",
	"Das hab ich selbst erfunden",
	"Das Beispiel ist nicht ganz sauber",
	"Ich nehm mal die Abkürzung",
	"Das prüfen wir nicht direkt",
	"Ich erklär’s nochmal mit Farben",
	"Das ist ein bisschen altmodisch",
	"Das irritiert Sie nicht",
	"Da steht’s schwarz auf weiß",
	"Jetzt nicht den Faden verlieren",
	"Das sollte selbsterklärend sein",
	"Das ist kein Zufall",
	"Wir kürzen das jetzt mal ab",
	"Ich hasse diese Folie selbst",
	"Ich mach das immer so",
	"Bitte nicht zu wörtlich nehmen",
	"Das ist so nicht gemeint",
	"Das war jetzt kein Scherz",
	"Das brauchen Sie im Leben nie",
	"Ich les das mal kurz vor",
	"Ich mach das gern nochmal",
	"Das hat mich selbst verwirrt",
	"Ich prüf das nie so streng",
	"Ich kürz das etwas ab",
	"Ich zeig das nochmal anders",
	"Das war ein gutes Stichwort",
	"Ich komm da gleich drauf",
	"Da kommen wir gleich hin",
	"Ich seh da noch Potenzial",
	"Das können Sie zuhause vertiefen",
	"Das ist ein beliebter Fehler",
	"Das ist fast schon philosophisch",
	"Das merkt sich keiner freiwillig",
	"Das sagen nur Theoretiker so",
	"Ich zeig das mit Händen",
	"Ich spring mal kurz zurück",
	"Das kommt in jeder Prüfung",
	"Da haben viele Probleme mit",
	"Das geht oft schief",
	"Das ist nicht auswendig lernbar",
	"Das gab’s schon bei Aristoteles",
	"Ich darf das so sagen",
	"Ich nehm das jetzt einfach",
	"Ich les das schnell durch",
	"Ich tu jetzt mal so",
	"Ich zitiere mich mal selbst",
	"Das sehen Sie im Praktikum",
	"Jetzt wird’s ein bisschen historisch",
	"Ich darf das vereinfachen",
	"Ich fang mal vorne an",
	"Das muss man nicht wissen",
	"Das passiert den Besten",
	"Das sagen sogar die Informatiker",
	"Ich hol kurz Luft – dann weiter",
];

const PresentationTermsStrings = [
	"MERN",
	"Docker",
	"Nginx",
	"Github",
	"Commit-history",
	"dev prod parity",
	"https",
	"flask",
	"python",
	"bcrypt",
	"gehasht",
	"Punkte",
	"Multiplayer",
	"Rest API",
	"Websockets",
	"Ärger dich Reich",
	"Cookie Clicker",
	"Spielfeld",
	"Datenbanken",
	"Production",
	"Prototyp",
	"Lobby",
	"nicht implementierbar",
	"Navbar",
	"Bugs",
	"unsetzbar",
	"User System",
	"Online Modus",
	"Feld",
	"Proof of Concept",
	"MVP",
	"Make it fast",
];

async function initializeDatabase() {
	try {
		await mongoose.connect(MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Verbindung zu MongoDB hergestellt.");

		const meetingCount = await MeetingBingoField.countDocuments();
		if (meetingCount === 0) {
			console.log(
				"MeetingBingoFields Collection ist leer. Befülle mit Daten..."
			);
			const docs = meetingBingoStrings.map((s) => ({ phrase: s }));
			await MeetingBingoField.insertMany(docs);
			console.log(`${docs.length} Dokumente in MeetingBingoFields eingefügt.`);
		} else {
			console.log(
				"MeetingBingoFields Collection enthält bereits Daten. Überspringe Befüllung."
			);
		}

		const informaticsCount = await InformaticsLectureTerm.countDocuments();
		if (informaticsCount === 0) {
			console.log(
				"InformaticsLectureTerms Collection ist leer. Befülle mit Daten..."
			);
			const docs = informaticsLectureStrings.map((s) => ({ term: s }));
			await InformaticsLectureTerm.insertMany(docs);
			console.log(
				`${docs.length} Dokumente in InformaticsLectureTerms eingefügt.`
			);
		} else {
			console.log(
				"InformaticsLectureTerms Collection enthält bereits Daten. Überspringe Befüllung."
			);
		}
		const presentationCount = await PresentationTerms.countDocuments();
		if (presentationCount === 0) {
			console.log(
				"PresentationTerms Collection ist leer. Befülle mit Daten..."
			);
			const docs = PresentationTermsStrings.map((s) => ({ phrase: s }));
			await PresentationTerms.insertMany(docs);
			console.log(`${docs.length} Dokumente in PresentationTerms eingefügt.`);
		} else {
			console.log(
				"PresentationTerms Collection enthält bereits Daten. Überspringe Befüllung."
			);
		}
	} catch (error) {
		console.error("Fehler bei der Datenbankinitialisierung:", error);
		process.exit(1);
	}
}

app.use(express.json());

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({
			mongoUrl: process.env.MONGO_URI,
			collectionName: "sessions",
			ttl: 1000 * 60 * 60 * 24 * 7,
			autoRemove: "interval",
			autoRemoveInterval: 10,
		}),
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 7,
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
		},
	})
);

app.use("/api/auth", authRoutes);
app.use("/api/bingo", bingoRoutes);
app.use("/api/game", gameRoutes);

app.get("/", (req, res) => {
	res.send("Willkommen zur Bullshit Bingo App!");
});

initializeDatabase().then(() => {
	app.listen(PORT, () => {
		console.log(`Server läuft auf Port ${PORT}`);
	});
});
