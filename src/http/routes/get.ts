import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";
import { redis } from "../../lib/redis";

export async function get(app: FastifyInstance) {
  app.get("/", async (request, reply) => {
    return reply.send({
      message: "Server is running",
    });
  });
}
