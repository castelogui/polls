import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";
import { redis } from "../../lib/redis";

type Poll = {
  id: "";
  title: "";
  createdAt: Date;
  updatedAt: Date;
  options: [
    {
      id: "";
      title: "";
      score: number;
    }
  ];
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

    const returnPolls: Poll[] = polls as Poll[];

    polls.map(async (poll, id) => {
      const result = await redis.zrange(poll.id, 0, -1, "WITHSCORES");

      const votes = result.reduce((obj, line, index) => {
        if (index % 2 === 0) {
          const score = result[index + 1];
          Object.assign(obj, { [line]: Number(score) });
        }
        return obj;
      }, {} as Record<string, number>);

      poll.options.map((option, i) => {
        returnPolls.map((returnPoll) => {
          returnPoll.options.map((optionReturn) => {
            console.log('teste');
            
            optionReturn.score =
              option.id in votes ? votes[optionReturn.id] : 0;
          });
        });
        //polls[id].options[i] = {
        //  id: option.id,
        //  title: option.title,
        //  score: option.id in votes ? votes[option.id] : 0,
        //};
      });
    });
    returnPolls.map(r=>{
      console.log(r);
      
    })
    return reply.send(returnPolls);
  });
}
