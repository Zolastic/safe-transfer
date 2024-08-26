import { z } from "zod";

import { publicProcedure } from "@/server/api/trpc";

const createSafeTransferLink = publicProcedure
  .input(z.object({ content: z.string().min(1), expiresAt: z.date() }))
  .mutation(async ({ input, ctx }) => {
    const { content, expiresAt } = input;

    const createdSafeTransferRecord = await ctx.db.safeTransfer.create({
      data: {
        content,
        expiresAt,
      },
    });

    return {
      id: createdSafeTransferRecord.id,
    };
  });
export default createSafeTransferLink;
