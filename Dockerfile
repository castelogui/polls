FROM ubuntu:latest AS build

RUN apt-get update && apt-get install -y nodejs npm \
    && rm -rf /var/lib/apt/lists/*

COPY . .

WORKDIR .

RUN npm install --production

RUN npm run build

EXPOSE 3333

ENTRYPOINT ["npm", "run", "start"]
