import express from "express";
const router = express.Router();
import User from "../models/User.js";
import protect from "../middleware/authMiddleWare.js";

// @desc    Registriere einen neuen Benutzer
// @route   POST /api/auth/register
// @access  Public
router.post("/register", async (req, res) => {
	const { username, password } = req.body;

	try {
		let user = await User.findOne({ username });
		if (user) {
			return res
				.status(400)
				.json({ message: "Benutzername existiert bereits" });
		}

		user = await User.create({
			username,
			password,
		});

		req.session.userId = user._id;
		res.status(201).json({
			message: "Benutzer erfolgreich registriert",
			username: user.username,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Serverfehler" });
	}
});

// @desc    Melde einen Benutzer an
// @route   POST /api/auth/login
// @access  Public
router.post("/login", async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res
				.status(400)
				.json({ message: "Ungültige Anmeldeinformationen" });
		}

		const isMatch = await user.matchPassword(password);
		if (!isMatch) {
			return res
				.status(400)
				.json({ message: "Ungültige Anmeldeinformationen" });
		}

		req.session.userId = user._id;
		res.json({ message: "Erfolgreich angemeldet", username: user.username });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Serverfehler" });
	}
});

// @desc    Melde einen Benutzer ab
// @route   POST /api/auth/logout
// @access  Private (eigentlich muss man eingeloggt sein, um sich abzumelden)
router.post("/logout", protect, (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			return res.status(500).json({ message: "Fehler beim Abmelden" });
		}
		res.clearCookie("connect.sid");
		res.json({ message: "Erfolgreich abgemeldet" });
	});
});

// @desc    Get user info (check if logged in)
// @route   GET /api/auth/me
// @access  Private
router.get("/me", protect, async (req, res) => {
	try {
		res.json({
			_id: req.user._id,
			username: req.user.username,
			points: req.user.points ?? 0,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Serverfehler" });
	}
});

export default router;
