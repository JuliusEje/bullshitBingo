const User = require("../models/User");

const protect = async (req, res, next) => {
	if (req.session && req.session.userId) {
		try {
			const user = await User.findById(req.session.userId).select("-password"); 
			if (user) {
				req.user = user; 
				next();
			} else {
				res
					.status(401)
					.json({ message: "Nicht autorisiert, Benutzer nicht gefunden" });
			}
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Serverfehler beim Authentifizieren" });
		}
	} else {
		res.status(401).json({ message: "Nicht autorisiert, keine Session" });
	}
};

module.exports = protect;
