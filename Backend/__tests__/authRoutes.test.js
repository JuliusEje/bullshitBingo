const request = require("supertest");
const express = require("express");

jest.mock("../src/models/User");
jest.mock("../src/middleware/authMiddleWare", () =>
	jest.fn((req, res, next) => {
		req.user = { _id: "user123", username: "testuser", points: 42 };
		next();
	})
);

const User = require("../src/models/User").default;
const authRoutes = require("../src/routes/authRoutes").default; // ggf. Pfad anpassen

let app;
let currentSession;
let clearCookieMock;

beforeAll(() => {
	app = express();
	app.use(express.json());

	// globale Middleware für Session & clearCookie
	app.use((req, res, next) => {
		req.session = {
			destroy: jest.fn((cb) => cb(null)), // destroy immer da
		};
		currentSession = req.session;
		res.clearCookie = clearCookieMock = jest.fn();
		next();
	});

	app.use("/api/auth", authRoutes);
});

afterEach(() => {
	jest.clearAllMocks();
});

test("POST /api/auth/register creates new user", async () => {
	User.findOne.mockResolvedValue(null);
	User.create.mockResolvedValue({ _id: "user123", username: "alice" });

	const res = await request(app)
		.post("/api/auth/register")
		.send({ username: "alice", password: "pass" });

	expect(res.status).toBe(201);
	expect(res.body.message).toBe("Benutzer erfolgreich registriert");
	expect(res.body.username).toBe("alice");
	expect(currentSession.userId).toBe("user123");
});

test("POST /api/auth/register fails if user exists", async () => {
	User.findOne.mockResolvedValue({ username: "alice" });

	const res = await request(app)
		.post("/api/auth/register")
		.send({ username: "alice", password: "pass" });

	expect(res.status).toBe(400);
	expect(res.body.message).toBe("Benutzername existiert bereits");
});

test("POST /api/auth/login logs user in", async () => {
	const matchPassword = jest.fn().mockResolvedValue(true);
	User.findOne.mockResolvedValue({
		_id: "user123",
		username: "alice",
		matchPassword,
	});

	const res = await request(app)
		.post("/api/auth/login")
		.send({ username: "alice", password: "pass" });

	expect(res.status).toBe(200);
	expect(res.body.message).toBe("Erfolgreich angemeldet");
	expect(currentSession.userId).toBe("user123");
});

test("POST /api/auth/login fails on wrong password", async () => {
	const matchPassword = jest.fn().mockResolvedValue(false);
	User.findOne.mockResolvedValue({
		_id: "user123",
		username: "alice",
		matchPassword,
	});

	const res = await request(app)
		.post("/api/auth/login")
		.send({ username: "alice", password: "wrong" });

	expect(res.status).toBe(400);
	expect(res.body.message).toBe("Ungültige Anmeldeinformationen");
});

test("GET /api/auth/me returns user info", async () => {
	const res = await request(app).get("/api/auth/me");
	expect(res.status).toBe(200);
	expect(res.body.username).toBe("testuser");
	expect(res.body.points).toBe(42);
});

test("POST /api/auth/logout clears session", async () => {
	const res = await request(app).post("/api/auth/logout");

	expect(res.status).toBe(200);
	expect(res.body.message).toBe("Erfolgreich abgemeldet");
	expect(currentSession.destroy).toHaveBeenCalled();
	expect(clearCookieMock).toHaveBeenCalledWith("connect.sid");
});
