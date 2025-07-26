import express from "express";
const router = express.Router();

import MeetingBingoField from "../models/MeetingBingoField.js";
import InformaticsLectureTerm from "../models/InformaticsLecutreTerm.js";
import PresentationTerms from "../models/PresentationTerms.js";

/**
 * @route GET /meeting
 * @desc Holt 25 zufällige Meeting Bingo Phrasen
 * @access Public
 */
router.get("/meeting", async (req, res) => {
	try {
		const randomPhrases = await MeetingBingoField.aggregate([
			{ $sample: { size: 25 } },
		]);

		const phrases = randomPhrases.map((doc) => doc.phrase);

		res.json(phrases);
	} catch (error) {
		console.error("Fehler beim Abrufen der Meeting Bingo Phrasen:", error);
		res
			.status(500)
			.json({
				message: "Serverfehler beim Abrufen der Meeting Bingo Phrasen.",
			});
	}
});

/**
 * @route GET /lecture
 * @desc Holt 25 zufällige Informatik Vorlesungsbegriffe
 * @access Public
 */
router.get("/lecture", async (req, res) => {
	try {
		const randomTerms = await InformaticsLectureTerm.aggregate([
			{ $sample: { size: 25 } },
		]);

		const terms = randomTerms.map((doc) => doc.term);

		res.json(terms);
	} catch (error) {
		console.error(
			"Fehler beim Abrufen der Informatik Vorlesungsbegriffe:",
			error
		);
		res
			.status(500)
			.json({
				message: "Serverfehler beim Abrufen der Informatik Vorlesungsbegriffe.",
			});
	}
});

/**
 * @route GET /presentation
 * @desc Holt 25 zufällige Präsentationsbegriffe
 * @access Public
 */
router.get("/presentation", async (req, res) => {
	try {
		const randomTerms = await PresentationTerms.aggregate([
			{ $sample: { size: 25 } },
		]);

		const terms = randomTerms.map((doc) => doc.phrase);

		res.json(terms);
	} catch (error) {
		console.error("Fehler beim Abrufen der Präsentationsbegriffe:", error);
		res
			.status(500)
			.json({
				message: "Serverfehler beim Abrufen der Präsentationsbegriffe.",
			});
	}
});

export default router;
