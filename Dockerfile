FROM node:20
RUN npm install
EXPOSE 3333
RUN npm run build
RUN npm run start
