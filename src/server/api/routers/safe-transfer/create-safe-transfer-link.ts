import { z } from "zod";

import { publicProcedure } from "@/server/api/trpc";
import Encryption from "@/lib/encryption";

const createSafeTransferLink = publicProcedure
  .input(z.object({ content: z.string().min(1), expiresAt: z.date() }))
  .mutation(async ({ input, ctx }) => {
    const { content, expiresAt } = input;

    const encryption = new Encryption();
    const encryptedContent = encryption.encrypt(content);

    if (!encryptedContent) {
      throw new Error("Failed to encrypt content");
    }

    const createdSafeTransferRecord = await ctx.db.safeTransfer.create({
      data: {
        content: encryptedContent,
        expiresAt,
      },
    });

    return {
      id: createdSafeTransferRecord.id,
    };
  });
export default createSafeTransferLink;
