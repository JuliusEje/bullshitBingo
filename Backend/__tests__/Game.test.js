const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Game = require("../src/models/Game").default;

let mongoServer;

beforeAll(async () => {
	mongoServer = await MongoMemoryServer.create();
	await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
	await mongoose.disconnect();
	await mongoServer.stop();
});

afterEach(async () => {
	await Game.deleteMany();
});

test("should create & save Game with defaults", async () => {
	const game = new Game();
	const savedGame = await game.save();

	expect(savedGame._id).toBeDefined();
	expect(savedGame.mode).toBe("meeting");
	expect(savedGame.started).toBe(false);
	expect(savedGame.finished).toBe(false);
	expect(savedGame.createdAt).toBeInstanceOf(Date);
	expect(savedGame.fields.length).toBe(0);
	expect(savedGame.readyPlayers.length).toBe(0);
	expect(savedGame.players.length).toBe(0);
	expect(savedGame.playerFields.size).toBe(0);
	expect(savedGame.winner).toBeNull();
});

test("should save players, fields and playerFields correctly", async () => {
	const playerId = new mongoose.Types.ObjectId();
	const playerId2 = new mongoose.Types.ObjectId();
	const fields = ["A", "B", "C"];
	const playerFields = new Map();
	playerFields.set(playerId.toString(), ["A", "B"]);
	playerFields.set(playerId2.toString(), ["C"]);

	const game = new Game({
		players: [playerId, playerId2],
		creator: playerId,
		fields: fields,
		playerFields: playerFields,
		readyPlayers: [playerId],
	});

	const savedGame = await game.save();

	expect(savedGame.players).toHaveLength(2);
	expect(savedGame.creator.toString()).toBe(playerId.toString());
	expect(savedGame.fields).toEqual(fields);
	expect(savedGame.playerFields.get(playerId.toString())).toEqual(["A", "B"]);
	expect(savedGame.readyPlayers).toContainEqual(playerId);
});

test("should enforce mode enum values", async () => {
	const game = new Game({ mode: "invalidMode" });
	let err;
	try {
		await game.save();
	} catch (error) {
		err = error;
	}
	expect(err).toBeDefined();
	expect(err.errors.mode).toBeDefined();
});
