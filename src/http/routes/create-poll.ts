import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";
import { randomUUID } from "crypto";

export async function createPoll(app: FastifyInstance) {
  app.post("/polls", async (request, reply) => {
    const createPollBody = z.object({
      title: z.string(),
      options: z.array(z.string()),
    });

    const { title, options } = createPollBody.parse(request.body);

    let { sessionIdCreatePoll } = request.cookies;

    if (!sessionIdCreatePoll) {
      sessionIdCreatePoll = randomUUID();

      reply.setCookie("sessionIdCreatePoll", sessionIdCreatePoll, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30days
        signed: true,
        httpOnly: true,
      });
    }

    const poll = await prisma.poll.create({
      data: {
        title,
        sessionIdCreatePoll,
        options: {
          createMany: {
            data: options.map((o) => {
              return { title: o, score: 0 };
            }),
          },
        },
      },
    });

    return reply.status(201).send({ pollId: poll.id, sessionIdCreatePoll: sessionIdCreatePoll });
  });
}
