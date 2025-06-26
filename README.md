
# 📊 Meeting Bullshit Bingo

A humorous, accessible web app for meetings where too much is said – and too little gets done.

Create your personal bullshit bingo board with common business buzzwords like “quick win,” “leverage synergies,” or “we need to think big.” Perfect for online meetings, presentations, or workshops.

🌐 Live demo (optional): https://shitbingo.de

🛠️ Project status: In development
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file in `/bullshitBingo/Backend/.env`

`MONGO_URI=mongodb://localhost:27017/bullshitBingo`

`PORT=3000`

`SESSION_SECRET=zufaellig_langer_geheimer_string`
## 🚀 Run Locally

You can run the project either using Docker or by running backend and frontend manually via npm.

---

### 🔧 Option 1: Start with Docker

1. Clone the project:

    ```bash
    git clone https://github.com/JuliusEje/bullshitBingo
    cd bullshitBingo
    ```

2. Create a `.env` file in `/Backend` using the provided [Environment Variables](#environment-variables)

3. Start the application using Docker:

    ```bash
    docker-compose up --build
    ```

- Frontend: http://localhost:5173  
- Backend API: http://localhost:3000

---

### 💻 Option 2: Start Manually (Without Docker)

1. Clone the project:

    ```bash
    git clone https://github.com/JuliusEje/bullshitBingo
    cd bullshitBingo
    ```

2. Create a `.env` file in `/Backend` using the provided [Environment Variables](#environment-variables)

3. Start the Backend:

    ```bash
    cd Backend
    npm install
    node server.js
    ```

4. In a new terminal, start the Frontend:

    ```bash
    cd Frontend
    npm install
    npm run dev
    ```

- Frontend: http://localhost:5173  
- Backend API: http://localhost:3000
## Authors

- [@JuliusEje](https://github.com/JuliusEje)
- [@kargfel](https://github.com/kargfel)
- [@noah151004](https://github.com/noah151004)

