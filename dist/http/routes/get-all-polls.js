"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPolls = void 0;
const prisma_1 = require("../../lib/prisma");
const redis_1 = require("../../lib/redis");
async function getAllPolls(app) {
    app.get("/polls", async (request, reply) => {
        const polls = await prisma_1.prisma.poll.findMany({
            include: {
                options: {
                    select: {
                        id: true,
                        title: true,
                        score: true,
                    },
                },
            },
        });
        const returnPolls = [];
        let sessionIdCreatePoll = request.headers.getsetcookie;
        await redis_1.redis.connect();
        await Promise.all(polls.map(async (poll) => {
            if (sessionIdCreatePoll == poll.sessionIdCreatePoll) {
                const result = await redis_1.redis.zRangeByScore(poll.id, 0, -1);
                const votes = result.reduce((obj, line, index) => {
                    if (index % 2 === 0) {
                        const score = result[index + 1];
                        Object.assign(obj, { [line]: Number(score) });
                    }
                    return obj;
                }, {});
                const pollReturn = {
                    id: poll.id,
                    title: poll.title,
                    createdAt: poll.createdAt,
                    updatedAt: poll.updatedAt,
                    options: poll.options.map((option) => {
                        return {
                            id: option.id,
                            title: option.title,
                            score: option.id in votes ? votes[option.id] : 0,
                        };
                    }),
                };
                returnPolls.push(pollReturn);
            }
        }));
        await redis_1.redis.disconnect();
        return reply.send(returnPolls);
    });
}
exports.getAllPolls = getAllPolls;
