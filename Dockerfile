FROM node:12
WORKDIR /usr/src/Fist-Fighting-Animals

COPY package*.json ./


RUN npm install

COPY . .

EXPOSE 2500

CMD [ "node", "server.js" ]
