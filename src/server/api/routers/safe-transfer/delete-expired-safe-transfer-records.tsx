import { publicProcedure } from "@/server/api/trpc";

const deleteExpiredSafeTransferRecords = publicProcedure.mutation(
  async ({ ctx }) => {
    await ctx.db.safeTransfer.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return {
      success: true,
    };
  },
);

export default deleteExpiredSafeTransferRecords;
