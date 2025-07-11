const request = require('supertest');
const express = require('express');

jest.mock('../src/models/MeetingBingoField');
jest.mock('../src/models/InformaticsLecutreTerm');

const MeetingBingoField = require('../src/models/MeetingBingoField');
const InformaticsLectureTerm = require('../src/models/InformaticsLecutreTerm');
const bingoRoutes = require('../src/routes/bingoRoutes'); // ggf. Pfad anpassen

let app;

beforeAll(() => {
    app = express();
    app.use('/api/bingo', bingoRoutes);
});

afterEach(() => {
    jest.clearAllMocks();
});

test('GET /api/bingo/meeting returns 25 phrases', async () => {
    MeetingBingoField.aggregate.mockResolvedValue([
        { phrase: 'Synergieeffekte' },
        { phrase: 'Quick win' },
        { phrase: 'Stand-up' }
    ]);

    const res = await request(app).get('/api/bingo/meeting');

    expect(res.status).toBe(200);
    expect(res.body).toContain('Synergieeffekte');
    expect(res.body).toContain('Quick win');
    expect(res.body).toContain('Stand-up');
    expect(MeetingBingoField.aggregate).toHaveBeenCalledWith([{ $sample: { size: 25 } }]);
});

test('GET /api/bingo/lecture returns 25 terms', async () => {
    InformaticsLectureTerm.aggregate.mockResolvedValue([
        { term: 'Algorithmus' },
        { term: 'Datenstruktur' },
        { term: 'Komplexität' }
    ]);

    const res = await request(app).get('/api/bingo/lecture');

    expect(res.status).toBe(200);
    expect(res.body).toContain('Algorithmus');
    expect(res.body).toContain('Datenstruktur');
    expect(res.body).toContain('Komplexität');
    expect(InformaticsLectureTerm.aggregate).toHaveBeenCalledWith([{ $sample: { size: 25 } }]);
});

test('GET /api/bingo/meeting handles errors', async () => {
    MeetingBingoField.aggregate.mockRejectedValue(new Error('DB Fail'));

    const res = await request(app).get('/api/bingo/meeting');

    expect(res.status).toBe(500);
    expect(res.body.message).toMatch(/Serverfehler/);
});

test('GET /api/bingo/lecture handles errors', async () => {
    InformaticsLectureTerm.aggregate.mockRejectedValue(new Error('DB Fail'));

    const res = await request(app).get('/api/bingo/lecture');

    expect(res.status).toBe(500);
    expect(res.body.message).toMatch(/Serverfehler/);
});

