const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');

// deine Routen importieren
const bingoRoutes = require('../src/routes/bingoRoutes');

// Express-App für Tests aufsetzen
const app = express();
app.use(express.json());
app.use('/bingo', bingoRoutes);

// Vor und nach Tests DB verbinden/trennen (optional)
beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Integration tests for bingo routes', () => {
    test('GET /bingo/meeting should return array of phrases', async () => {
        const res = await request(app).get('/bingo/meeting');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeLessThanOrEqual(25);
    });

    test('GET /bingo/lecture should return array of terms', async () => {
        const res = await request(app).get('/bingo/lecture');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeLessThanOrEqual(25);
    });

    test('GET /bingo/presentation should return array of phrases', async () => {
        const res = await request(app).get('/bingo/presentation');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeLessThanOrEqual(25);
    });
});
