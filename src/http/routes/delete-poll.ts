import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";

export async function deletePoll(app: FastifyInstance) {
  app.delete("/polls/:pollId", async (request, reply) => {
    const deletePollParams = z.object({
      pollId: z.string().uuid(),
    });

    const { pollId } = deletePollParams.parse(request.params);
    let sessionIdCreatePoll = request.headers.getsetcookie;
    if (sessionIdCreatePoll) {
      const verifyPollDelete = await prisma.poll.findUnique({
        where: { id: pollId },
      });
      if (verifyPollDelete?.sessionIdCreatePoll == sessionIdCreatePoll) {
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
      }else{
        return reply.status(401).send({message: "sem permissão para deletar essa enquete"});
      }
    }
  });
}
