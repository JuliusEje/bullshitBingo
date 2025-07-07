const request = require('supertest');
const app = require('../server'); // <---- angepasst

jest.mock('../src/models/MeetingBingoField', () => ({
    aggregate: jest.fn()
}));

jest.mock('../src/models/InformaticsLecutreTerm', () => ({
    aggregate: jest.fn()
}));

const MeetingBingoField = require('../src/models/MeetingBingoField');
const InformaticsLectureTerm = require('../src/models/InformaticsLecutreTerm');

describe('GET /meeting', () => {
    it('should return 25 random meeting bingo phrases', async () => {
        MeetingBingoField.aggregate.mockResolvedValue(
            Array.from({ length: 25 }, (_, i) => ({ phrase: `Phrase ${i+1}` }))
        );

        const res = await request(app).get('/meeting');

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(25);
        expect(res.body[0]).toMatch(/Phrase/);
    });

    it('should handle server error', async () => {
        MeetingBingoField.aggregate.mockRejectedValue(new Error('DB Error'));

        const res = await request(app).get('/meeting');

        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({
            message: 'Serverfehler beim Abrufen der Meeting Bingo Phrasen.'
        });
    });
});

describe('GET /lecture', () => {
    it('should return 25 random lecture terms', async () => {
        InformaticsLectureTerm.aggregate.mockResolvedValue(
            Array.from({ length: 25 }, (_, i) => ({ term: `Term ${i+1}` }))
        );

        const res = await request(app).get('/lecture');

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(25);
        expect(res.body[0]).toMatch(/Term/);
    });

    it('should handle server error', async () => {
        InformaticsLectureTerm.aggregate.mockRejectedValue(new Error('DB Error'));

        const res = await request(app).get('/lecture');

        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({
            message: 'Serverfehler beim Abrufen der Informatik Vorlesungsbegriffe.'
        });
    });
});
