import { z } from "zod";

import { publicProcedure } from "@/server/api/trpc";

const doesSafeTransferLinkExists = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input, ctx }) => {
    const { id } = input;

    const safeTransferRecord = await ctx.db.safeTransfer.findUnique({
      where: {
        id,
      },
    });

    if (!safeTransferRecord) {
      return {
        exists: false,
      };
    }

    return {
      exists: !!safeTransferRecord,
      isPastExpiry: safeTransferRecord?.expiresAt < new Date(),
    };
  });

export default doesSafeTransferLinkExists;
