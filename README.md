
# 📊 Meeting Bullshit Bingo

A humorous, accessible web app for meetings where too much is said – and too little gets done.

Create your personal bullshit bingo board with common business buzzwords like “quick win,” “leverage synergies,” or “we need to think big.” Perfect for online meetings, presentations, or workshops.

🌐 Live demo : <a href="http://julius.flxkln.de:7456" target="_blank">Bullshit Bingo</a>

🛠️ Project status: In development


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file in the root folder, 

```
MONGO_URI=mongodb://mongo:27017/bullshitBingo
PORT=3000
SESSION_SECRET=zufaellig_langer_geheimer_string
FRONTEND_ORIGIN=http://localhost:7456
```

and the following in the ./Frontend folder

```
VITE_API_URL=http://localhost:3000
```

## Installation

Then in the root directory run:

```bash
docker compose up --build
```
## File structure

```text
bullshitBingo/
├── Backend/
│   ├── __tests__/          # Automated unit and integration tests
│   ├── src/
│   │   ├── config/         # Configuration files (DB, environment variables)
│   │   ├── middleware/     # Express middleware (authentication, logging)
│   │   ├── models/         # Database models (Mongoose, Sequelize)
│   │   ├── routes/         # API routes (endpoint definitions)
│   ├── Dockerfile          # Container definition for backend service
│   ├── package.json        # Node dependencies and scripts
│   ├── server.js           # Backend server entry point
├── Frontend/
│   ├── nginx/              # Nginx server configuration
│   ├── src/
│   │   ├── assets/         # Static assets (images, fonts)
│   │   ├── components/     # Reusable UI components
│   │   ├── App.tsx         # Main React component
│   │   ├── index.css       # Global styles
│   │   ├── main.tsx        # Build entry point
│   │   ├── vite-env.d.ts   # Vite environment definitions
│   ├── Dockerfile          # Container definition for frontend service
│   ├── eslint.config.js    # Linting rules
│   ├── index.html          # HTML template
│   ├── package.json        # Node dependencies and scripts
│   ├── tsconfig.json       # TypeScript configuration
│   ├── vite.config.ts      # Vite build configuration
├── .gitignore
├── docker-compose.yml      # Multi-container orchestration
├── README.md
```

## Tech Stack

**Client:** React, TailwindCSS, Vite

**Server:** Node, Express

**Database:** MongoDB

**Others:** nginx, Docker
## Authors

- [@JuliusEje](https://github.com/JuliusEje)
- [@kargfel](https://github.com/kargfel)
- [@noah151004](https://github.com/noah151004)
