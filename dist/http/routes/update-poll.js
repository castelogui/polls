"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePoll = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../../lib/prisma");
async function updatePoll(app) {
    app.patch("/polls/:pollId", async (request, reply) => {
        const updatePollParams = zod_1.z.object({
            pollId: zod_1.z.string().uuid(),
        });
        const updatePollBody = zod_1.z.object({
            title: zod_1.z.string(),
            options: zod_1.z.array(zod_1.z.object({
                id: zod_1.z.string(),
                title: zod_1.z.string(),
            })),
        });
        const { pollId } = updatePollParams.parse(request.params);
        const { title, options } = updatePollBody.parse(request.body);
        let sessionIdCreatePoll = request.headers.getsetcookie;
        if (sessionIdCreatePoll) {
            const verifyPollUpdate = await prisma_1.prisma.poll.findUnique({
                where: { id: pollId },
            });
            if (verifyPollUpdate?.sessionIdCreatePoll == sessionIdCreatePoll) {
                // Deletar os votos associados às opções de enquete
                const deleteVotesPromises = options.map(async (option) => {
                    if (option.title == "") {
                        try {
                            await prisma_1.prisma.vote.deleteMany({
                                where: { pollOptionId: option.id },
                            });
                        }
                        catch (error) {
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
                            await prisma_1.prisma.pollOption.delete({ where: { id: option.id } });
                        }
                        catch (error) {
                            console.log(error);
                        }
                    }
                    else {
                        // Dividir a opção se contiver ponto e vírgula
                        const updatedOptions = option.title
                            .split(";")
                            .map((value) => value.trim());
                        // Remover a opção original se for dividida em múltiplas opções
                        if (updatedOptions.length > 1) {
                            try {
                                await prisma_1.prisma.pollOption.delete({ where: { id: option.id } });
                            }
                            catch (error) {
                                console.log(error);
                            }
                            // Criar novas opções
                            await Promise.all(updatedOptions.map(async (option) => {
                                try {
                                    await prisma_1.prisma.pollOption.create({
                                        data: {
                                            title: option,
                                            score: 0,
                                            pollId,
                                        },
                                    });
                                }
                                catch (error) {
                                    console.log(error);
                                }
                            }));
                        }
                        else {
                            // Atualizar a opção original
                            try {
                                await prisma_1.prisma.pollOption.update({
                                    where: { id: option.id },
                                    data: { title: option.title },
                                });
                            }
                            catch (error) {
                                console.log(error);
                            }
                        }
                    }
                });
                // Esperar todas as operações de deletar opções serem concluídas
                await Promise.all(updateOptionsPromises);
                // Atualizar o título da enquete
                try {
                    await prisma_1.prisma.poll.update({
                        where: { id: pollId },
                        data: {
                            title: title,
                        },
                    });
                }
                catch (error) {
                    console.log(error);
                }
                return reply.status(201).send();
            }
            else {
                return reply
                    .status(401)
                    .send({ message: "sem permissão para editar essa enquete" });
            }
        }
    });
}
exports.updatePoll = updatePoll;
