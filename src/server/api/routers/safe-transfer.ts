import { createTRPCRouter } from "@/server/api/trpc";
import createSafeTransferLink from "./safe-transfer/create-safe-transfer-link";
import doesSafeTransferLinkExists from "./safe-transfer/does-safe-transfer-link-exists";
import viewSafeTransferLink from "./safe-transfer/view-safe-transfer-link";

export const safeTransferRouter = createTRPCRouter({
  createSafeTransferLink: createSafeTransferLink,
  doesSafeTransferLinkExists: doesSafeTransferLinkExists,
  viewSafeTransferLink: viewSafeTransferLink,
});
