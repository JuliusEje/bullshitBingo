
# 📊 Meeting Bullshit Bingo

A humorous, accessible web app for meetings where too much is said – and too little gets done.

Create your personal bullshit bingo board with common business buzzwords like “quick win,” “leverage synergies,” or “we need to think big.” Perfect for online meetings, presentations, or workshops.

🌐 Live demo : https://shitbingo.de

🛠️ Project status: In development


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file in the root folder, 

```
MONGO_URI=mongodb://mongo:27017/bullshitBingo
PORT=3000
SESSION_SECRET=zufaellig_langer_geheimer_string
FRONTEND_ORIGIN=http://localhost:7456
```



the following in the ./Backend folder

```
MONGO_URI=mongodb://localhost:27017/bullshitBingo
PORT=3000
SESSION_SECRET=zufaellig_langer_geheimer_string
FRONTEND_ORIGIN=http://localhost:7456
```

and the following in the ./Frontend folder

```
VITE_API_URL=http://localhost:3000
```
## Authors

- [@JuliusEje](https://github.com/JuliusEje)
- [@kargfel](https://github.com/kargfel)
- [@noah151004](https://github.com/noah151004)
