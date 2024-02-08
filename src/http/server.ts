import fastify from "fastify";
import cookie from "@fastify/cookie";
import { fastifyWebsocket } from "@fastify/websocket";
import { createPoll } from "./routes/create-poll";
import { getPoll } from "./routes/get-poll";
import { getAllPolls } from "./routes/get-all-polls";
import { voteOnPoll } from "./routes/vote-on-poll";
import { pollResults } from "./ws/poll-results";

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
app.register(pollResults)

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running");
});

export { app };
