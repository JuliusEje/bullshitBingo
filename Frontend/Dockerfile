# Frontend/Dockerfile
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Eigene Nginx-Konfiguration kopieren
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80