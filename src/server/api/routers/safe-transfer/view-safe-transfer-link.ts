import { z } from "zod";

import { publicProcedure } from "@/server/api/trpc";
import Encryption from "@/lib/encryption";

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

    const encryption = new Encryption();
    const decryptedContent = encryption.decrypt(safeTransferRecord.content);

    if (!decryptedContent) {
      throw new Error("Failed to decrypt content");
    }

    return {
      content: decryptedContent,
    };
  });

export default viewSafeTransferLink;
