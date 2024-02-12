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

    // Deletar os votos associados às opções de enquete
    const deleteVotesPromises = options.map(async (option) => {
      if (option.title == "") {
        try {
          await prisma.vote.deleteMany({
            where: { pollOptionId: option.id },
          });
        } catch (error) {
          console.log(error);
        }
      }
    });

    // Esperar todas as operações de deletar votos serem concluídas
    await Promise.all(deleteVotesPromises);

    // Deletar as opções de enquete
    const deleteOptionsPromises = options.map(async (option) => {
      if (option.title == "") {
        try {
          await prisma.pollOption.delete({ where: { id: option.id } });
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          await prisma.pollOption.update({
            where: { id: option.id },
            data: { title: option.title },
          });
        } catch (error) {
          console.log(error);
        }
      }
    });

    // Esperar todas as operações de deletar opções serem concluídas
    await Promise.all(deleteOptionsPromises);

    // Atualizar o título da enquete
    try {
      await prisma.poll.update({
        where: { id: pollId },
        data: {
          title: title,
        },
      });
    } catch (error) {
      console.log(error);
    }

    return reply.status(201).send();
  });
}
