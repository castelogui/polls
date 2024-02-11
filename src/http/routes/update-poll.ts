import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";

export async function updatePoll(app: FastifyInstance) {
  app.patch("/polls/:pollId", async (request, reply) => {
    const updatePollParams = z.object({
      pollId: z.string().uuid(),
    });
    const updatePollBody = z.object({
      title: z.string(),
      options: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
        })
      ),
    });

    const { pollId } = updatePollParams.parse(request.params);
    const { title, options } = updatePollBody.parse(request.body);

    options.map(async (option) => {
      if (option.title == "") {
        await prisma.pollOption.delete({ where: { id: option.id } });
      }
    });

    options.map(async (option) => {
      try {
        const update = await prisma.pollOption.update({
          where: { id: option.id },
          data: {
            title: option.title,
          },
        });
        return update;
      } catch (error) {
        console.log(error);
      }
    });

    await prisma.poll.update({
      where: { id: pollId },
      data: {
        title: title,
      },
    });

    return reply.status(201).send();
  });
}
