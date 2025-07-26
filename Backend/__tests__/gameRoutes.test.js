const request = require("supertest");
const express = require("express");

const gameRoutes = require("../src/routes/gameRoutes").default; // ggf. Pfad anpassen

jest.mock("../src/models/Game");
jest.mock("../src/models/User");
jest.mock("../src/middleware/authMiddleWare", () =>
	jest.fn((req, res, next) => {
		req.user = { _id: "user123", username: "testuser" };
		next();
	})
);

const Game = require("../src/models/Game").default;
const User = require("../src/models/User").default;

let app;

beforeAll(() => {
	app = express();
	app.use(express.json());
	app.use("/api/games", gameRoutes);
});

afterEach(() => {
	jest.clearAllMocks();
});

test("POST /api/games/create should create a game", async () => {
	Game.create.mockResolvedValue({ _id: "game123" });

	const response = await request(app)
		.post("/api/games/create")
		.send({ mode: "meeting" });

	expect(response.status).toBe(200);
	expect(response.body).toEqual({ gameId: "game123" });
});

test("POST /api/games/join/:gameId should join a game", async () => {
	const saveMock = jest.fn().mockResolvedValue();
	Game.findById.mockResolvedValue({
		players: [],
		save: saveMock,
	});

	const response = await request(app).post("/api/games/join/game123");

	expect(response.status).toBe(200);
	expect(response.body).toEqual({ success: true });
	expect(saveMock).toHaveBeenCalled();
});

test("GET /api/games/list should list games", async () => {
	Game.find.mockReturnValue({
		populate: jest.fn().mockReturnThis(),
		sort: jest
			.fn()
			.mockResolvedValue([{ _id: "game123", players: [], winner: null }]),
	});

	const response = await request(app).get("/api/games/list");

	expect(response.status).toBe(200);
	expect(Array.isArray(response.body)).toBe(true);
});

test("GET /api/games/:gameId should return game details", async () => {
	const finalGame = {
		_id: "game123",
		players: [],
		creator: {},
		winner: null,
	};

	const thirdPopulate = jest.fn().mockResolvedValue(finalGame);
	const secondPopulate = jest.fn().mockReturnValue({ populate: thirdPopulate });
	const firstPopulate = jest.fn().mockReturnValue({ populate: secondPopulate });

	Game.findById.mockReturnValue({ populate: firstPopulate });

	const response = await request(app).get("/api/games/game123");

	expect(response.status).toBe(200);
	expect(response.body._id).toBe("game123");
});

test("POST /api/games/start/:gameId should start game if creator", async () => {
	const saveMock = jest.fn().mockResolvedValue();
	Game.findById.mockResolvedValue({
		creator: { equals: jest.fn().mockReturnValue(true) },
		started: false,
		save: saveMock,
	});

	const response = await request(app).post("/api/games/start/game123");

	expect(response.status).toBe(200);
	expect(response.body).toEqual({ success: true });
	expect(saveMock).toHaveBeenCalled();
});

test("POST /api/games/ready/:gameId should mark player ready", async () => {
	const saveMock = jest.fn().mockResolvedValue();
	Game.findById.mockResolvedValue({
		players: ["user123"],
		readyPlayers: [],
		save: saveMock,
	});

	const response = await request(app).post("/api/games/ready/game123");

	expect(response.status).toBe(200);
	expect(response.body.success).toBe(true);
	expect(saveMock).toHaveBeenCalled();
});

test("POST /api/games/bingo/:gameId should set winner and increment points", async () => {
	const saveMock = jest.fn().mockResolvedValue();
	Game.findById.mockResolvedValue({
		finished: false,
		winner: null,
		save: saveMock,
	});
	User.findByIdAndUpdate.mockResolvedValue();

	const response = await request(app).post("/api/games/bingo/game123");

	expect(response.status).toBe(200);
	expect(response.body.success).toBe(true);
	expect(saveMock).toHaveBeenCalled();
	expect(User.findByIdAndUpdate).toHaveBeenCalledWith("user123", {
		$inc: { points: 100 },
	});
});
