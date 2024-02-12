import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";
import { redis } from "../../lib/redis";

export async function get(app: FastifyInstance) {
  app.get("/", async (request, reply) => {
    const polls = await prisma.poll.findMany({
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
    return reply.send({
      message: "Server is running",
      polls,
    });
  });
}
