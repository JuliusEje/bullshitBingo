const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const authRoutes = require('../src/routes/authRoutes');
const User = require('../src/models/User');

const app = express();
app.use(express.json());
app.use(session({
    secret: 'testsecret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/testdb' }),
    cookie: { secure: false, httpOnly: true }
}));
app.use('/api/auth', authRoutes);

jest.setTimeout(30000);

beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe('Auth Integration Tests', () => {
    const userData = { username: 'testuser', password: 'password123' };
    let agent = request.agent(app); // wichtig für Session Handling

    test('POST /api/auth/register should register a user', async () => {
        const res = await agent
            .post('/api/auth/register')
            .send(userData);

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('Benutzer erfolgreich registriert');
        expect(res.body.username).toBe(userData.username);
    });

    test('POST /api/auth/login should login the user', async () => {
        const res = await agent
            .post('/api/auth/login')
            .send(userData);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Erfolgreich angemeldet');
        expect(res.body.username).toBe(userData.username);
    });

    test('GET /api/auth/me should return logged in user', async () => {
        const res = await agent.get('/api/auth/me');

        expect(res.statusCode).toBe(200);
        expect(res.body.username).toBe(userData.username);
        expect(res.body.points).toBeDefined();
    });

    test('POST /api/auth/logout should logout the user', async () => {
        const res = await agent.post('/api/auth/logout');

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Erfolgreich abgemeldet');
    });

    test('GET /api/auth/me after logout should fail', async () => {
        const res = await agent.get('/api/auth/me');

        expect(res.statusCode).toBe(401); // weil protect Middleware das blockiert
    });
});
