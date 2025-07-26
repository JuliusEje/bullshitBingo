const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const MeetingBingoField = require("../src/models/MeetingBingoField").default;

let mongoServer;

beforeAll(async () => {
	mongoServer = await MongoMemoryServer.create();
	await mongoose.connect(mongoServer.getUri());
	await MeetingBingoField.createIndexes();
});

afterAll(async () => {
	await mongoose.disconnect();
	await mongoServer.stop();
});

afterEach(async () => {
	await MeetingBingoField.deleteMany();
});

test("should create & save MeetingBingoField successfully", async () => {
	const fieldData = { phrase: "Synergieeffekte" };
	const field = new MeetingBingoField(fieldData);
	const savedField = await field.save();

	expect(savedField._id).toBeDefined();
	expect(savedField.phrase).toBe(fieldData.phrase);
});

test("should fail to create MeetingBingoField without required phrase", async () => {
	const field = new MeetingBingoField({});
	let err;
	try {
		await field.save();
	} catch (error) {
		err = error;
	}
	expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
	expect(err.errors.phrase).toBeDefined();
});

test("should not allow duplicate phrases", async () => {
	const fieldData = { phrase: "Quick win" };
	await new MeetingBingoField(fieldData).save();

	const duplicate = new MeetingBingoField(fieldData);
	let err;
	try {
		await duplicate.save();
	} catch (error) {
		err = error;
	}
	expect(err).toBeDefined();
	expect(err.code).toBe(11000);
});
