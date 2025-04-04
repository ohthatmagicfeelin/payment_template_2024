import prisma from '../../../../db/client.js';

export const passwordRepository = {
  createToken: async ({ token, userId, expiresAt }) => {
    return prisma.passwordResetToken.create({
      data: {
        token,
        userId,
        expiresAt
      }
    });
  },

  getValidToken: async (token) => {
    return prisma.passwordResetToken.findFirst({
      where: {
        token,
        used: false,
        expiresAt: {
          gt: new Date()
        }
      }
    });
  },

  markTokenAsUsed: async (token) => {
    return prisma.passwordResetToken.update({
      where: { token },
      data: { used: true }
    });
  },

  deleteExpiredTokens: async () => {
    return prisma.passwordResetToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { used: true }
        ]
      }
    });
  }
};