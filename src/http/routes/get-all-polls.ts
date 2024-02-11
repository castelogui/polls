import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";
import { redis } from "../../lib/redis";

type PollReturn = {
  id: String;
  title: String;
  createdAt: Date;
  updatedAt: Date;
  options: {
    id: string;
    title: string;
    score: number;
  }[];
};
export async function getAllPolls(app: FastifyInstance) {
  app.get("/polls", async (request, reply) => {
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

    const returnPolls: PollReturn[] = [] as PollReturn[];

    await Promise.all(
      polls.map(async (poll) => {
        const result = await redis.zrange(poll.id, 0, -1, "WITHSCORES");

        const votes = result.reduce((obj, line, index) => {
          if (index % 2 === 0) {
            const score = result[index + 1];
            Object.assign(obj, { [line]: Number(score) });
          }
          return obj;
        }, {} as Record<string, number>);

        const pollReturn = {
          id: poll.id,
          title: poll.title,
          createdAt: poll.createdAt,
          updatedAt: poll.updatedAt,
          options: poll.options.map((option) => {
            return {
              id: option.id,
              title: option.title,
              score: option.id in votes ? votes[option.id] : 0,
            };
          }),
        };
        returnPolls.push(pollReturn);
      })
    );

    return reply.send(returnPolls);
  });
}
