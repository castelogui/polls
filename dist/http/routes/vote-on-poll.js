"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voteOnPoll = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../../lib/prisma");
const crypto_1 = require("crypto");
const redis_1 = require("../../lib/redis");
const voting_pub_sub_1 = require("../../utils/voting-pub-sub");
async function voteOnPoll(app) {
    app.post("/polls/:pollId/votes", async (request, reply) => {
        const voteOnPollBody = zod_1.z.object({
            pollOptionId: zod_1.z.string().uuid(),
        });
        const voteOnPollParams = zod_1.z.object({
            pollId: zod_1.z.string().uuid(),
        });
        const { pollId } = voteOnPollParams.parse(request.params);
        const { pollOptionId } = voteOnPollBody.parse(request.body);
        let sessionId = request.headers.getsetcookie;
        if (sessionId && sessionId !== "undefined") {
            const userPreviousVoteOnPoll = await prisma_1.prisma.vote.findUnique({
                where: {
                    sessionId_pollId: {
                        sessionId: sessionId.toString(),
                        pollId,
                    },
                },
            });
            if (userPreviousVoteOnPoll &&
                userPreviousVoteOnPoll.pollOptionId !== pollOptionId) {
                await prisma_1.prisma.vote.delete({
                    where: {
                        id: userPreviousVoteOnPoll.id,
                    },
                });
                await redis_1.redis.connect();
                const votes = await redis_1.redis.zIncrBy(pollId, -1, userPreviousVoteOnPoll.pollOptionId);
                voting_pub_sub_1.voting.publish(pollId, {
                    pollOptionId: userPreviousVoteOnPoll.pollOptionId,
                    votes: Number(votes),
                });
            }
            else if (userPreviousVoteOnPoll) {
                return reply
                    .status(400)
                    .send({ message: "You already voted on this poll" });
            }
        }
        if (!sessionId) {
            sessionId = (0, crypto_1.randomUUID)();
            reply.setCookie("sessionId", sessionId, {
                path: "/",
                maxAge: 60 * 60 * 24 * 30, // 30days
                signed: true,
                httpOnly: true,
            });
        }
        await prisma_1.prisma.vote.create({
            data: {
                pollId,
                pollOptionId,
                sessionId: sessionId.toString(),
            },
        });
        const votes = await redis_1.redis.zIncrBy(pollId, 1, pollOptionId);
        voting_pub_sub_1.voting.publish(pollId, {
            pollOptionId,
            votes: Number(votes),
        });
        await redis_1.redis.disconnect();
        return reply.status(201).send({ sessionId });
    });
}
exports.voteOnPoll = voteOnPoll;
