FROM ubuntu:latest AS build

RUN apt-get update
RUN apt-get install nodejs npm 
COPY . .

RUN npm install

RUN npx tsc

EXPOSE 3333

ENTRYPOINT ["npm", "run",  "start"]
