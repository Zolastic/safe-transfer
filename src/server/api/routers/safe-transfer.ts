import { createTRPCRouter } from "@/server/api/trpc";
import createSafeTransferLink from "./safe-transfer/create-safe-transfer-link";
import doesSafeTransferLinkExists from "./safe-transfer/does-safe-transfer-link-exists";
import viewSafeTransferContent from "./safe-transfer/view-safe-transfer-content";
import deleteExpiredSafeTransferRecords from "./safe-transfer/delete-expired-safe-transfer-records";

export const safeTransferRouter = createTRPCRouter({
  createSafeTransferLink: createSafeTransferLink,
  doesSafeTransferLinkExists: doesSafeTransferLinkExists,
  viewSafeTransferContent: viewSafeTransferContent,
  deleteExpiredSafeTransferRecords: deleteExpiredSafeTransferRecords,
});
