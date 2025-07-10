const protect = require('../src/middleware/authMiddleWare');
const User = require('../src/models/User');
jest.mock('../src/models/User');

describe('auth middleware protect', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            session: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    test('should call next if user is authenticated', async () => {
        req.session.userId = '123';
        User.findById.mockReturnValue({
            select: jest.fn().mockResolvedValue({ _id: '123', username: 'alice' })
        });

        await protect(req, res, next);

        expect(User.findById).toHaveBeenCalledWith('123');
        expect(req.user).toEqual({ _id: '123', username: 'alice' });
        expect(next).toHaveBeenCalled();
    });

    test('should return 401 if user not found', async () => {
        req.session.userId = '123';
        User.findById.mockReturnValue({
            select: jest.fn().mockResolvedValue(null)
        });

        await protect(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Nicht autorisiert, Benutzer nicht gefunden" });
    });

    test('should return 401 if no session', async () => {
        req.session = null;

        await protect(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Nicht autorisiert, keine Session" });
    });

    test('should return 500 on error', async () => {
        req.session.userId = '123';
        User.findById.mockImplementation(() => { throw new Error('DB Fail'); });

        await protect(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Serverfehler beim Authentifizieren" });
    });
});


