FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

CMD ["node", "src/server.js"]
EXPOSE 5100