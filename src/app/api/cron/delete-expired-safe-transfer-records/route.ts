import { api } from "@/trpc/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log(
    "Running delete-expired-safe-transfer-records cron job at: ",
    new Date(),
  );
  if (
    req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  console.log("Deleting expired safe transfer records");

  try {
    await api.safeTransfer.deleteExpiredSafeTransferRecords();
  } catch (error) {
    console.error("Error deleting expired safe transfer records: ", error);
    return new NextResponse("Error deleting expired safe transfer records", {
      status: 500,
    });
  }

  return new NextResponse("Deleted expired safe transfer records", {
    status: 200,
  });
}
