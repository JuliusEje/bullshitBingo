const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const MeetingBingoField = require('../../src/models/MeetingBingoField');
const app = require('../../server');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await MeetingBingoField.deleteMany({});
});

describe('Integration: GET /meeting', () => {
    it('should return 25 phrases from the db', async () => {
        // 30 Phrasen einfügen
        const phrases = Array.from({ length: 30 }, (_, i) => ({ phrase: `Phrase ${i+1}` }));
        await MeetingBingoField.insertMany(phrases);

        const res = await request(app).get('/meeting');

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(25);
        expect(res.body[0]).toMatch(/Phrase/);
    });

    it('should return an empty array if db is empty', async () => {
        const res = await request(app).get('/meeting');

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(0);
    });

    it('should not insert duplicate phrases due to unique constraint', async () => {
        await MeetingBingoField.create({ phrase: 'Hallo Welt' });

        await expect(
            MeetingBingoField.create({ phrase: 'Hallo Welt' })
        ).rejects.toThrow();
    });
});
