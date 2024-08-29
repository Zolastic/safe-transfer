import { z } from "zod";
import { publicProcedure } from "@/server/api/trpc";
import Encryption from "@/lib/encryption";
import Hash from "@/lib/hash";

const createSafeTransferLink = publicProcedure
  .input(
    z.object({
      content: z.string().min(1),
      expiresAt: z.date(),
      passwordProtected: z.boolean(),
      password: z
        .union([z.string().length(0), z.string().min(1)])
        .optional()
        .transform((e) => (e === "" ? undefined : e)),
      oneTimeView: z.boolean(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { content, expiresAt, passwordProtected, password, oneTimeView } =
      input;

    const encryption = new Encryption();
    const encryptedContent = encryption.encrypt(content);

    if (!encryptedContent) {
      throw new Error("Failed to encrypt content");
    }

    let hashedPassword: string | null = null;

    if (passwordProtected && password) {
      const hash = new Hash();
      hashedPassword = await hash.hash(password);
      if (!hashedPassword) {
        throw new Error("Failed to hash password");
      }
    }

    const createdSafeTransferRecord = await ctx.db.safeTransfer.create({
      data: {
        content: encryptedContent,
        expiresAt,
        passwordProtected,
        password: hashedPassword,
        oneTimeView,
      },
    });

    return {
      id: createdSafeTransferRecord.id,
    };
  });

export default createSafeTransferLink;
