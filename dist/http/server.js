"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const fastify_1 = __importDefault(require("fastify"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const websocket_1 = require("@fastify/websocket");
const create_poll_1 = require("./routes/create-poll");
const get_poll_1 = require("./routes/get-poll");
const get_all_polls_1 = require("./routes/get-all-polls");
const delete_poll_1 = require("./routes/delete-poll");
const update_poll_1 = require("./routes/update-poll");
const vote_on_poll_1 = require("./routes/vote-on-poll");
const get_1 = require("./routes/get");
const poll_results_1 = require("./ws/poll-results");
const cors_1 = __importDefault(require("@fastify/cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, fastify_1.default)();
exports.app = app;
app.register(cookie_1.default, {
    secret: "polls-app-nlw",
    hook: "onRequest",
});
app.register(websocket_1.fastifyWebsocket);
app.register(create_poll_1.createPoll);
app.register(get_poll_1.getPoll);
app.register(get_all_polls_1.getAllPolls);
app.register(vote_on_poll_1.voteOnPoll);
app.register(poll_results_1.pollResults);
app.register(delete_poll_1.deletePoll);
app.register(update_poll_1.updatePoll);
app.register(get_1.get);
app.register(cors_1.default, {
    methods: ["GET", "PUSH", "PATCH", "DELETE"],
    origin: "https://webpolls.up.railway.app",
});
const PORT = process.env.PORT || 3333;
app.listen(PORT).then(() => {
    console.log("HTTP server running");
});
