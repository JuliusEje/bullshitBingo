const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../src/models/User").default;

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
	await User.deleteMany();
});

test("should create & save user successfully", async () => {
	const userData = { username: "alice", password: "secret" };
	const user = new User(userData);
	const savedUser = await user.save();

	expect(savedUser._id).toBeDefined();
	expect(savedUser.username).toBe(userData.username);
	expect(savedUser.points).toBe(0); // default
});

test("should hash the password before saving", async () => {
	const userData = { username: "bob", password: "mypass" };
	const user = new User(userData);
	const savedUser = await user.save();

	expect(savedUser.password).not.toBe("mypass");
	expect(savedUser.password.length).toBeGreaterThan(10); // bcrypt hash
});

test("should match password with matchPassword", async () => {
	const userData = { username: "carol", password: "mypassword" };
	const user = new User(userData);
	await user.save();

	const isMatch = await user.matchPassword("mypassword");
	expect(isMatch).toBe(true);

	const isNotMatch = await user.matchPassword("wrongpassword");
	expect(isNotMatch).toBe(false);
});

test("should not allow duplicate usernames", async () => {
	const userData = { username: "dave", password: "pass" };
	await new User(userData).save();

	let err;
	try {
		await new User(userData).save();
	} catch (error) {
		err = error;
	}
	expect(err).toBeDefined();
	expect(err.code).toBe(11000);
});
