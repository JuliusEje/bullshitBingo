
# Bullshit Bingo

Diese Web-Application 

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file in `/bullshitBingo/Backend/.env`

`MONGO_URI=mongodb://localhost:27017/bullshitBingo`

`PORT=3000`

`SESSION_SECRET=zufaellig_langer_geheimer_string`
## Authors

- [@JuliusEje](https://github.com/JuliusEje)
- [@kargfel](https://github.com/kargfel)
- [@noah151004](https://github.com/noah151004)


## Run Locally

Clone the project

```bash
  git clone https://github.com/JuliusEje/bullshitBingo
```

Go to the project directory

```bash
  cd bullshitBingo
```

Create `.env` File in `/Backend` with the provided [Environment Variables](##-Environment-Variables)

Start Docker Container

```bash
  docker-compose up --build
```


