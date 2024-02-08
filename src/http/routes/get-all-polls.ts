import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";

export async function getAllPolls(app: FastifyInstance) {
  app.get("/polls", async (request, reply) => {
    const polls = await prisma.poll.findMany();

    return reply.send({ polls });
  });
}
