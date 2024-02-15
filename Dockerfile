FROM ubuntu:latest AS build

RUN apt-get update && apt-get install -y nodejs npm \
    && npm install -g n \
    && n stable \
    && ln -sf /usr/local/bin/node /usr/bin/node

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3333

ENTRYPOINT ["npm", "run", "start"]
