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

    let sessionIdCreatePoll = request.headers.getsetcookie;
    if (sessionIdCreatePoll) {
      const verifyPollUpdate = await prisma.poll.findUnique({
        where: { id: pollId },
      });
      if (verifyPollUpdate?.sessionIdCreatePoll == sessionIdCreatePoll) {
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

        // Atualizar as opções de enquete
        const updateOptionsPromises = options.map(async (option) => {
          if (option.title == "") {
            try {
              await prisma.pollOption.delete({ where: { id: option.id } });
            } catch (error) {
              console.log(error);
            }
          } else {
            // Dividir a opção se contiver ponto e vírgula
            const updatedOptions = option.title
              .split(";")
              .map((value) => value.trim());

            // Remover a opção original se for dividida em múltiplas opções
            if (updatedOptions.length > 1) {
              try {
                await prisma.pollOption.delete({ where: { id: option.id } });
              } catch (error) {
                console.log(error);
              }

              // Criar novas opções
              await Promise.all(
                updatedOptions.map(async (option) => {
                  try {
                    await prisma.pollOption.create({
                      data: {
                        title: option,
                        score: 0,
                        pollId,
                      },
                    });
                  } catch (error) {
                    console.log(error);
                  }
                })
              );
            } else {
              // Atualizar a opção original
              try {
                await prisma.pollOption.update({
                  where: { id: option.id },
                  data: { title: option.title },
                });
              } catch (error) {
                console.log(error);
              }
            }
          }
        });

        // Esperar todas as operações de deletar opções serem concluídas
        await Promise.all(updateOptionsPromises);

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
      } else {
        return reply
          .status(401)
          .send({ message: "sem permissão para editar essa enquete" });
      }
    }
  });
}
