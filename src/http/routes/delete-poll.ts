import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";

export async function deletePoll(app: FastifyInstance) {
  app.delete("/polls/:pollId", async (request, reply) => {
    const deletePollParams = z.object({
      pollId: z.string().uuid(),
    });

    const { pollId } = deletePollParams.parse(request.params);

    const voteOptionsDelete = prisma.vote.deleteMany({
      where: { pollId },
    });

    const pollOptionDelete = prisma.pollOption.deleteMany({
      where: { pollId },
    });

    const pollDelete = prisma.poll.delete({ where: { id: pollId } });

    const transaction = await prisma.$transaction([
      voteOptionsDelete,
      pollOptionDelete,
      pollDelete,
    ]);

    return reply.status(201).send({ transaction });
  });
}
