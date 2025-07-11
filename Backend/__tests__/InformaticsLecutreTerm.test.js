const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const InformaticsLectureTerm = require('../src/models/InformaticsLecutreTerm');

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
    await InformaticsLectureTerm.deleteMany();
});

test('should create & save InformaticsLectureTerm successfully', async () => {
    const termData = { term: 'WS 2025/26' };
    const term = new InformaticsLectureTerm(termData);
    const savedTerm = await term.save();

    expect(savedTerm._id).toBeDefined();
    expect(savedTerm.term).toBe(termData.term);
});

test('should not save InformaticsLectureTerm without required field', async () => {
    const term = new InformaticsLectureTerm({});
    let err;
    try {
        await term.save();
    } catch (error) {
        err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.term).toBeDefined();
});

test('should not allow duplicate terms', async () => {
    const termData = { term: 'WS 2025/26' };
    await new InformaticsLectureTerm(termData).save();

    const duplicate = new InformaticsLectureTerm(termData);
    let err;
    try {
        await duplicate.save();
    } catch (error) {
        err = error;
    }
    expect(err).toBeDefined();
    expect(err.code).toBe(11000); // duplicate key
});

