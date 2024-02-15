FROM ubuntu:latest AS build

RUN apt-get update && apt-get install -y nodejs npm \
    && rm -rf /var/lib/apt/lists/*

WORKDIR .

COPY package.json package-lock.json ./
RUN npm install --production

COPY . .
RUN npm run build

EXPOSE 3333

ENTRYPOINT ["npm", "run", "start"]
