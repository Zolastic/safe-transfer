import { createTRPCRouter } from "@/server/api/trpc";
import createSafeTransferLink from "./safe-transfer/create-safe-transfer-link";
import doesSafeTransferLinkExists from "./safe-transfer/does-safe-transfer-link-exists";

export const safeTransferRouter = createTRPCRouter({
  createSafeTransferLink: createSafeTransferLink,
  doesSafeTransferLinkExists: doesSafeTransferLinkExists,
});
