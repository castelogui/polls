import fastify from "fastify";
import cookie from "@fastify/cookie";
import { fastifyWebsocket } from "@fastify/websocket";
import { createPoll } from "./routes/create-poll";
import { getPoll } from "./routes/get-poll";
import { getAllPolls } from "./routes/get-all-polls";
import { deletePoll } from "./routes/delete-poll";
import { updatePoll } from "./routes/update-poll";
import { voteOnPoll } from "./routes/vote-on-poll";
import { get } from "./routes/get";
import { pollResults } from "./ws/poll-results";
import cors from "@fastify/cors";
import dotenv from "dotenv";

dotenv.config();

const app = fastify();

app.register(cookie, {
  secret: "polls-app-nlw",
  hook: "onRequest",
});

app.register(fastifyWebsocket);

app.register(createPoll);
app.register(getPoll);
app.register(getAllPolls);
app.register(voteOnPoll);
app.register(pollResults);
app.register(deletePoll);
app.register(updatePoll);
app.register(get);

app.register(cors, {
  methods: ["GET", "PUSH", "PATCH", "DELETE"],
  origin: "0.0.0.0",
});

const PORT = process.env.PORT || 3333;

// Alteração: usando a versão recomendada do listen
app.listen({
  port: Number(PORT),
  host: '0.0.0.0',
}).then(() => {
  console.log("HTTP server running");
});

export { app };
