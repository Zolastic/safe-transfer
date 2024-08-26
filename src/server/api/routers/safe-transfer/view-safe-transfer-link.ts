import { z } from "zod";

import { publicProcedure } from "@/server/api/trpc";

const viewSafeTransferLink = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input, ctx }) => {
    const { id } = input;

    const safeTransferRecord = await ctx.db.safeTransfer.findUnique({
      where: {
        id,
      },
    });

    if (!safeTransferRecord) {
      throw new Error("Safe transfer link not found");
    }

    return {
      content: safeTransferRecord.content,
    };
  });

export default viewSafeTransferLink;
