import prisma from '../client.js';

export const sessionRepository = {
    async deleteExpiredSessions() {
        const result = await prisma.session.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date()
                }
            }
        });
        return result.count;
    },

    async deleteSession(sessionId) {
        return prisma.session.delete({
            where: { sid: sessionId }
        });
    }
}; 