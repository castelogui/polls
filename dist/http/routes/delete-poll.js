"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePoll = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../../lib/prisma");
async function deletePoll(app) {
    app.delete("/polls/:pollId", async (request, reply) => {
        const deletePollParams = zod_1.z.object({
            pollId: zod_1.z.string().uuid(),
        });
        const { pollId } = deletePollParams.parse(request.params);
        let sessionIdCreatePoll = request.headers.getsetcookie;
        if (sessionIdCreatePoll) {
            const verifyPollDelete = await prisma_1.prisma.poll.findUnique({
                where: { id: pollId },
            });
            if (verifyPollDelete?.sessionIdCreatePoll == sessionIdCreatePoll) {
                const voteOptionsDelete = prisma_1.prisma.vote.deleteMany({
                    where: { pollId },
                });
                const pollOptionDelete = prisma_1.prisma.pollOption.deleteMany({
                    where: { pollId },
                });
                const pollDelete = prisma_1.prisma.poll.delete({ where: { id: pollId } });
                const transaction = await prisma_1.prisma.$transaction([
                    voteOptionsDelete,
                    pollOptionDelete,
                    pollDelete,
                ]);
                return reply.status(201).send({ transaction });
            }
            else {
                return reply.status(401).send({ message: "sem permissão para deletar essa enquete" });
            }
        }
    });
}
exports.deletePoll = deletePoll;
