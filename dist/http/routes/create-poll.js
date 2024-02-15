"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPoll = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../../lib/prisma");
const crypto_1 = require("crypto");
async function createPoll(app) {
    app.post("/polls", async (request, reply) => {
        const createPollBody = zod_1.z.object({
            title: zod_1.z.string(),
            options: zod_1.z.array(zod_1.z.string()),
        });
        const { title, options } = createPollBody.parse(request.body);
        let sessionId = request.headers.getsetcookie;
        if (!sessionId || sessionId == "undefined") {
            sessionId = (0, crypto_1.randomUUID)();
            reply.setCookie("sessionId", sessionId, {
                path: "/",
                maxAge: 60 * 60 * 24 * 30, // 30days
                signed: true,
                httpOnly: true,
            });
        }
        if (sessionId) {
            const poll = await prisma_1.prisma.poll.create({
                data: {
                    title,
                    sessionIdCreatePoll: String(sessionId),
                    options: {
                        createMany: {
                            data: options.map((o) => {
                                return { title: o, score: 0 };
                            }),
                        },
                    },
                },
            });
            return reply.status(201).send({ pollId: poll.id, sessionId: sessionId });
        }
    });
}
exports.createPoll = createPoll;
