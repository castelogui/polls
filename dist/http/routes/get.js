"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = void 0;
async function get(app) {
    app.get("/", async (request, reply) => {
        //const polls = await prisma.poll.findMany({
        //  include: {
        //    options: {
        //      select: {
        //        id: true,
        //        title: true,
        //        score: true,
        //      },
        //    },
        //  },
        //});
        return reply.send({
            message: "Server is running",
        });
    });
}
exports.get = get;
