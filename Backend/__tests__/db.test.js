const mongoose = require("mongoose");
const connectDB = require("../src/config/db");

jest.mock("mongoose", () => ({
    connect: jest.fn()
}));

describe('connectDB', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(process, 'exit').mockImplementation(() => {});
    });

    afterEach(() => {
        console.log.mockRestore();
        console.error.mockRestore();
        process.exit.mockRestore();
    });

    test('should connect successfully and log host', async () => {
        mongoose.connect.mockResolvedValue({
            connection: { host: 'localhost' }
        });

        await connectDB();

        expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        expect(console.log).toHaveBeenCalledWith("MongoDB Connected: localhost");
    });

    test('should handle connection error and exit process', async () => {
        const error = new Error('Connection failed');
        mongoose.connect.mockRejectedValue(error);

        await connectDB();

        expect(console.error).toHaveBeenCalledWith(`Error: ${error.message}`);
        expect(process.exit).toHaveBeenCalledWith(1);
    });
});
