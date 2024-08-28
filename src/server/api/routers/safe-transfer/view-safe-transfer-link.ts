import { z } from "zod";

import { publicProcedure } from "@/server/api/trpc";
import Encryption from "@/lib/encryption";
import Hash from "@/lib/hash";

const viewSafeTransferLink = publicProcedure
  .input(
    z.object({
      id: z.string(),
      password: z
        .union([z.string().length(0), z.string().min(1)])
        .optional()
        .transform((e) => (e === "" ? undefined : e)),
    }),
  )
  .query(async ({ input, ctx }) => {
    const { id, password } = input;

    const safeTransferRecord = await ctx.db.safeTransfer.findUnique({
      where: {
        id,
      },
    });

    if (!safeTransferRecord) {
      throw new Error("Safe transfer link not found");
    }

    if (safeTransferRecord.passwordProtected && !password) {
      throw new Error("Password is required for password protected link");
    }

    if (
      safeTransferRecord.passwordProtected &&
      safeTransferRecord.password &&
      password
    ) {
      const hash = new Hash();
      const isValidPassword = await hash.compare(
        password,
        safeTransferRecord.password,
      );

      if (!isValidPassword) {
        throw new Error("Invalid password");
      }
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
